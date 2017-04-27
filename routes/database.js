var fs = require('fs'); //File sync.
var sql = fs.readFileSync('../models/db_schema.sql').toString();

var pgp = require('pg-promise')();
var pgpString = 'postgres://vampiresnakes:blehssss@localhost:5432/advanceclones';

const connectionString = process.env.DATABASE_URL || pgpString;
var db = pgp(connectionString);

/*exports.connectDB = function(input) {
	db.connect(
)};*/

db.connect();
db.query(sql);

module.exports = db; //Export reference to database.

//const client = new pgp.Client(connectionString);
//const query = db.query(sql);
//query.on('end', () => { client.end(); });