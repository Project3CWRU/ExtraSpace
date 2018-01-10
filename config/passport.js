var GoogleStrategy = require('passport-google-oauth2').Strategy;

var db = require('../models');

var config = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session

	passport.use(new GoogleStrategy({
	    //Information stored on config/auth.js
	    clientID: config.google.clientID,
	    clientSecret: config.google.clientSecret,
	    callbackURL: config.google.callbackURL
		}, 

	function (token, refreshToken, profile, done) {
	    //Using next tick to take advantage of async properties
	    //try to find the user based on their google id
	    process.nextTick(function () {
	        db.User.findOne( { where : { googleId : profile.id } }).then(function (user, err) {
	            if(err) {
	                return done(err);
	            } 
	            // if user is found,log them in
	            if(user) {
	                return done(null, user);
	            } else {
	              // if the user isn't in our database, create the user
	              db.User.create({
	                  googleId : profile.id,
	                  token : token,
	                  firstName : profile.name.givenName,
	                  lastName: profile.name.familyName,
	                  email : profile.emails[0].value,
	                  pic : profile.photos[0].value
	              }).then(function() {
	              	db.User.findOne({where: {googleId: profile.id}}).then(function(user,err) {
	              		if(user) {
	              			return done(null, user);
	              		} else {
	              			return done(err);
	              		}
	              	})
	              })
	            }
	        });
	    });
	})); 

	passport.serializeUser(function(user, done) {
  	done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  db.User.findOne({where: {id: id}}).then(function(user){
	    done(null, user);
	  }).error(function(err){
	    done(err, null);
	  });
	});

};