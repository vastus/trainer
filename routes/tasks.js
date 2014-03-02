var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/test.db', sqlite3.OPEN_READONLY);

exports.index = function(req, res){
  res.render('tasks/index.jade');
};

exports.create = function(req, res){

  // tulosta rivit
  // renderöi show page

    var query = req.body.task_query;
    db.serialize(function() {
        db.all(query, function(err, rows) {
            // console.log(row.id + ": " + row.info);
            if (err) {
                console.log(err);
                return;
            }

            res.render('tasks/index.jade', {rows: rows});
        });
    });

    // db.close();
};

