/**
 * Created by Bien on 2017-06-16.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// Define our model
const userSchema = new Schema({
    local: {
        name: String,  //username is constructed of first and last name but can be mutated to be anything after signup.
        firstName: {type: String, require: true},
        lastName: {type: String, require: true},
        email: {type: String, require: true, unique: true, lowercase: true},
        password: {type: String, require: true},
        vanityURL: {type: String, require: true, unique: true, lowercase: true},
        profileImageURL: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        age_range: String,
        gender: String,
        locale: String,
        timezone: String,
        verified: String,
        user_friends: Object
    }
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
    // get access to the user model
    const user = this;

    // gen salt then run callback this takes some TIME.
    bcrypt.genSalt(10, function(err, salt) {
        if(err) { return next(err); }

        // encrypt our password using the salt
        bcrypt.hash(user.local.password, salt, null, function(err, hash) {
            if(err) { return next(err); }

            // overwrite plain text password with encrypted password
            user.local.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.local.password, function(err, isMatch) {
        if(err) { return callback(err); }

        callback(null, isMatch);
    });
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema); // Collection named 'user'

// Export the model
module.exports = ModelClass;