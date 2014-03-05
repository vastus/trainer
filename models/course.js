/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 * This is what MongoDB will save.
 */

var CourseSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: 'no description'},
  active: { type: Boolean, default: true},
  database: { type: Schema.ObjectId, ref: 'Database' },
  tasks: [{ type: Schema.ObjectId, ref: 'Task' }]
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

CourseSchema.methods = {
  check: function check(query){
  }

};

mongoose.model('Course', CourseSchema);
