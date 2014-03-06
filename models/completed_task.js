/**
Contains the userID, taskID and the correct answer by the user.
**/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    task: {type: Schema.ObjectId, ref: 'Task'},
    user: {type: Schema.ObjectId, ref: 'User'},
  answer_query: {type: String, default: "error, should have answer here"}
});




module.exports = mongoose.model('CompletedTask', schema);
