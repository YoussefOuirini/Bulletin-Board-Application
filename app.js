//include the node postgres library
var pg = require('pg');
//connect to a database
var connectionString= 'postgres://postgres:18061992@localhost/hats_app';
pg.connect(connectionString, function(err, client, done) {
  client.query('select * from hats', function(err, result) {
    //should print 'INSERT: 1'
    console.log(result.rows);
    //call done and end, same as the read example
    done();
    pg.end();
  });
});