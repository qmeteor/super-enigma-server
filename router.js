/**
 * Created by Bien on 2017-06-16.
 */
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
    // this wires up the passport middleware to check if request have token before proceeding
    app.get('/', requireAuth, function(req, res) {
       res.send({ message: 'Super secret code is ABC123'});
    });
    //send user to authentication controller when they visit this route
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/notifications',
            failureRedirect: '/' }));
};

