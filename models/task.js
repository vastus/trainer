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
  check: function check(query){
    var userans = this.course.db.execute(query);
    var correct_ans = this.course.db.execute(correct_query);

    return userans==correct_answer
  }
};

mongoose.model('Task', TaskSchema);
