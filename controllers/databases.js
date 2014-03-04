var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/course_db/test.db', sqlite3.OPEN_READONLY);

exports.newDatabase = function (req, res) {
    res.render('databases/new.jade');
};

