var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    // crypto = require('crypto');

var schema = new Schema({
    name: { type: String, default: '' },
    sql: { type: String, default: '' },
});

schema.methods = {
    execute: function execute(query, cb) {
                 console.log('in schema exec');
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('db/course_db/' + this.name + '.db');

        db.serialize(function() {
            console.log('in serialize');
            db.run(query);
            db.close();
            return cb(null);
            //db.all(query, function(err, rows) {
            //    console.log(query);
            //    if (err) return { error: err, cols: null, rows: null };
            //    var cols = [];
            //    for (var col in rows[0]) {
            //        cols.push(col);
            //    }
            //    return { error: null, cols: cols, rows: rows };
            //});
        });
    }
};

module.exports = mongoose.model('Database', schema);

