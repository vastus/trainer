var express = require('express');
var routes = require('./routes');
var tasks = require('./routes/tasks');
var http = require('http');
var path = require('path');
var app = express();

//express.js settings
require('./config/express')(app, __dirname)
//routes.js
require('./config/routes')(app, routes, tasks)


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
