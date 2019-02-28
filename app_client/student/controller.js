var express = require('express');
var app = express();

var sendStudentData = function(req, res, next) {
	console.log('req');
	console.log(req);
	console.log('res');
	console.log(res);
	next();
};


app.use(sendStudentData);

app.get('/studentlogin', function(req, res, next) {
	console.log('testing');
});
