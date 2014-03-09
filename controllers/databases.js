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
        if (!database) { res.send(404, 'Database not found'); return; }
        database.query("SELECT * FROM sqlite_master WHERE type='table';", function(err, cols, rows){
            console.log(rows);
            res.render('databases/show', { database: database, rows: rows });
        });
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

exports.destroyDatabase = function (req, res) {
    Database.findOne({ _id: req.params.id }, function (err, database) {
        if (!database) {
            res.send(404, '404 - Database not found.');
            return;
        }

        if(res.locals.currentUser
           && res.locals.currentUser.priviledges > 1){

          deleteDBFile(database.name);
          database.remove(function (err) {
            if (err) { console.log(err); }
            res.redirect('/databases');
          });
        }else{
          //illegal request to destroy db
          res.sed("permission denied!")
        }




    });
};

exports.showTable = function(req, res){
    Database.findOne({_id: req.params.id}, function(err, database){
        database.query("SELECT * FROM " + req.params.table, function(err, cols, rows){
            res.render('databases/table', {database: database,table: req.params.table, err: err, cols:cols, rows:rows});
        });
    });
};

function saveDBFile(filename) {
    var filepath = DBDIR + filename + '.db';
    deleteDBFile(filename);
    fs.writeFileSync(filepath, '');
}

function deleteDBFile(filename) {
    var filepath = DBDIR + filename + '.db';
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }
}

