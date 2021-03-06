var express = require('express');
var path = require('path');
var helpers = require('../controllers/helpers');

/**
 * Express settings
 * Params: express app, root dir __dirname
 */

module.exports = function (app, dirname) {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(helpers.currentUser);
    app.use(app.router);
    app.use(require('stylus').middleware(path.join(dirname, 'public')));

    if ('development' == app.get('env')) {
        // Do not use these in production.
        app.use(express.errorHandler());
        app.use(express.static(path.join(dirname, 'public')));
    }

};

