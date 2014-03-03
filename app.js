/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var fs = require('fs');




/**
 * MongoDB
 */

// Connect to mongodb
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
  if (~file.indexOf('.js')) require(models_path + '/' + file)
});


/**
 * Config
 */

var app = express();
var controllers = require('./controllers');
var tasks = require('./controllers/tasks');
var users = require('./controllers/users');

//express.js settings, params app, __dirname
require('./config/express')(app, __dirname)

//routes.js params app, routes, tasks
require('./config/routes')(app, controllers, tasks, users)


/**
 * Launch
 */

//http://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen
app.listen(app.get('port'));
console.log("Server running");


