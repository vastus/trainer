module.exports = function (app, routes, tasks) {
  app.get('/', routes.index);

  /**
   * Routes for tasks.
   */
  app.get('/tasks', tasks.index);
  app.post('/tasks', tasks.execute);
};

