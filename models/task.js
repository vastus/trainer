/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    mongoose.model('Course')
            .findOne({_id: this.course})
            .populate('database')
            .exec(function(err, course){
              //console.log(course.database);
              //console.log(thisTask.correct_query);
              course.database.query(thisTask.correct_query, function(err, cols, rows){
                if(err) return cb(err, false)

                //console.log(userRows);
                //console.log(rows);
                //console.log(userCols);
                //console.log(cols);


                if(userCols.toString()==cols.toString()
                   && userRows.toString() ==rows.toString()){
                  return cb(err, true);
                }
                return cb(err, false);
              });
            });


    //this.populate('course')
    //this.course.db.execute(query);
    //var correct_ans = this.course.db.execute(correct_query);

    //return userans==correct_answer
  }
};

mongoose.model('Task', TaskSchema);
