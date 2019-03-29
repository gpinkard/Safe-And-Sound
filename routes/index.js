var express = require('express');
var router = express.Router();
//const passport = require('passport');

var ctrlStudent = require('../app_client/student/student');
var ctrlSecurity = require('../app_client/security/security');

router.get('/studentlogin', (req, res) => {
	res.render('studentFacing');
});

router.post('/studentlogin', ctrlStudent.initStudentData);

router.get('/securityLogin', (req, res) => {
	res.render('securityLogin');
});

// router.post('/securityLogin', (req, res) => {
// 	//things about login
// 	//send to security only page
// 	const username = 'security';
// 	const password = 'password';
// 	if(req.body.username === username && req.body.password === password){
// 		req.session.user_id = 'securityOn';
// 		res.redirect('/security');
// 	}
// });

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   } passport.authenticate('local', { failureRedirect: '/securityLogin' }),
// ));

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
	usernameField: 'security',
	passwordField: 'password'
},
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

router.post('/securityLogin', passport.authenticate('local', { failureRedirect: '/securityLogin' }), (req, res) => {
	res.redirect('/security');
});

// router.get('/security', (req, res) => {
// 	res.render('securityOnly');
// });

module.exports = router;
