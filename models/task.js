/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var async = require('async');

/**
 * User Schema
 * This is what MongoDB will save.
 */

var TaskSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: 'no description'},
  correct_query: {type: String, default: ''},
  blacklist: {type: Array, default: []},
  whitelist: {type: Array, default: []},
  course: { type: Schema.ObjectId, ref: 'Course' }
});



/**
 * Virtuals - attributes you can get/set but are not saved to MongoDB.
 *
 * User.password works now, although mongoDB does not have field "password".
 */

//TaskSchema
//  .virtual('correct_answer');
//  .get(function() { return this. });




/**
 * Methods - public API
 */

TaskSchema.methods = {
  //validates cols and rows with correct_query answer
  check: function check(userCols, userRows, cb){
    var thisTask = this;

    //find course db
    mongoose.model('Course')
            .findOne({_id: this.course})
            .populate('database')
            .exec(function(err, course){
              //run query in course db
              course.database.query(thisTask.correct_query, function(err, cols, rows){
                if(err) return cb(err, false)

                //validate query against answer query
                if(userCols.toString()==cols.toString()
                   && userRows.toString() ==rows.toString()){
                  return cb(err, true);
                }
                return cb(err, false);
              });
            });
  },
  markCompleted: function markCompleted(user, task, query, cb){
    console.log("markCompleted");
    var CompletedTask = mongoose.model('CompletedTask');
    async.series([
      function(callback) {
        CompletedTask.find({user: user.id, task: task.id}, function(err, ctasks){
          console.log(ctasks);

          for(var i =0; i<ctasks.length; i++){
            console.log(ctasks[i].answer_query + "   vs.   " + query);
            ctasks[i].answer_query==query
            if(ctasks[i].answer_query==query){
              console.log("not saving!");
              return callback("duplicate", false);
            }
          }
          return callback(null, true);
        });
      },

      function(callback) {
        var newCompletedTask = new CompletedTask({task: task._id, user: user._id, answer_query: query});
          newCompletedTask.save(function(err, task){
            if(err) return cb(err);
            user.tasks.push(task);
            user.save(function(err, user){
              console.log("user saved too.");
              return callback(err, true);
            });
          });

      }
    ],
      //callback
      function(err, results){
        console.log(err);
        //return like everything normal, controller does not need to know what just happened
        cb(null, true);
      });
  }
};

mongoose.model('Task', TaskSchema);
