var mongoose = require('mongoose'),
    Task = mongoose.model('Task');







/*
 * GET tasks
 */

exports.index = function (req, res) {

  Task.find({}, function (err, tasks) {
    res.render("tasks/index", {tasks: tasks});
//    console.log(tasks);
    });
};



/*
 * GET tasks/:id
 */
exports.showTask = function (req, res) {
  Task.find({_id: req.params.id}, function (err, task){
//    console.log(task);
//    res.send(task[0]);
    res.render('tasks/show', {task: task[0], error: null, cols: [], rows: []})
  });
};


/*
 * GET tasks/:id/execute
 */

//the following code is 100% shit but it works.


//wait for it...


//here we go:
exports.executeTask = function (req, res) {
  //find task, populate its course field
  Task.findOne({_id: req.params.id})
    .populate('course')
    .exec(function(err, task){
      //task found, now find it's course's database
      mongoose.model('Database')
        .findOne({_id: task.course.database}, function(err, db){
          if(err) console.log(err);
          //db found, run user query
          db.query(req.query.task_query, function(err, cols, rows){
            if(err) res.render('tasks/show', {error: err,
                                              task: task,
                                              query: req.query.task_query,
                                              success: false});
            else{
              //no errors!! wow!! such SQL!!! now check the answer.
              task.check(cols, rows, function(err, bool){

                //console.log("debug: " + bool + " " + res.locals.currentUser);
                if(bool && res.locals.currentUser){
                  //console.log("correct!");

                  //mark this task completed if it was correct
                  task.markCompleted(res.locals.currentUser,
                                     task,
                                     req.query.task_query,
                                     //render everything - phew !
                                     function(err,bool){res.render('tasks/show', {task: task,
                                          error: err,
                                          cols: cols,
                                          rows: rows,
                                          query: req.query.task_query,
                                          success: bool
                                          });
                                     });
                } else {
                  //yes, you can see copypaste code below. Deal with it. Fix it. asdkajsdlkasj
                  res.render('tasks/show', {task: task,
                                          error: err,
                                          cols: cols,
                                          rows: rows,
                                          query: req.query.task_query,
                                          success: bool
                                          });
                }
//gotta love this shit.
              });
            }
          });
        });
  });
};


/*
 * GET users/new
 */
exports.newTask = function (req, res) {
    res.render('tasks/new.jade', {course_id: req.params.id});
};

/*
 * POST users/new
 */

exports.createTask = function (req, res) {
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

    res.redirect('tasks');
  });
}
