/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

/*
 * GET users
 */
exports.index = function(req, res){

  User.find({}, function (err, users) {
    res.render("users/index", {users: users});
    console.log(users);
    });

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
  var newuser = new User({username: username, password: password});

  //Save to db
  newuser.save(function (err, user) {
    if (err) return console.error(err);
    res.redirect('users');
  });
}


/* SHOW
 * GET users/:id
 */
exports.showUser = function(req, res){
  User.findOne({username: req.params.id})
      .populate('tasks')
      .exec( function (err, user) {
        //res.send(user.tasks[0]);
        res.render('users/show', {user: user, tasks: user.tasks[0]});
    });
};
