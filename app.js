var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var app = express();
//include the node postgres library
var pg = require('pg');

app.use('/', bodyParser());

app.set('views', './');
app.set('view engine', 'pug');
app.use(express.static("public"));
//connect to a database

var connectionString= 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard'

app.get('/', function (req, res) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('select * from messages', function(err, result) {
      console.log('messages: ')
      var results= result.rows;
      console.log(results);
      done();
      res.render('public/views/index', {messages: results})
    });
    pg.end();
  });
})

app.get('/write', (request,response) => {
    response.render('public/views/form')
});

app.post('/write', (request, response) => {
  pg.connect(connectionString, function(err, client, done) {
    if (request.body.title != "" && request.body.message != "") { //To not post messages where there is no message or title. 
      client.query('insert into messages (title, body) values (\'' + request.body.title + '\', \'' + request.body.message +'\')', function (err) {
        if (err) {
          throw err
        }
        done();
        var redirect = function() {
          response.redirect('/')
        };
        redirect();
      })
    } else {
      response.end('Posting message failure: title or message missing sir!');
    }
  })
  console.log(request.body.message);
  pg.end();
});

// app.post('/write', (request, response) => {
//   pg.connect(connectionString, function(err, client, done) {
//     if (request.body.title != "" && request.body.message != "") { //To not post messages where there is no message or title. 
//       client.query('insert into messages (title, body) values ($1, $2)', [request.body.title, request.body.message]), function (err) {
//         if (err) {
//           throw err
//         }
//         done();
//       }
//       response.redirect('/');
//     } else {
//       response.end('Posting message failure: title or message missing sir!');
//     }
//   })
//   console.log(request.body.message);
//   pg.end();
// });

var server = app.listen(3000, function() {
  console.log('http//:localhost:' + server.address().port);
});