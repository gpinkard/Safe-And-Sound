var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');

const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const ctrlStudent = require('../app_client/student/student');
const ctrlSecurity = require('../app_client/security/security');

const fs  = require('fs');
const array = fs.readFileSync('../Safe-And-Sound/authentication/password.json');
const arrayStr = JSON.parse(array);

var user = {
	username: 'security',
	passwordHash: '',
	id: 1
};

bcrypt.hash(arrayStr.password, 10, function(err, hash) {
	if(err){
		return err;
	} else {
		user.passwordHash = hash;
	}
});

router.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 1000*60*60*24 } //one day
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
	(username, password, done) => {
		if(username !== user.username){
			return done(null, false, {message: 'Incorrect username' });
		}
		bcrypt.compare(password, user.passwordHash, (err, isValid) => {
			if (err) {
				return done(err);
			}
			if (!isValid) {
				return done(null, false, {message: 'Incorrect password'});
			} else {
				return done(null, user);
			}
		});
	}
));

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(username, cb) {
	if(username === user.username){
		cb(null, user);
	}
});

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/studentFacing.html'));
});

router.post('/', ctrlStudent.initStudentData);

router.get('/securityLogin', (req, res) => {
	console.log('get securityLogin');
	res.sendFile(path.join(__dirname + '/../views/securityLogin.html'));
});

/*
router.post('/securityLogin', passport.authenticate('local', {failureRedirect: '/securityLogin'}), (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/securityOnly.html'));
	//res.redirect('/security');
});
*/

router.post('/securityLogin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/securityLogin', failureFlash: "invalid username or password"}));

router.get('/security', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/securityOnly.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

router.post('/security', ctrlSecurity.securityOnlyButtons);

router.get('/securityTest', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/securityOnly.html'));
});

router.post('/securityTest', (req, res) => {
	console.log('made it to index /security');
	ctrlSecurity.securityButtonController(req, res);
	console.log('securityButtonController() returned...');
});

router.get('/clearDatabase', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/clearDatabase.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

router.post('/clearDatabase', ctrlSecurity.clearDatabase);

router.get('/deleteConfirm', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/deleteConfirm.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

module.exports = router;
