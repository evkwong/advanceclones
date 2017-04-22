//var pgPromise = require('pg-promise')();
const pg = require('pg');
var fs = require('fs'); //File sync.
var sql = fs.readFileSync('db_setup.sql').toString();
//var testString = 'postgres://evan:evanWong@localhost:5432/advanceclones';
var testString = 'postgres://gojirra:skratch5@localhost:5432/advanceclones';

const connectionString = process.env.DATABASE_URL || testString;
//var db = pgPromise(connectionString);
//exports.db = db;

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(sql);
query.on('end', () => { client.end(); });