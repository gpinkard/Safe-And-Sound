const express = require('express');
const app = express();
const mysql = require('mysql');
const fs  = require('fs');
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
 * This function initializes student data in the database
 */
module.exports.initStudentData = (req, res) => {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var phone = req.body.phone.replace(/\D/g, '');
	var lat = req.body.lat;
	var lng = req.body.lng;
	var confirmString = mail.generateAuthToken();
	/**
	Check the value of the email.
	*/
	if(!email.includes("@pugetsound.edu")){
		email+= "@pugetsound.edu";
	}

	database.studentQuery(firstname, lastname, email, phone); // insert authentication token here
	database.checkInQuery(lat, lng, phone, 0, confirmString);
	mail.sendStudentConfirmEmail(email, confirmString);
	// call email function
	res.redirect('/confirm');
};

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
