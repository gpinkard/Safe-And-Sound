var express = require('express');
var router = express.Router();

var ctrlStudent = require('../app_client/student/student');

router.get('/studentlogin', (req, res) => {
	res.render('studentFacing');
});

router.post('/studentlogin', ctrlStudent.initStudentData);

module.exports = router;
