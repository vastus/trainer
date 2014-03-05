/**
 * Module dependencies.
 */
var express = require('express');
var fs = require('fs');
var mongo = require('mongodb');
var mongoose = require('mongoose');

/**
 * MongoDB
 */
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } }
  mongoose.connect('mongodb://localhost/trainerdb', options);
};
connect();

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
});

/**
 * Models
 */
var models_path = __dirname + '/models';

fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js') && file.substr(-3) === '.js')
    require(models_path + '/' + file)
});

/**
 * Config
 */
var app = express();

//express.js settings, params app, __dirname
require('./config/express')(app, __dirname);

//routes.js params app, routes, tasks
require('./config/routes')(app);

/**
 * Launch
 */
// http://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen
app.listen(app.get('port'));
console.log("Server running");

