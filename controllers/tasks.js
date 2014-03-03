var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/course_db/test.db', sqlite3.OPEN_READONLY);

exports.index = function (req, res) {
  res.render('tasks/index.jade', {error: null, cols: [], rows: []});
};

exports.create = function (req, res) {
    var query = req.body.task_query;
    db.serialize(function() {
        db.all(query, function(err, rows) {
            if (err) {
                res.render('tasks/index.jade', {error: err, cols: [], rows: []});
            } else {
                var cols = [];
                for (var col in rows[0]) {
                    cols.push(col);
                }
                res.render('tasks/index.jade', {error: null, cols: cols, rows: rows});
            }
        });
    });
};

