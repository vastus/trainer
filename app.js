/**
 * Module dependencies.
 */

var express = require('express');
var controllers = require('./controllers');
var tasks = require('./controllers/tasks');
var users = require('./controllers/users');
var http = require('http');
var path = require('path');
var app = express();

/**
 * Config
 */

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


