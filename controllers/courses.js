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
  Database.findOne({_id: req.body.database}, function(err, database){
    if(err){
      console.log(err);
      res.render("courses/new");
    }else{
      
      var course = new Course({name: name, description: description, active: active, database: database});
      course.save(function (err, course) {
        if (err) return console.error(err);
        res.redirect('courses');
      });
    }
  });
}


/*
 * GET users/show/:id
 */
exports.showCourse = function(req, res){
  Course.find({_id: req.params.id}, function (err, course) {
    res.render('courses/show', {course: course});
  });
};
