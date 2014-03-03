var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var schema = new Schema({
    name: { type: String, default: '' },
    creates: { type: String, default: '' },
    inserts: { type: String, default: '' }
});

schema.methods = {};

mongoose.model('database', schema);

