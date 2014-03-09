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
 * Methods
 */

TaskSchema.methods = {

  //checks if the answer was right
  check: function check(userCols, userRows, cb){

    //for some reason this is needed because course.database.query fails when using "this.correct_query"
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

  //marks the task completed, unless the same task with the same answer is already marked.
  markCompleted: function markCompleted(user, task, query, cb){
    console.log("markCompleted");
    var CompletedTask = mongoose.model('CompletedTask');


    async.series([
      //check if CompletedTask with this query already saved (no need to save again!)
      function(callback) {
        CompletedTask.find({user: user.id, task: task.id}, function(err, ctasks){
          for(var i =0; i<ctasks.length; i++){
            if(ctasks[i].answer_query==query){
              return callback("duplicate", false);
            }
          }
          return callback(null, true);
        });
      },
      //if the above did not throw duplicate error, save new completedTask to db
      function(callback) {
        var newCompletedTask = new CompletedTask({task: task._id, user: user._id, answer_query: query});
          newCompletedTask.save(function(err, task){
            if(err) return cb(err);

            //update user.tasks
            user.tasks.push(task);
            user.save(function(err, user){
              return callback(err, true);
            });
          });

      }
    ],
      //callback for async. series
      function(err, results){
        //return like everything normal, controller does not need to know what just happened (completedTask saved or not saved)
        cb(null, true);
      });
  }
};

mongoose.model('Task', TaskSchema);
