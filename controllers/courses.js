/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Course = mongoose.model('Course'),
    Database = mongoose.model('Database');





/*
 * GET users
 */

exports.index = function(req, res){
  Course.find({}, function (err, courses) {
    res.render("courses/index", {courses: courses});
  });

};


/*
 * GET users/new
 */

exports.newCourse = function(req, res){
  Database.find({},function (err, databases){
    res.render("courses/new", {databases: databases});
  });
}


/*
 * POST users/new
 */

exports.createCourse = function(req, res){
  var name = req.body.name;
  var description = req.body.description;
  var active = req.body.active;
  Database.find({_id: req.params.database}, function(err, database){
    var course = new Course({name: name, description: description, active: active, database: database[0]});
    course.save(function (err, course) {
      if (err) return console.error(err);
      res.redirect('courses');
    });
  });
}


/*
 * GET users/show/:id
 */
exports.showCourse = function(req, res){
//  res.render('users/show', {user: User.find({_id: req.params.id})});
//  console.log(User.find({_id: req.params.id}));
//  console.log(require('util').inspect(User.find({_id: req.params.id})));
//  res.send(User.find({_id: req.params.id}));


  Course.find({_id: req.params.id}, function (err, course) {
    res.render('courses/show', {course: course});
  });


};
