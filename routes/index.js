var express = require('express');
var router = express.Router();

var ctrlStudent = ('../app_client/student/controllers/student');

router.get('/studentlogin', ctrlStudent.sendStudentData);

module.exports = router;

/* GET home page.
router.get('/studentlogin', function(req, res, next) {
	res.render('studentFacing', { title: 'Student login' });
});
*/
