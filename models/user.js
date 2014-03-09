
//https://github.com/madhums/node-express-mongoose-demo
//http://mongoosejs.com/docs/guide.html


/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto')

/**
 * User Schema
 * This is what MongoDB will save.
 */

var UserSchema = new Schema({
  username: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  tasks: [Schema.Types.Objectid],
  priviledges: {type: Number, default:'1'}
  //1 or empty -> student (can manage own account)
  //2 -> teacher (can create course and manage that)
  //3 -> admin (can do anything)
});



/**
 * Virtuals - attributes you can get/set but are not saved to MongoDB.
 *
 * User.password works now, although mongoDB does not have field "password".
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })



/**
 * Methods - public API
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
    }
  }
}

var User = mongoose.model('User', UserSchema)

/**
 * Validations.
 */
UserSchema.path('hashed_password').validate(function (value) {
    return this._password.length >= 8;
}, 'Salasanan tulee olla vähintään 8 merkkiä.');

UserSchema.path('username').validate(function (value, done) {
    User.count({ username: value }, function (err, count) {
        if (err) return done(err);
        done(!count);
    });
}, 'Käyttäjätunnus varattu.');

module.exports = User;

