var express = require('express');
var router = express.Router();
var app = express();
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

var user = {
	username: 'security',
	password: 'password'
};

var ctrlStudent = require('../app_client/student/student');
var ctrlSecurity = require('../app_client/security/security');

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
	function(username, password, done) {
		if(username != user.username){
			return done(null, false, {message: 'Incorrect username.' });
		}
		if(password != user.password){
			return done(null, false, {message: 'Incorrect password.' });
		}
		return done(null, user);
	}
));

passport.serializeUser(function(user, cb) {
	cb(null, user.username);
});

passport.deserializeUser(function(username, cb) {
	if(username == user.username){
		cb(null, user);
	}
});

router.get('/', (req, res) => {
	res.render('studentFacing');
});

router.post('/', ctrlStudent.initStudentData);

router.get('/securityLogin', (req, res) => {
	res.render('securityLogin');
});

router.post('/securityLogin', passport.authenticate('local', { successRedirect: '/security',
	failureRedirect: '/securityLogin'})
);

router.get('/security', (req, res) => {
	res.render('securityOnly');
});

router.post('/security', ctrlSecurity.securityOnlyButtons);

router.get('/clearDatabase', (req, res) => {
	res.render('clearDatabase');
});

router.post('/clearDatabase', ctrlSecurity.clearDatabase);

router.get('/deleteConfirm', (req, res) => {
	res.render('deleteConfirm');
});

module.exports = router;
