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
    res.render('tasks/show.jade', {error: null, cols: [], rows: []});
};


/*
 * GET tasks/:id/execute
 */
exports.executeTask = function (req, res) {
    var id = req.params.id;
    var query = req.query.task_query;
    db.serialize(function() {
        db.all(query, function(err, rows) {
            if (err) {
                res.render('tasks/show.jade', {error: err, cols: [], rows: []});
            } else {
                var cols = [];
                for (var col in rows[0]) {
                    cols.push(col);
                }
                res.render('tasks/show.jade', {error: null, cols: cols, rows: rows});
            }
        });
    });
};


/*
 * GET users/new
 */
exports.newTask = function (req, res) {
    res.render('tasks/new.jade');
};

/*
 * POST users/new
 */

exports.createTask = function (req, res) {
  console.log(req.body);
  var taskname = req.body.task.name;
  var description = req.body.task.description;
  var query = req.body.task.query;

  //Create task from Task proto
  var newtask = new Task({name: taskname, description: description, correct_query: query});


  //Save to db
  newtask.save(function (err, task) {
    if (err) return console.error(err);
    res.redirect('tasks');
  });
}
