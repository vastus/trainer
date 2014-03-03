module.exports = function (app, routes, tasks, users) {
  app.get('/', routes.index);

  /**
   * Routes for tasks.
   */
  app.get('/tasks', tasks.index);
  app.post('/tasks', tasks.execute);

  app.get('/users', users.index);
  app.get('/users/new', users.newUser);
  app.post('/users', users.create);

};
