// DATA
// use test
// db.users.insert({name:'fujisaki'})

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
      db.close();
    });
  });
});
