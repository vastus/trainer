var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DBDIR = 'db/app_db/';

var schema = new Schema({
    name: { type: String, default: '' },
    sql: { type: String, default: '' },
});

schema.methods = {
    execute: function execute(query, cb) {
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(DBDIR + this.name + '.db');
        var commands = query.split(';');

        db.serialize(function() {
            for (var i = 0; i < commands.length; i++) {
                var command = commands[i].trim();
                if (command.length < 1) {
                    continue;
                }
                db.run(command);
            }
            db.close();
            return cb(null);
        });
    },

  query: function query(query, cb){
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(DBDIR + this.name + '.db', sqlite3.OPEN_READONLY);

    db.serialize(function() {
      db.all(query, function(err, rows) {

        if (err) return cb(err, null, null);
        var cols = [];
        for (var col in rows[0]) {
          cols.push(col);
        }
        return cb(null,cols,rows);
      });
    });
  }
};

var Database = mongoose.model('Database', schema);

/**
 * Validations.
 */
schema.path('name').validate(function (value, done) {
    Database.count({ name: value }, function (err, count) {
        if (err) return done(err);
        done(!count);
    });
}, 'Database name exists already. Name must be unique.');

module.exports = Database;

