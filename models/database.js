const pg = require('pg');

var sql = fs.readFileSync('db_setup.sql').toString();

pg.connect('postgres://localhost:3000/advwanceClones', function( err, client, done) {
    if(err) {
      console.log( 'error: ', err);
      process.exit(1);
    }

    client.query( sql, function( err, result ) {
      done();

      if( err ) {
        console.log( 'error: ', err );
        process.exit(1);
      }

      process.exit(0);
    });
});

const query = client.query(
    'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', () => { client.end(); });
