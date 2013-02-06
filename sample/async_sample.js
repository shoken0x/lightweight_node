var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var async = require('async');

var server = new Server('localhost', 27017, {});
db = new Db('test', server, {safe:false});

db.open(function(err, db) {
  async.waterfall( 
    [
      hello,
      goodbye 
    ]
  );
  console.log("DB name: " + db.databaseName);
  db.close();
});

function hello(callback) {
  console.log("db = " + db.databaseName);
  console.log("hello");
  callback(null, "t");
}

function goodbye(str, callback){
  console.log(str)

}
