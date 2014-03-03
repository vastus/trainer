module.exports = function (app, routes, tasks) {
    app.get('/', routes.index);

    /**
     * Routes for tasks.
     */
    app.get('/tasks/:id', tasks.showTask);
    app.get('/tasks/:id/execute', tasks.executeTask);

    app.get('/tasks/new', tasks.newTask);
    // app.post('/tasks', tasks.createTask);
};

