var mongoose = require('mongoose'),
    Task = mongoose.model('Task');
var async = require('async');
var cache = require('memory-cache');



/*
 * GET tasks - ONLY FOR ADMIN
 */

exports.index = function (req, res) {
  if(res.locals.currentUser && res.locals.currentUser.priviledges==3){
    Task.find({}, function (err, tasks) {
      res.render("tasks/index", {tasks: tasks});
    });
  } else {
    res.send("permission denied!");
  }

};



/*
 * GET tasks/:id
 */
exports.showTask = function (req, res) {
  Task.findOne({_id: req.params.id})
      .populate('course')
      .exec(
        function (err, task){
          getModelAnswer(task, function(err, rows, cols){
            //if there was a query in the URL (for example, user's previous solution to the task from users/show)
            if(req.query.task_query){
              res.render('tasks/show', {task: task, query: req.query.task_query, error: null, cols: [], rows: [], mcols: rows, mrows: cols});
              return;
            }
            res.render('tasks/show', {task: task, error: null, cols: [], rows: [], mcols: rows, mrows: cols})
          });
      });
};


/*
 * GET tasks/:id/execute
 */

exports.executeTask = function (req, res) {

  //find task, populate its course field
  Task.findOne({_id: req.params.id})
    .populate('course')
    .exec(function(err, task){

      async.series([

        function(callback){
          getModelAnswer(task, callback);
        },

        //get user answer
        function(callback){
          runQuery(task, req.query.task_query, function(err, rows, cols){
            callback(err, rows, cols);
          });
        }
      ], function(err, results){
        //async.series callback

        //pull data from results
        var rows = results[1][1];
        var cols = results[1][0];
        var mrows = results[0][1];
        var mcols = results[0][0];


        if(err) res.render('tasks/show', {error: err, task: task, query: req.query.task_query, success: false, mcols: mcols, mrows: mrows});
        else{
          task.check(cols, rows, function(err, bool){

              //if wrong or no current user, don't try to save
              if(bool && res.locals.currentUser){

                //mark this task completed (if it was correct)
                task.markCompleted(res.locals.currentUser,task,req.query.task_query, function(err,bool){
                  res.render('tasks/show', {task: task, error: err, cols: cols, rows: rows, query: req.query.task_query, success: bool, mcols: mcols, mrows: mrows});
                });

              } else {
                //not logged in or wrong answer
                res.render('tasks/show', {task: task,error: err,cols: cols,rows: rows,query: req.query.task_query,success: bool, mcols: mcols, mrows: mrows});
              }
            });//task.check
        }
      });//async.series
  });//.exec
};//executeTask


/*
 * GET /courses/:id/tasks/new
 */
exports.newTask = function (req, res) {
  if(res.locals.currentUser && res.locals.currentUser.priviledges>1){
    res.render('tasks/new.jade', {course_id: req.params.id});
  } else {
    res.send("permission denied!");
  }
};

/*
 * POST tasks/new
 */

exports.createTask = function (req, res) {

  if(res.locals.currentUser && res.locals.currentUser.priviledges>1){

    var taskname = req.body.task.name;
    var description = req.body.task.description;
    var query = req.body.task.query;
    var course = req.body.task.course_id;

    //Create task from Task proto
    var newtask = new Task({name: taskname, description: description, correct_query: query, course: course});


    //Save to db
    newtask.save(function (err, task) {
      if (err) return console.error(err);

      mongoose.model('Course').findOne({_id: course}, function(err, course){
        course.tasks.push(task);
        course.save();
      });

      res.redirect('/courses/' + course);
    });
  } else {
    // someone trying an illegal POST request,
    //as the legal form is accessible only by priviledges>1
    res.send("nice try!");
  }
}

//takes task populated with course as param, uses cache!
function getModelAnswer(task, callback){
  var cached = cache.get(task.id);
    if(cached){
      callback(null, cached.rows, cached.cols);
    }else{
      runQuery(task, task.correct_query, function(err, rows, cols){
        //ikuinen cache, taskeja ei toistaiseksi voi muutenkaan muuttaa...
        cache.put(task.id, {rows: rows, cols: cols});
        callback(err, rows, cols);
      });
    }
};

//takes task populated with course as param
function runQuery(task, query, cb){
  mongoose.model('Database')
        .findOne({_id: task.course.database}, function(err, db){
          if(err) console.log(err);

          //db found, run user query
          db.query(query, function(err, cols, rows){
            return cb(err, cols, rows);
          });
        });
}
