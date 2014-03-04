var controllers = require('../controllers');
var tasks = require('../controllers/tasks');
var users = require('../controllers/users');
var databases = require('../controllers/databases');
var courses = require('../controllers/courses');


module.exports = function (app) {
    /**
     * Index routes.
     */
    app.get('/', controllers.index);

    /**
     * Task routes.
     */
    app.get('/tasks', tasks.index);
    app.get('/tasks/new', tasks.newTask);
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
    /**
     * Database routes.
     */
    app.get('/databases/new', databases.newDatabase);
};

