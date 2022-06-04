const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: "949198744438-b7qteqbm1mv1klk1oiekntfdo3sat2ov.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).exec(function(err, user) {
            if (err) {
                console.log('Error in Google Strategy Passport', err);
                return;
            }
            console.log(profile);

            if (user) {
                // if found set this user as req.user
                return done(null, user);
            } else {
                // if not found create the user as req.user

                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user) {
                    if (err) {
                        console.log('Error in creating the user google-strategy-passport', err);
                        return;
                    }
                    return done(null, user);
                })
            }
        })
    }));

module.exports = passport;