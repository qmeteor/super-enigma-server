/**
 * Created by Bien on 2017-06-16.
 */
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;

// Facebook strategy
const facebookLogin = new FacebookStrategy({
        clientID: config.facebookAuth.clientID,
        clientSecret: config.facebookAuth.clientSecret,
        callbackURL: config.facebookAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({'facebook.id': profile.id}, function(err, user){
                if(err)
                    return done(err);
                if(user)
                    return done(null, user);
                else {
                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;
                    newUser.facebook.age_range = profile.age_range;
                    newUser.facebook.gender = profile.gender;
                    newUser.facebook.locale = profile.locale;
                    newUser.facebook.timezone = profile.timezone;
                    newUser.facebook.verified = profile.verified;
                    newUser.facebook.user_friends = profile.user_friends;
                    // age_range: String,
                    //     gender: String,
                    //     locale: String,
                    //     timezone: String,
                    //     verified: String,
                    //     user_friends: Object

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    })
                }
            });
        });
    }
);


// Create local strategy (for verifying email, password)
const localOptions = { usernameField: 'email' }; // by default localstrategy uses username so you need to tell it you want to use email.
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    // Verify this email and password, call done with the user
    // If it is the correct email and password
    // otherwise call done with false
    console.log('start localStrategy');
    User.findOne({'local.email': email }, function(err, user) {
        if(err) {
            console.log('err');
            return done(err);
        }

        if(!user) {
            console.log('no err but no user found');
            return done(null, false);
        }
        // compare passwords - is 'password' equal to user.password?
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log('comparePassword error');
                return done(err);
            }
            if (!isMatch) {
                console.log('no match of user');
                return done(null, false);
            }
            console.log('success match found');
            return done(null, user);
        });
    });
});

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT strategy (for verifying token)
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a user object'
    User.findById(payload.sub, function(err, user) {
        if(err) { return done(err, false); }

        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});


// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
passport.use(facebookLogin);