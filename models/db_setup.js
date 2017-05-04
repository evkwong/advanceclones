var fs = require('fs'); //File sync.
var sql = fs.readFileSync('db_schema.sql').toString();
var db = require('../routes/database');

//Create tables in db.
db.query(sql);