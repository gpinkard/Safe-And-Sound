const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');

const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const ctrlStudent = require('../app_client/student/student');
const ctrlSecurity = require('../app_client/security/security');

const fs  = require('fs');
//const array = fs.readFileSync('../Safe-And-Sound/authentication/password.json');
//const arrayStr = JSON.parse(array);
let userDataJSON = fs.readFileSync('../Safe-And-Sound/authentication/users.json');
let userData = JSON.parse(userDataJSON);

console.log('userdata:');
console.log(userData);


let user = null; // this represents the logged in user

router.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 1000*60*60*24 } //one day
}));

router.use(passport.initialize());
router.use(passport.session());

// TODO move security credentials from server to db...
passport.use(new LocalStrategy(
	(username, password, done) => {
		let userNameStr, passwordStr = '';
		for(let i = 0; i < userData.length; i++) {
			console.log('i: ' + i);
			if(userData[i].username === username) {
				userNameStr = username;
				passwordStr = userData[i].passwordHash;
				console.log('passwordStr: ' + passwordStr);
				user = userData[i];
				break;
			}
		}
		if(userNameStr === '') {
			return done(null, false, {message: 'user ' + username + ' not found'});
		}
		bcrypt.compare(password, passwordStr, (err, isValid) => {
			if(err) throw err;
			if(!isValid) {
				console.log('incorrect password...');
				return done(null, false, {message: 'Incorrect password'});
			} else {
				console.log('user ' + user.username + ' is now authenticated');
				return done(null, user);
			}
		});
	}
));

passport.serializeUser(function(user, cb) {
	cb(null, user.username);
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

router.get('/verify', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/studentVerify.html'));
});

router.get('/securityLogin', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/securityLogin.html'));
});


router.post('/securityLogin', passport.authenticate('local', {failureRedirect: '/securityLogin'}), (req, res) => {
	res.redirect('/security');
});

router.get('/security', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/securityOnly.html'));
	} else {
		return res.redirect('/securityLogin');
	}
});

router.post('/security', ctrlSecurity.securityButtonController);

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

router.get('/changePassword', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/changePassword.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

router.post('/changePassword', ctrlSecurity.changePassword);

module.exports = router;
