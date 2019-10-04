var passport = require('passport-local')
const mongoose = require('mongoose')
const User = mongoose.model('users')
const LocalStrategy = require('passport-local').Strategy;


module.exports = (passport)=>{
    passport.use(new LocalStrategy(
        function(username, password, done) {

          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            user.verifyPassword(password)
            .then(success=>{
                return done(null, user);
            }).catch(err=>{return done(null, false); })
          });
        }
      ));

      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}