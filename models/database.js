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

    db.serialize(function() {
      console.log('in serialize');
      db.run(query);
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

module.exports = mongoose.model('Database', schema);

