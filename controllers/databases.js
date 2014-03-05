var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('db/course_db/test.db', sqlite3.OPEN_READONLY);
var mongoose = require('mongoose');
var Database = mongoose.model('Database');
var DBDIR = 'db/app_db/';

exports.index = function (req, res) {
    Database.find(function (err, databases) {
        if (err) res.send(err);
        else res.render('databases/index', { databases: databases });
    });
};

exports.showDatabase = function (req, res) {
    Database.findOne({ _id: req.params.id }, function (err, database) {
        res.render('databases/show', { database: database });
    });
};

exports.newDatabase = function (req, res) {
    res.render('databases/new');
};

exports.createDatabase = function (req, res) {
    var dbParams = req.body.database;
    var database = new Database(dbParams);
    saveDBFile(database.name);
    database.save(function (err, database) {
        if (err) {
            res.send(err);
            return;
        }

        database.execute(database.sql, function (err) {
            if (err) {
                res.send(err);
                return;
            }

            res.redirect('/databases');
        });
    });
};

function saveDBFile(filename) {
    var filepath = DBDIR + filename + '.db';
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
    } else {
        fs.writeFileSync(filepath, '');
    }
};

