/**
 * Created by Bien on 2017-06-16.
 */
const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');
const shortid = require('shortid');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    if(!firstName || !lastName || !email || !password) {
        return res.status(422).send({ error: 'You must provide first name, last name, email and password!' })
    }
    // See if a user with a given email exists
    User.findOne({ "local.email": email }, function(err, existingUser) {
        if(err) {
            return next(err); } //database fail

        // If a user with email does exist, return an error
        if(existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        // If a user with email does NOT exist, create and save user record generate unique vanity URL id.
        const user = new User(
            {
                local: {
                    name: firstName + ' ' + lastName,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    vanityURL: shortid.generate(),
                    profileImageURL: null
                }
            });

        user.save(function(err) {
            if(err) { return next(err); }

            // Respond to request indicating the user was created
            res.json( { token: tokenForUser(user) });
        });
    });
};