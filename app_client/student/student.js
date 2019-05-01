const express = require('express');
const app = express();
const mysql = require('mysql');
const fs  = require('fs');
const async = require('async');
const mail = require('../notify/mail.js');

/*
const twilio = require('twilio');
const twilioAccountSid = '123'; // secure these on server end later
const twilioAuthToken = 'abc';
const twilioNumber = '+1234567890';
const client = new twilio(twilioAccountSid, twilioAuthToken);
*/

const database = require('../../app_db/db.js');

/*
 * This function initializes student data in the database, and sends
 * the student a confirmation email**
*/
module.exports.initStudentData = (req, res) => {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var phone = req.body.phone.replace(/\D/g, ''); //inserts only the number
	console.log('Phone: ' + phone);
	var lat = req.body.lat;
	var lng = req.body.lng;
	//var confirmString = mail.generateAuthToken();

	/**
	Check the value of the email, appending @pugetsound.edu as needed.
	*/
	if(!email.includes("@pugetsound.edu")){
		email+= "@pugetsound.edu";
	}

	/*
		Sends an email with the unique confirmation URL to the student
	*/
	var confirmString = String(mail.generateAuthToken(email));
	console.log('confirmString: ' + confirmString);
	//Adds student to the Student table
	database.studentQuery(firstname, lastname, email, phone); // insert authentication token here
	//Adds this checkin to the Checkin table
	database.checkInQuery(lat, lng, phone, 0, confirmString);
	//Sends the confirmation email with the unique confirmation URL
	mail.sendStudentConfirmEmail(email, firstname, confirmString);
	// call email function
	res.redirect('/confirm');
};

module.exports.confirmStudent = (req, res) => {
	console.log('url');
	console.log(req.url);
	database.confirmStudent(req, res);
	//do shit with url to change verified status
	//probably should put gen auth token in dbjs
	//console.log(path.join(__dirname, '/../../views/studentConfirmed.html'));
	//res.sendFile(path.join(__dirname, '/../../views/studentConfirmed.html'));
}

// module.exports.initStudentData = async (req, res) => {
// 	async.waterfall([
// 			getConfirmString(req.email),
// 			getStudentData(req, res),
// 			insertValuesIntoDB,
// 			sendConfirmEmailStudent
// 	]);
// 	res.redirect('/confirm');
// };
//
// function sendConfirmEmailStudent(values) {
// 	mail.sendStudentConfirmEmail(values.email, values.firstname, values.confirmString);
// }
//
// function insertValuesIntoDB(values) {
// 	database.studentQuery(values.firstname, values.lastname, values.email, values.phone);
// 	database.checkInQuery(values.lat, values.lng, values.phone, 0, values.confirmString);
// 	return {email: values.email, firstname: values.firstname, confirmString: values.confirmString};
// }
//
// function getConfirmString(email) {
// 	return mail.generateAuthToken(email);
// }
//
// function getStudentData(req, res, authString) {
// 	return {
// 		firstname: req.body.firstname,
// 		lastname: req.body.lastname,
// 		phone: req.body.phone.replace(/\D/g, ''),
// 		email: req.body.email,
// 		lat: req.body.lat,
// 		lng: req.body.lng,
// 		confirmString: authString
// 	}
// }

// module.exports.studentCheckIn = (req, res) => {
// 	var firstname = req.body.firstname;
// 	var lastname = req.body.lastname;
// 	var email = req.body.email;
// 	var phone = req.body.phone;
// 	var studentID = req.body.studentID;
// 	var safe = req.body.studentsafe;
// 	var lat = req.body.lat;
// 	var lng = req.body.lng;
// };

/*
const sendSMSConfirmation = (phoneNumber) => {
	client.messages.create({
		body: 'Please confirm you are safe at https://Safe-And-Sound/studentCheckInConfirm (required).',
		to: phoneNumber,
		from: twilioNumber
	});
};
*/
