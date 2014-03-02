

module.exports = function (app, routes, tasks) {

  app.get('/', routes.index);
//app.get('/users', user.list);
  app.get('/tasks', tasks.index);
  app.post('/tasks', tasks.create);
}
