module.exports = function (app, routes, tasks, users) {
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
    app.post('/users', users.create);
};

