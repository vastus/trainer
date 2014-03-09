/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');
var async = require('async');

/*
 * GET users
 */
exports.index = function(req, res){
  if (res.locals.currentUser && res.locals.currentUser.priviledges > 2){
    User.find({}, function (err, users) {
      res.render("users/index", {users: users});
    });
  } else {
    res.send("permission denied");
  }
};


/*
 * GET users/new
 */
exports.newUser = function(req, res){
  res.render("users/new");
}


/*
 * POST users/new
 */
exports.createUser = function(req, res){
  //console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;

  if(password != req.body.password_confirmation){
    res.render("users/new", {error:"Salasanat eivät täsmää", username: username});
    return;
  }

  //Create user from User prototype
  var newuser = new User({username: username, password: password, priviledges: 1});

  //Save to db
  newuser.save(function (err, user) {
    if (err) {
      return res.render('users/new', {
          error: 'Käyttäjätunnus varattu.',
          username: username
      });
    }
    res.redirect('/');
  });
}


/* SHOW
 * GET users/:id
 */
exports.showUser = function(req, res){

  //current user pitää olla sama kuin pyydetty, paitsi jos admin (admin saa nähdä kaiken)
  if((res.locals.currentUser && res.locals.currentUser.username==req.params.id)
      || (res.locals.currentUser && res.locals.currentUser.priviledges == 3)){

    User.findOne({username: req.params.id})
        .populate('tasks')
        .exec( function (err, user) {

          async.map(
            user.tasks,
            function(item, callback){
              mongoose.model('Task').findOne({_id: item.task}, function(err, task){
                //console.log("task is: " + task);

                var data = {completedTask: item, task: task};
                //console.log("data is: " + data);
                callback(err, data);
              });
            },
            function(err, result){
              //console.log(result);
              res.render('users/show', {user: user, tasks: result});
            }
          )
      });
  } else {
    res.send("permission denied");
  }
};
