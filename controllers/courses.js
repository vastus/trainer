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
  Course.findOne({_id: req.params.id}).populate('database').populate('tasks').populate('students').exec(function (err, course) {
    var found = false;
    if(res.locals.currentUser){
        for(var i = 0; i < course.students.length; i++){
            var student = course.students[i];
            if(student.username == res.locals.currentUser.username){
	        found = true;
                break;
            }
        }
    }
    res.render('courses/show', {course: course, participates: found});
  });
};

exports.joinCourse = function(req, res){
    if(!res.locals.currentUser){
        res.send("Much hack?");
        return;
    }

    Course.findOne({_id: req.params.id}).populate('students').exec(function(err, course){
        var found = false;    
        for(var student in course.students){
            if(course.students[student].username == res.locals.currentUser.username){
                found = true;
                break;
            }    
        }
        if(!found){
            course.students.push(res.locals.currentUser);
            course.save();
        }
	res.redirect("/courses/" + req.params.id);
    });
}
