const express = require('express');
const app = express();
//const mysql = require('mysql');
//const fs  = require("fs");

module.exports.ensureLogin = (req, res) => {
	//things about login
	//send to security only page
	const username = 'security';
	const password = 'password';
	if(req.username == username && req.password == password){
		res.render('securityOnly');
	}
};
