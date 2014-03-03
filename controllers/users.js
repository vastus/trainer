
/*
 * GET users listing.
 */

exports.index = function(req, res){
  res.send("respond with a resource");
};

exports.newUser = function(req, res){
  res.render("users/new");
}

exports.create = function(req, res){
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  if(password != req.body.password_confirmation){
    res.render("users/new", {error:"Salasanat eivät täsmää", username: username});
    return;
  }
  res.redirect("/users");
  
} 
