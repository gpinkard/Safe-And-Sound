var express = require('express');
var router = express.Router();

var ctrlStudent = require('../app_client/student/controllers/student');

router.get('/studentlogin', function(req, res) {
	res.render('studentFacing');
});

console.log('before the post stuff');
router.post('/studentlogin', ctrlStudent.sendStudentData(req, res));


/*
router.get('/', function(req, res, next) {
	console.log('this is the home page');
	//res.render('studentFacing', {title: 'test'});
});

router.get('/studentlogin', function(req, res) {
	//console.log('FUCK THE ENTIRE UNIVERSE');
	ctrlStudent.sendStudentData(req, res);
	res.render('studentFacing', { title: 'Student login' });
});
*/

module.exports = router;
