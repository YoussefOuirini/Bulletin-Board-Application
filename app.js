var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var app = express();
//include the node postgres library
var pg = require('pg');

app.use('/', bodyParser())

app.set('views', './');
app.set('view engine', 'pug');

//connect to a database

var connectionString= 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard'

app.get('/', function (req, res) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('select * from messages', function(err, result) {
      console.log('messages: ')
      var results= result.rows;
      console.log(results);
      done();
      res.render('index', {messages: results})
    });
    pg.end();
  });
})

app.get('/write', (request,response) => {
    response.render('form')
});


app.post('/write', (request, response) => {
  pg.connect(connectionString, function(err, client, done) {
    if (request.body.title != "" && request.body.message != "") {
      client.query('insert into messages (title, body) values (\'' + request.body.title + '\', \'' + request.body.message +'\')', function (err) {
        if (err) {
          throw err
        }
        done();
      })
      response.end('Message posted!')
    } else {
      response.end('Posting message failure: title or message missing sir!')
    }
  })
  console.log(request.body.message);
  pg.end();
});


// app.get('/', function (require, result) {
//     pg.connect(connectionString, function(err, client, done) {
//     client.query('select * from hats', function(err, result1) {
//       console.log('hats: ');
//       console.log(result1.rows);
//       //call done and end, same as the read example
//       done();
//     });
//     client.query('select * from users', function(err, result2) {
//       console.log('users: ')
//       console.log(result2.rows);
//       //call done and end, same as the read example
//       done();
//       res.render('index', {result1: result.rows, result2: result.rows})
//     });
//     // client.query('insert into hats (name, material, height, brim) values (\'chicken\', \'feathers\', 10, false)', function (err) {
//     //   if (err) {
//     //     throw (err);
//     //   }
//     //   done();
//     // });
//     pg.end();
//   });
// })

var server = app.listen(3000, function() {
  console.log('http//:localhost:' + server.address().port);
});