const express = require('express');
const mailer = require('nodemailer');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const app_email = 'PugetsoundSafeApp@pugetsound.edu';
const sec_email = 'gpinkard@pugetsound.edu';
const passwordFileName = 'password.txt';
// for confirm email
const seed = crypto.randomBytes(20);

let pass = fs.readFileSync(path.join(__dirname, passwordFileName), 'utf-8', (err, data) => {
	if(err) throw err;
});

// pop off the end of file character, will not authenticate if this is not done
pass = pass.substring(0, pass.length-1);

/*
  Initialize the transporter to send emails with
*/
const transporter = mailer.createTransport({
	host: 'webmail.pugetsound.edu',
	port: 587,
	secure: false,
	auth: {
		user: app_email,
		pass: pass
	}
});

/*
  Sends an email to UPS security with the .csv file specified by filepath (filepath is a relative path the the file in question)
*/
module.exports.sendSecurityReport = (filepath) => {
	// get date for email subject
	var date = new Date();
	var now = date.toDateString();

	var mailOptions = {
		from: app_email,
		to: sec_email,
		subject: 'SafeAndSound Check In Report ' + now,
		text: 'Safe And Sound check in report for ' + now + ' attached.\n\n-The UPS-Safe Team',
		attachments: [
			{
				filename: 'checkin.csv',
				path: filepath
			}
		]
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if(err) throw err;
		else console.log(now + ': sending email to security services');
	});
};

module.exports.generateAuthToken = () => {
	let authToken = crypto.createHash('sha1').update(seed + studentEmail).digest('hex');
	console.log('authToken: ');
	console.log(authToken);
};

module.exports.sendStudentConfirmEmail = (studentEmail, authToken) => {
	let confirmURL = 'localhost:3000/confirm_test/' + authToken;
	var mailOptions = {
		from: app_email,
		to: studentEmail,
		subject: 'Verify Safe Check In',
		text: 'Please verify you are safe by clicking on this link:\n' + confirmURL + '\n\n-The UPS-Safe Team'
	}

	transporter.sendMail(mailOptions, (err, info) => {
		if(err) throw err;
	});
}

// sendSecurityReport('../../app_db/reports/test.csv');
module.exports.sendStudentConfirmEmail('gpinkard@pugetsound.edu');
