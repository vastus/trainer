module.exports = function (app, routes, tasks, users, databases) {
    /**
     * Index routes.
     */
    app.get('/', routes.index);

    /**
     * Task routes.
     */
    app.get('/tasks/:id', tasks.showTask);
    app.get('/tasks/:id/execute', tasks.executeTask);

    app.get('/tasks/new', tasks.newTask);
    // app.post('/tasks', tasks.createTask);


    /**
     * User routes.
     */
    app.get('/users', users.index);
    app.get('/users/new', users.newUser);
    app.get('/users/:id', users.showUser);
    app.post('/users', users.createUser);

    /**
     * Database routes.
     */
    app.get('/databases/new', databases.newDatabase);
};

