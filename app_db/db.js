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
		throw err;
	} else {
		console.log('now connected to database ' + arrayStr.database);
	}
});

exports.selectQuery = (table) => {
	connection.query('SELECT * FROM ' + table);
};

// insert student data into the database (this is when they register)
exports.insertStudentData = (firstname, lastname, email, phone, time) => {
	conn.query("INSERT IGNORE INTO Student VALUES ('"+email+"', '"+firstname+"', '"+lastname+"', '"+phone+"')");
	//conn.query("INSERT INTO CheckIn VALUES ('"+phone+"', '"+time+"', 0, 0)");
};

// gets students name, email, status, gpsloc, timestamp
exports.getStudentData = (err) => {
	// put conn.query() here
	if(err) {
		throw(err);
	}
};

exports.exportToCSV = (path) => {
	conn.query('SELECT lName, fName, phoneNum, email, lat, lng, MAX(timeOf) from Student NATURAL JOIN CheckIn GROUP BY phoneNum order by lName', (err, students, fields) => {
		if(err) throw err;

		const jsonStudents = JSON.parse(JSON.stringify(students));

		console.log('jsonStudents: ');
		console.log(jsonStudents);

		const csvFields = ['lName', 'fName', 'phoneNum', 'email', 'lat', 'lng', 'time'];
		const json2CSVParser = new parser({csvFields});
		const csvData = json2CSVParser.parse(jsonStudents);

		console.log('csv:');
		console.log(csvData);

		let date = new Date();
		fs.writeFile(path + 'report' + date + '.csv');
	});
};
