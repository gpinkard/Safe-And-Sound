const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');

const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const ctrlStudent = require('../app_client/student/student');
const ctrlSecurity = require('../app_client/security/security');
const ctrlDb = require('../app_db/db');

const fs  = require('fs');
let userDataJSON = fs.readFileSync('../Safe-And-Sound/authentication/users.json');
let userData = JSON.parse(userDataJSON);

let user = null; // this represents the logged in user

/*
######### TODO #########
have email saved somehow on initStudentData, then add to userConfirmLookup which will map
the confirm/auth_token url to a email address. If the email address matches the auth
token, we confirm them as save in the db.
*/
let userConfirmLookup = {}; // object that maps confirm tokens to emails

//Keeos login true for 1 day
router.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 1000*60*60*24 } //one day
}));

/*
	Initializes Passport to function with the app
*/
router.use(passport.initialize());
router.use(passport.session());

//Tells Passport to use the LocalStrategy
passport.use(new LocalStrategy(ctrlDb.loginHelper));

passport.serializeUser(function(user, cb) {
	cb(null, user.username);
});

passport.deserializeUser(ctrlDb.deserialize);


/*
	Handling web requests
*/

//Home page, with student checkin
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/studentFacing.html'));
});

//Sends student data where it needs to go
router.post('/', ctrlStudent.initStudentData);

//Confirm check in page
router.get('/confirm', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/studentVerify.html'));
});

//Security Login page
router.get('/securityLogin', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/securityLogin.html'));
});

//Sends login information to Passport to authenticate
router.post('/securityLogin', passport.authenticate('local', {failureRedirect: '/securityLogin'}), (req, res) => {
	res.redirect('/security');
});

//Security landing page, which will send unauthenticated users to the login page
router.get('/security', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/securityOnly.html'));
	} else {
		return res.redirect('/securityLogin');
	}
});

//Handles security actions
router.post('/security', ctrlSecurity.securityButtonController);


//Clear Database confirmation page, which will send unauthenticated users to the
//login page
router.get('/clearDatabase', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/clearDatabase.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

//Sends clear database information to database
router.post('/clearDatabase', ctrlSecurity.clearDatabase);

router.get('/clearCheckin', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/clearCheckin.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

router.post('/clearCheckin', ctrlSecurity.clearCheckin);

//Delete Confirm page, telling user that the database is clear, and will send
//unauthenticated users to the login page
router.get('/deleteConfirm', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/deleteConfirm.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

//Change Password page, allowing authenticated user to change password, and
//sending unauthenticated users to login page
router.get('/changePassword', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/changePassword.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

//Sends change password information to server
router.post('/changePassword', ctrlSecurity.changePassword);

//Verify Safe page, allowing students to verify their checkin using a unique url
router.get('/confirm_test/*', (req, res) => {
	console.log('url');
	console.log(req.url);
	res.sendFile(path.join(__dirname + '/../views/studentConfirmed.html'));
});

module.exports = router;
