const express = require('express');
const mailer = require('nodemailer');
const fs = require('fs');

const app_email = 'ups.safeandsound@gmail.com';
const sec_email = 'khoefflinger@gmail.com';
const csvFilePath = './2019-4-25_20:43:5.csv';
const passwordFileName = 'password.txt';

const pass = "Safe@PugetSound2019";

const transporter = mailer.createTransport({
	service: 'gmail',
	auth: {
		user: app_email,
		pass: pass
	}
});

// console.log('transporter:');
// console.log(transporter);

const sendSecurityReport = (fileName) => {
	var date = new Date();
	var now = date.toDateString();

	var mailOptions = {
		from: app_email,
		to: sec_email,
		subject: 'SafeAndSound Report ' + now,
		text: 'Safe And Sound security report for ' + now + ' attached.',
		attachments: [
			{
				filename: 'checkin'+now+'.csv',
				path: fileName
			}
		]
	};

	transporter.sendMail(mailOptions, (err, info) => {
		console.log('info:');
		console.log(info);
		if(err) {
			console.log(err);
			throw err;
		}
		else console.log(now + ': sending email to security services');
	});
};

sendSecurityReport();
