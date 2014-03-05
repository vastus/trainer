var mongoose = require('mongoose');

module.exports = (function Helpers() {
    function currentUser(req, res, next) {
        var User = mongoose.model('User');
        if (req.session && req.session.userId) {
            User.findOne({ _id: req.session.userId }, function (err, user) {
                if (err) console.log(err);
                res.locals.currentUser = user;
                next();
            });
        } else {
            res.locals.currentUser = null;
            next();
        }
    }

    return {
        currentUser: currentUser
    };
})();

