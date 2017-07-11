/**
 * Created by Bien on 2017-06-16.
 */
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const requireFacebookSignin = passport.authenticate('facebook', {scope: ['email']});

module.exports = function(app) {
    // test page
    app.get('/admin', function(req, res) {
      res.send('<h3>Api Server Dashboard:</h3>');
    });
    // this wires up the passport middleware to check if request have token before proceeding
    app.get('/', requireAuth, function(req, res) {
       res.send({ message: 'Super secret code is ABC123'});
    });
    //send user to authentication controller when they visit this route

    app.post('/signin', requireSignin, Authentication.signin);

    app.post('/signup', Authentication.signup);

    app.get('/auth/facebook', requireFacebookSignin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect: '/notifications',
            failureRedirect: '/'
        }));
};

