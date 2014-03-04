var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    // crypto = require('crypto');

var schema = new Schema({
    name: { type: String, default: '' },
    sql: { type: String, default: '' },
});

schema.methods = {};

module.exports = mongoose.model('Database', schema);

