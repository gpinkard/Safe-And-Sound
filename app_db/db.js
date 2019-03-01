var mysql = require('mysql');

var fs  = require("fs");
var array = fs.readFileSync('apples.txt').toString().split('\n');


var conn = mysql.createConnection({
	// subject to change :)
	host: array[0],
	user: array[1],
	password: array[2],
	database: array[3],
});

conn.connect(function(err) {
	if(err) {
		throw err;
	} else {
		console.log("now connected to database " + conn.database);

	}
});

//Get all students that have checked in, ordered by last name. Outputs to a .csv file.
// SELECT * from Student natural join CheckIn order by lName INTO OUTFILE '/tmp/checkIn.csv'
// FIELDS TERMINATED BY ','
// ENCLOSED BY '"'
// LINES TERMINATED BY '\n';


//BEGIN TRANSACTION;
// Insert a new student into Student. Should only run if the phone number given is not in.
function studentTest(connection, table) {
  conn.query(INSERT IGNORE into Student values (email, fName, lName, phoneNum);
}


// Insert a new CheckIn value. This should run each time someone fills out the web form.
// INSERT into CheckIn(phoneNum, timeOf, lat, lng).
// COMMIT TRANSACTION;​




// function exampleQuery(connection, table) {
// 	connection.query("SELECT * FROM " + table);
// }
