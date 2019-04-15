var express = require('express');
var router = express.Router();
var app = express();

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
				return done(err)
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
	res.render('studentFacing');
});

router.post('/', ctrlStudent.initStudentData);

router.get('/securityLogin', (req, res) => {
	res.render('securityLogin');
});

router.post('/securityLogin', passport.authenticate('local', {failureRedirect: '/securityLogin'}), (req, res) => {
	res.render('securityOnly');
});

router.get('/security', passport.authenticate('local'), (req, res) => {
	if(req.isAuthenticated()) {
		res.render('securityOnly');
	} else {
		res.render('/securityLogin');
	}
});

router.post('/security', ctrlSecurity.securityOnlyButtons);

router.get('/clearDatabase', passport.authenticate('local'), (req, res) => {
	if(req.isAuthenticated()) {
		res.render('/clearDatabase');
	} else {
		res.render('/securityLogin');
	}
});

router.post('/clearDatabase', ctrlSecurity.clearDatabase);

router.get('/deleteConfirm', passport.authenticate('local'), (req, res) => {
	if(req.isAuthenticated()) {
		res.render('/deleteConfirm');
	} else {
		res.render('/securityLogin');
	}
});

module.exports = router;
