var mongoose = require('mongoose'),
    Task = mongoose.model('Task');




var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/course_db/test.db', sqlite3.OPEN_READONLY);


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
exports.executeTask = function (req, res) {
  console.log("asdasd");
    var id = req.params.id;
    var query = req.query.task_query;
    db.serialize(function() {
        db.all(query, function(err1, rows) {
            if (err1) {
                //ks. task.showTask
                Task.find({_id: req.params.id}, function (err2, task){
                  res.render('tasks/show', {task: task[0], error: err1, cols: [], rows: []})
                });
            } else {
                var cols = [];
                for (var col in rows[0]) {
                    cols.push(col);
                }
                //ks task.showTask
                Task.find({_id: req.params.id}, function (err, task){
                  res.render('tasks/show', {task: task[0], error: err, cols: cols, rows: rows})
                });
            }
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
