const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true

}, function(req, email, password, done) {
    // find a user and establish the identity
    User.findOne({ email: email }, function(err, user) {
        if (err) {
            req.flash('error', 'Error in finding the user --> Passport');
            return done(err);
        }

        if (!user || user.password != password) {
            req.flash('error', 'Invalid Email/Password')
            console.log('Invalid Username?Password');
            return done(null, false);
        }
        return done(null, user);
    })
}));

// serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

// deserializing the user from the key in the cookies

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if (err) {
            console.log("Error in finding the user --> Passport");
            return done(err);
        }
        return done(null, user);
    })
})

// check the current user is authenticated 

passport.checkAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    }
    // id the user is not signed in

    return res.redirect('/users/sign-in');

}

passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        // req.user contains the current signing user from the session cookie 

        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;