var mongoose = require('mongoose');
var controllers = require('../controllers');
var tasks = require('../controllers/tasks');
var users = require('../controllers/users');
var databases = require('../controllers/databases');
var courses = require('../controllers/courses');
var sessions = require('../controllers/sessions')(mongoose);


module.exports = function (app) {
    /**
     * Index routes.
     */
    app.get('/', controllers.index);

    /**
     * Task routes.
     */
    //tasks index not needed (course/show handels this)
    //tasks new not needed (course/:id/tasks/new)
    app.get('/tasks/:id/execute', tasks.executeTask);
    app.get('/tasks/:id', tasks.showTask);
    app.post('/tasks', tasks.createTask);

    /**
     * User routes.
     */
    app.get('/users', users.index);
    app.get('/users/new', users.newUser);
    app.get('/users/:id', users.showUser);
    app.post('/users', users.createUser);

    /**
     * Course routes
     */
    app.get('/courses', courses.index);
    app.get('/courses/new', courses.newCourse);
    app.post('/courses', courses.createCourse);
    app.get('/courses/:id/tasks/new', tasks.newTask);
    app.get('/courses/:id', courses.showCourse);

    /**
     * Database routes.
     */
    app.get('/databases', databases.index);
    app.get('/databases/new', databases.newDatabase);
    app.get('/databases/:id/table/:table', databases.showTable);
    app.get('/databases/:id', databases.showDatabase);
    app.post('/databases', databases.createDatabase);
    app.get('/databases/:id/destroy', databases.destroyDatabase);

    /**
     * Session routes.
     */
    app.get('/login', sessions.newSession);
    app.post('/login', sessions.createSession);
    app.get('/logout', sessions.destroySession);
};

