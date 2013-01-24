var express = require('express')
  , routes = require('./routes');

var app = express();

app.get('/', function(req, res){
  res.send('hello world express!');
});

app.get('/mongo', function(req, res){
  var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;
  
  var server = new Server('localhost', 27017, {});
  var db = new Db('test', server, {safe:true});
  
  db.open(function(err, db) {
    console.log("DB name: " + db.databaseName);
    db.collection('users', function(err, collection) {
      console.log("Collection name: " + collection.collectionName);
      collection.find().toArray(function(err, doc) {
        console.log(doc);
        res.send(doc);
        db.close();
      });
    });
  });
});

app.get('/oracle', function(req, res){
  var oracle = require('db-oracle');
  new oracle.Database({
      hostname: 'localhost',
      user: 'test',
      password: 'test',
      database: 'XE'
  }).connect(function(error) {
      if (error) {
          return console.log("CONNECTION ERROR: " + error);
      }
  
      this.query().select('*').from('EMP').execute(function(error, rows) {
          if (error) {
              return console.log('ERROR: ' + error);
          }
          console.log(rows.length + ' ROWS');
          console.log(rows[0]);
          res.send(rows[0]);
      });
  });
});

app.listen(3000);
