var express = require('express')
  , routes = require('./routes');
var async = require('async');

var mongo_server = 'mongo-server'
var oracle_server = 'oracle-server'


var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
  res.render('index', { title: 'Express' })
});


app.get('/async', function(req, res){
  async.waterfall(
    [
      /* first */
      function first(callback) {
        console.log('first function');
        var str = '1st';
        callback(null, str);
      },
      /* second */
      function second(str, callback) {
        console.log('second function');
        str = str + '2nd';
        callback(null, str);
      },
      /* last */
      function last(str) {
        console.log('last function');
        console.log('str : ' +  str);
      }
    ]
  );
  res.send("async");
});

app.get('/mongo/bukken', function(req, res){
  var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;
  
  var server = new Server(mongo_server, 27017, {});
  var db = new Db('lw', server, {safe:true});
  var user_id   = req.param('user_id');
  var bukken_id = req.param('bukken_id');

  var q = {};
  q['bukken_id'] = parseInt(bukken_id);

  db.open(function(err, db) {
    db.collection('bukken', function(err, collection) {
      collection.findOne(q, function(err, doc) {
        //debug
        for (var key in q) {
          console.log('q = '+ key + ':'+q[key]);
        }  
        res.render('bukken', { user_id:   user_id,
                               bukken_id: bukken_id,
                               doc: doc })
        db.close();
      });
    });
  });
});

app.get('/mongo/api', function(req, res){
  var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;
  
  var server = new Server(mongo_server, 27017, {});
  var db = new Db('lw', server, {safe:true});
  var user_id = req.param('user_id');
  var api_id  = req.param('api_id');

  var q = {};
  q['user_id'] = parseInt(user_id);

  db.open(function(err, db) {
    db.collection('users', function(err, collection) {
      collection.find(q).toArray(function(err, docs) {
        //debug
        for (var key in q) {
          console.log('q = '+ key + ':'+q[key]);
        }  
        console.log('docs = ' + docs)
        for (var doc in docs) {
          console.log(doc)
        }  

        res.send(docs);
        db.close();
      });
    });
  });
});
















app.get('/mongo', function(req, res){
  var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;
  
  var server = new Server(mongo_server, 27017, {});
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
      hostname: oracle_server,
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

app.listen(8080);
