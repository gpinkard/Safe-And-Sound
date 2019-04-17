const mysql = require('mysql');
const fs  = require('fs');
const array = fs.readFileSync('../Safe-And-Sound/app_db/db.json');
const arrayStr = JSON.parse(array);
const parser = require('json2csv').Parser;


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
	conn.query("INSERT IGNORE INTO Student VALUES ('"+email+"', '"+firstname+"', '"+lastname+"', '"+phone+"')");
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
exports.exportTable = (path) => {
	//conn.query('SELECT * FROM Student NATURAL JOIN CheckIn GROUP BY phoneNum order by lName', (err, result, fields) => {
	conn.query('SELECT lName, fName, phoneNum, email FROM Student', (err,  result, fields) => {

		if(err) throw err;
		console.log('results:');
		console.log(result);

		const jsonStudents = JSON.parse(JSON.stringify(result));

		console.log('jsonStudents: ');
		console.log(jsonStudents);

		//const csvFields = ['lName', 'fName', 'phoneNum', 'email', 'lat', 'lng', 'time'];
		const csvFields = ['lName, fName, phoneNum, email'];
		const json2CSVParser = new parser({csvFields});
		let data = '';
		if(jsonStudents.length !== 0) {
			data = json2CSVParser.parse(jsonStudents);
			console.log('csv:');
			console.log(data);
		}
		let now = makeNumericDateString();
		console.log('now: ' + now);
		fs.writeFile(path + '/' + now + '.csv', data, (err) => {
			if(err) throw err;
			console.log('csv file exported...');
		});
	});
};

const makeNumericDateString = () => {
	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth()+1;
	let year = date.getFullYear();
	let hour = date.getHour();
	let minute = date.getMinute();
	return '' + month + '-' + day + '-' + year + '_' + hour + '.' + minute;
};
