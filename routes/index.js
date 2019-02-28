var express = require('express');
var router = express.Router();

var ctrlStudent = ('../app_client/student/controllers/student');

router.get('/studentlogin', function(req, res, next) {
	ctlrStudent.sendStudentData(req, res);
	res.render('studentFacing', { title: 'Student login' });
});

module.exports = router;
