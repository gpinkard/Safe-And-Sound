const mysql = require('mysql');
const fs  = require('fs');
const path = require('path');
const parser = require('json2csv').Parser;

const array = fs.readFileSync('../Safe-And-Sound/app_db/db.json');
const arrayStr = JSON.parse(array);


const conn = mysql.createConnection({
	// subject to change :)
	host: arrayStr.host,
	user: arrayStr.user,
	password: arrayStr.password,
	database: arrayStr.database
});

conn.connect( (err) => {
	if(err) {
		console.log(err);
		throw err;
	} else {
		console.log('now connected to database ' + arrayStr.database);
	}
});

/*
	A function to select a table.
*/
exports.selectQuery = (table) => {
	conn.query("SELECT * FROM " + table);
};

/*
	A function to insert into the student table.
*/
exports.studentQuery = (firstname, lastname, email, phone) => {
	conn.query("INSERT IGNORE INTO Student VALUES ('"+firstname+"', '"+lastname+"', '"+phone+"', '"+email+"')");
};

/*
	A fuction to insert into the checkIn table.
*/
exports.checkInQuery = (lat, lng, phone) => {
	var time = makeNumericDateString();
	conn.query("REPLACE INTO CheckIn VALUES ('"+time+"', '"+lat+"', '"+lng+"', '"+phone+"')");
};

/*
	A function to clear all values from the given table
*/
exports.deleteTable = (table) => {
	conn.query("DELETE FROM " + table);
};

/*
	A function to output a .csv file
*/
exports.exportTable = (exportPath) => {
	//conn.query('SELECT * FROM Student NATURAL JOIN CheckIn GROUP BY phoneNum order by lName', (err, result, fields) => {
	conn.query('SELECT lName, fName, phoneNum, email FROM Student', (err,  result, fields) => {

		if(err) throw err;
		const jsonStudents = JSON.parse(JSON.stringify(result));
		//const csvFields = ['lName', 'fName', 'phoneNum', 'email', 'lat', 'lng', 'time'];

		const csvFields = ['lName, fName, phoneNum, email'];
		const json2CSVParser = new parser({csvFields});
		let data = '';
		if(jsonStudents.length !== 0) {
			data = json2CSVParser.parse(jsonStudents);
		}
		let now = makeNumericDateString();
		console.log('now: ' + now);
		fs.writeFile(path.join(exportPath, '/' + now + '.csv'), data, (err) => {
			if(err) console.log(err);
		});
	});
};

const makeNumericDateString = () => {
	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth()+1;
	let year = date.getFullYear();
	let hour = date.getHours();
	let minute = date.getMinutes();
	let seconds = date.getSeconds();
	return '' + year + '-' + month + '-' + day + '_' + hour + ':' + minute + ':' + seconds;
};

//console.log('exporting table...');
//exports.exportTable();
