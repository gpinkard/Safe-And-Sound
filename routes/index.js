var express = require('express');
var router = express.Router();

var ctrlStudent = require('../app_client/student/student');
var ctrlSecurity = require('../app_client/security/security');

router.get('/studentlogin', (req, res) => {
	res.render('studentFacing');
});

router.get('/', (req, res) => {
	res.render('studentFacing');
});

router.post('/studentlogin', ctrlStudent.initStudentData);

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

router.get('/securityLogin', (req, res) => {
	res.render('securityLogin');
});

router.post('/securityLogin', (req, res) => {
	//things about login
	//send to security only page
	const username = 'security';
	const password = 'password';
	if(req.body.username === username && req.body.password === password){
		req.session.user_id = 'securityOn';
		res.redirect('/security');
	}
});

router.get('/security', (req, res) => {
	res.render('securityOnly');
});

router.post('/security', ctrlSecurity.buttons);

module.exports = router;
