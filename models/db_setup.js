var fs = require('fs'); //File sync.
var sql = fs.readFileSync('db_schema.sql').toString();
var db = require('../routes/database');

//Create tables in db.
db.query(sql);

db.query('COPY unittypes FROM \'./unitTypes.csv\' DELIMITER \',\' CSV');
db.query('COPY buildingtypes FROM \'./buildingTypes.csv\' DELIMITER \',\' CSV');
db.query('COPY terraintypes FROM \'./terrainTypes.csv\' DELIMITER \',\' CSV');