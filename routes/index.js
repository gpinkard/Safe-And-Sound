var express = require('express');
var router = express.Router();

var ctrlStudent = require('../app_client/student/student');
var ctrlSecurity = require('../app_client/security/security');

router.get('/studentlogin', (req, res) => {
	res.render('studentFacing');
});

router.post('/studentlogin', ctrlStudent.initStudentData);

router.get('/securityLogin', (req, res) => {
	res.render('securityLogin');
});

router.post('/securityLogin', ctrlSecurity.ensureLogin);

module.exports = router;
