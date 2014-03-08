module.exports = function Sessions(mongoose) {
    var User = mongoose.model('User');

    function neuu(req, res) {
        res.render('sessions/new');
    }

    function create(req, res) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) { res.send(err); return; }
            if (user && user.authenticate(req.body.password)) {
                req.session.userId = user._id;
                res.redirect('/');
            } else {
                res.render('sessions/new');
            }
        });
    }

    function destroy(req, res) {
        req.session.userId = null;
        res.redirect('/');
    }

    return {
        newSession: neuu,
        createSession: create,
        destroySession: destroy
    };
};

