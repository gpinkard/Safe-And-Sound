var express = require('express');
var app = express();

module.exports.sendStudentData = function(req, res) {
	console.log('req');
	console.log(req);
	console.log('res');
	console.log(res);
	next();
};


app.use(sendStudentData);

app.get('/studentlogin', function(req, res, next) {
	console.log('testing...');
});
