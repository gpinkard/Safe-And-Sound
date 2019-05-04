const express = require('express');
const mailer = require('nodemailer');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const app_email = 'ups.safeandsound@gmail.com';
const sec_email = 'khoefflinger@pugetsound.edu';
const passwordFileName = 'password.txt';
// for confirm email
const seed = crypto.randomBytes(20);

/**
	Handles all notifcation related functions, including changing password,
	exporting the table, and sending student confirmation emails
*/

let pass = fs.readFileSync(path.join(__dirname, passwordFileName), 'utf-8', (err, data) => {
	if(err) throw err;
});

// pop off the end of file character, will not authenticate if this is not done
pass = pass.substring(0, pass.length-1);

/*
  Initialize the transporter to send emails with
*/
const transporter = mailer.createTransport({
	// host: 'webmail.pugetsound.edu',
	// port: 587,
	// secure: false,
	service: 'gmail',
	auth: {
		user: app_email,
		pass: 'Safe@PugetSound2019' //pass
	}
});

/*
  Sends an email to UPS security with the .csv file specified by filepath (filepath
	is a relative path to the file in question)
*/
module.exports.sendSecurityReport = (filepath) => {
	// get date for email subject
	var date = new Date();
	var now = date.toDateString();

	//Related check in email information
	var mailOptions = {
		from: app_email,
		to: sec_email,
		subject: 'SafeAndSound Check In Report ' + now,
		text: 'Hello, \n\n  Safe And Sound check in report for ' + now + ' attached.\n\n-The UPS-Safe Team',
		attachments: [
			{
				filename: 'checkin.csv',
				path: filepath
			}
		]
	};

	//Sends the message
	transporter.sendMail(mailOptions, (err, info) => {
		if(err) throw err;
		else console.log(now + ': sending email to security services');
	});
};

/*
	Creates unique identifier for student confirmation
*/
module.exports.generateAuthToken = (studentEmail) => {
	let authToken = crypto.createHash('sha1').update(seed + studentEmail).digest('hex');
	return authToken;
};

/*
	Sends student email with unique confirmation URL
*/
module.exports.sendStudentConfirmEmail = (studentEmail, firstName, authToken) => {
	let confirmURL = '52.42.69.191/verify/' + authToken;

	//Details for student confirmation email
	var mailOptions = {
		from: app_email,
		to: studentEmail,
		subject: 'Verify Safe Check In',
		text: 'Dear ' + firstName + ', \n\nPlease verify you are safe by copy and pasting this link - ' + confirmURL + ' - to your browser. \n\nRemember, this is not a replacement for emergency services.  If you are in any way unsafe, please contact the following numbers:\nGeneral - 911\nCampus Security - (253) 879-3311\n\nStay Safe and Sound'
		//html: "<p>Dear Student,</p><p>Please verify you are safe by clicking <a href={{confirmURL}}>here</a> ({{confirmURL}})</p><p>Remember, this is not a replacement for emergency services.  Please contact 911 (general emergency services) or (253) 879-3311 (Campus Security Services).</p><br><p>Stay Safe and Sound</p>"
	}

	transporter.sendMail(mailOptions, (err, info) => {
		if(err) throw err;
	});
}

/*
	Sends email with PIN for password change
*/
module.exports.sendChangePassword = (pin) => {
	var mailOptions = {
		from: app_email,
		to: sec_email,
		subject: 'SafeAndSound Reset Password',
		text: 'Hello, \n\nYour PIN is ' + pin + '.  Please use this to reset your password on the directed page.\n\n-The UPS-Safe Team',
	};
	transporter.sendMail(mailOptions, (err, info) => {
		if(err) throw err;
		else console.log(now + ': sending email to security services with PIN');
	});
}
