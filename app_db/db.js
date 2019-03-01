var mysql = require('mysql');

var fs  = require('fs');
var array = fs.readFileSync('../Safe-And-Sound/app_db/apples.json');
var arrayStr = JSON.parse(array);
// for(i in array){
//   console.log(array[i]);
// }

var conn = mysql.createConnection({
	// subject to change :)
	host: arrayStr.host,
	user: arrayStr.user,
	password: arrayStr.password
});

conn.connect(function(err) {
	if(err) {
    console.log(err);
		throw err;
	} else {
		console.log("now connected to database " + conn.database);
	}
});

function exampleQuery(conn, table) {
	connection.query("SELECT * FROM " + table);
}

function studentQuery(conn, table, firstname, lastname, email, phone) {
  console.log('in studentQuery');
  //unclear what we need to put here??
}
