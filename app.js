var cluster = require('cluster')
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // マスタ
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork(); // ワーカを起動
    }

    cluster.on('death', function(worker) {
        console.log('worker ' + worker.pid + ' died');
    });
} else {

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

app.get('/mongo/bukken', function(req, res){
  var mongo = require('mongodb');
  var Server = mongo.Server;
  var Db = mongo.Db;
  //var server = new Server(mongo_server, 27017, {auto_reconnect: false});
  //var db = new Db('lw', server, {safe:true});
  var user_id   = req.param('user_id');
  var bukken_id = req.param('bukken_id');
  var serverOptions = {
    auto_reconnect: true
    ,poolSize: 1 
  };

  var q = {};
  q['bukken_id'] = parseInt(bukken_id);

  var client = new Db('lw', new Server(mongo_server, 27017, serverOptions), {safe:false}),
    f = function (err, collection) {
      if (err) {
        return console.log(new Date + " MONGO DB collection ERROR: " + err);
      }
      
      collection.findOne(q, function(err, doc) {
        if (err) {
          return console.log(new Date + " MONGO DB find ERROR: " + err);
        }
        client.close();
        res.render('bukken', { user_id: user_id
                               ,bukken_id: bukken_id
                               ,doc: doc
                               ,database: 'mongo'
                               ,worker_id: cluster.worker.id
                  });
      });
    };

  client.open(function(err, p_client) {
    if (err) {
      return console.log(new Date + " MONGO DB open ERROR: " + err);
    }
    client.collection('bukken', f);
  });


  //db.open(function(err, db) {
  //  if (err) {
//      return console.log(new Date + " MONGO DB OPEN ERROR: " + err);
//    }
//    db.collection('bukken', function(err, collection) {
//      if (err) {
//        return console.log(new Date + " MONGO COLLECTION ERROR: " + err);
//      }
//      collection.findOne(q, function(err, doc) {
//        if (err) {
//          return console.log(new Date + " MONGO FIND ERROR: " + err + " query = " + q);
//        }
//        db.close();
//        res.render('bukken', { user_id: user_id
//                               ,bukken_id: bukken_id
//                               ,doc: doc 
//                               ,database: 'mongo'
//                               ,worker_id: cluster.worker.id
//                  });
//      });
//    });
//  });
});

app.get('/oracle/bukken', function(req, res){
  var oracle = require('db-oracle');
  var user_id   = req.param('user_id');
  var bukken_id = req.param('bukken_id');

  new oracle.Database({
      hostname: oracle_server,
      user: 'test',
      password: 'test',
      database: 'XE.oracle-server'
  }).connect(function(err) {
      if (err) {
        return console.log(new Date + " ORACLE CONNECTION ERROR: " + err);
      }
      this.query().select('*').from('bukken').where('"bukken_id"=' + bukken_id).execute(function(err, doc) {
          if (err) {
            return console.log(new Date + " ORACLE QUERY ERROR: " + err);
          }
          res.render('bukken', { user_id: user_id
                                 ,bukken_id: bukken_id
                                 ,doc: doc[0] 
                                 ,database: 'oracle'
                                 ,worker_id: cluster.worker.id
                    });
      });
  });
});


app.get('/mongo/api', function(req, res){
  async.waterfall( [a,b,c,d,e,closeClient],
                 function(err, results) {
                   if (err) { console.log(new Date + "ERROR: " + err); }
                   res.send(results);
  });


function a(callback){
  var mongo = require('mongodb');
  var Server = mongo.Server;
  var Db = mongo.Db;
  var serverOptions = {
    auto_reconnect: true
    ,poolSize: 1 
    ,socketOptions:{timeout : 0, keepAlive : 1}
  };
  var client = new Db('lw', new Server(mongo_server, 27017, serverOptions), {safe:false});

  callback(null, client);
}

function b(client, callback){
  var bukken_id = 0;
  client.open(function(err, p_client) {
    if (err) { return console.log(new Date + " MONGO client open ERROR: " + err); }
    client.collection('actionhistory', function(err, collection){
      if (err) { return console.log(new Date + " MONGO collection  ERROR: " + err); }
      collection.find({'user_id':parseInt(req.param('user_id'))}).sort({'created_at':-1}).limit(10).toArray( function(err, array){
        if (err) { return console.log(new Date + " MONGO b:find  ERROR: " + err); }
        //たぶんnodeでsortしたほうが早い
        callback(null, client, array);
      });
    });
  });
}

function c(client, array, callback){
  var keyword = "";
  client.collection('keyword', function(err, collection){
    if (err) { return console.log(new Date + " MONGO c:collection  ERROR: " + err); }
    collection.find({'bukken_id':array[0].bukken_id}).limit(10).toArray( function(err, array){
      if (err) { return console.log(new Date + " MONGO c:find  ERROR: " + err); }
      keyword = array[0].keyword;

      callback(null, client, keyword);
    });
  });
}

function d(client, keyword, callback){
  var rec_bukken_id = "";
  client.collection('keyword', function(err, collection){
    if (err) { return console.log(new Date + " MONGO d:collection  ERROR: " + err); }
    collection.find({'keyword':keyword}).limit(10).toArray( function(err, array){
      if (err) { return console.log(new Date + " MONGO d:find  ERROR: " + err); }
      rec_bukken_id = array[0].bukken_id;

      callback(null, client, rec_bukken_id);
    });
  });
}
function e(client, rec_bukken_id, callback){
  client.collection('bukken', function(err, collection){
    if (err) { return console.log(new Date + " MONGO e:collection  ERROR: " + err); }
    collection.find({'bukken_id':rec_bukken_id}).limit(2).toArray( function(err, json){
      if (err) { return console.log(new Date + " MONGO e:find  ERROR: " + err); }

      callback(null, client, json);
    });
  });
}

function closeClient(client, json, callback){
  client.close();
  callback(null, json);
}

});




app.get('/mongo/api2', function(req, res){
  var mongo = require('mongodb');
  var Server = mongo.Server;
  var Db = mongo.Db;
  var serverOptions = {
    auto_reconnect: true
    ,poolSize: 5 
    //,socketOptions:{timeout : 0, keepAlive : 1}
  };
  
  var server = new Server(mongo_server, 27017, serverOptions);
  db = new Db('lw', server, {safe:true});
  user_id = req.param('user_id');
  api_id  = req.param('api_id');
  json = "";

  db.open(function(err, db) {
    // レコメンド物件取得処理 
    //async.waterfall( [getActionHistory, getBukkenIds, calcKeyword, getKeyBestTen, calcBukken, getBukkenJson],
    async.waterfall( [getActionHistory],
                     function(err, results) {
                       if (err) {
                         return console.log(new Date + " MONGO API RESULTS ERROR: " + err + " results = " + results);
                       }
                       db.close();
                       //res.send(results);
                       //console.log("db.close()");
                       res.send("results");
                       //res.render('api', { json: results });
    });
  });
});



/* レコメンド取得処理 */
/* 行動履歴取得 */
function getActionHistory(callback){
  //console.log("getActionHistory");
  db.collection('actionhistory', function(err, collection) {
    if (err) {
      return console.log(new Date + " MONGO getActionHistory collection ERROR: " + err);
    }
    collection.find({'user_id' : parseInt(user_id)}).sort({"count":-1}).limit(10).toArray( function(err, docs) {
      if (err) {
        return console.log(new Date + " MONGO getActionHistory find ERROR: " + err);
      }
      callback(null, docs[0].bukken_id);
    });
  });
}

/* 行動履歴から物件情報リストを作成する */
function getBukkenIds(docs, callback){
  //console.log("getBukkenIds");
  var bukken_ids = new Array();
  docs.each( function(err, doc){
    if (err) {
      return console.log(new Date + " MONGO getBukkenIds ERROR: " + err);
    }
    if (doc == null ) {
      callback(null, bukken_ids); 
    }else{
      bukken_ids.push({'bukken_id' : doc.bukken_id});
    }
  });
}

/* 物件情報リストから物件に含まれるキーワードごとの合計を計算 */
function calcKeyword(bukken_id, callback){
  console.log("calcKeyword start");
  db.collection('keyword', function(err, collection) {
    if (err) {
      return console.log(new Date + " MONGO calcKeyword collection ERROR: " + err);
    }
    collection.find({'bukken_id' : bukken_id}).limit(2).toArray( function(err, keywords) {
      if (err) {
        return console.log(new Date + " MONGO calcKeyword find ERROR: " + err);
      }
      //console.log(keywords);
      console.log("calcKeyword end");
      callback(null, keywords); 
    });
  });
}

/* キーワード上位10件を配列化 */
function getKeyBestTen(keyhash, callback) {
  var keyword_list = new Array();

  keyhash = sortObj(keyhash, false, true, true);
  var count = 0;
  for (var key in keyhash) {
    count++;
    if (count > 10){break;}
    keyword_list.push({'keyword' : key});
  }
  callback(null, keyword_list);
}

/* キーワードを含む物件のIDを取得 */
function calcBukken(keywords, callback){
  var done = 0;
  var keyword1 = "";
  var keyword2 = "";

  db.collection('keyword', function(err, collection) {
    if (err) {
      return console.log(new Date + " MONGO calcBukken collection ERROR: " + err);
    }
    collection.find({'keyword':keywords[0].keyword}).toArray( function(err, key) {
      if (err) {
        return console.log(new Date + " MONGO calcBukken find ERROR: " + err);
      }
      keyword1 = key;
      console.log(keyword1);
    });
    collection.find({'keyword':keywords[1].keyword}).toArray( function(err, key) {
      if (err) {
        return console.log(new Date + " MONGO calcBukken find ERROR: " + err);
      }
      keyword2 = key;
      console.log(keyword2);
    });
    callback(null, keyword1, keyword2);
  });
}

/* 物件上位2件をjsonとして返す */
function getBukkenJson (keyword1, keyword2, callback) {
  var r1 = Math.floor( Math.random() * keyword1.length - 1 ); 
  var r2 = Math.floor( Math.random() * keyword2.length - 1 ); 
  /* 物件が2以下だった場合は空のハッシュを返す */
  db.collection('bukken', function(err, collection) {
    if (err) {
      return console.log(new Date + " MONGO getBukkenJson collection ERROR: " + err);
    }
    collection.find({'bukken_id':keyword1[r1].bukken_id}).toArray(function(err, bukken1) {
      if (err) {
        return console.log(new Date + " MONGO getBukkenJson find ERROR: " + err);
      }
      console.log(bukken1);
    }); 
    collection.find({'bukken_id':keyword2[r2].bukken_id}).toArray(function(err, bukken2) {
      if (err) {
        return console.log(new Date + " MONGO getBukkenJson find ERROR: " + err);
      }
      console.log(bukken2);
    }); 
    callback(null, "");
  }); 
}


app.get('/oracle/api', function(req, res){
  var oracle = require('db-oracle');
  user_id   = req.param('user_id');
  api_id = req.param('api_id');

  oradb = new oracle.Database({
                 hostname: oracle_server,
                 user: 'test',
                 password: 'test',
                 database: 'XE.oracle-server'
               });
  user_id = req.param('user_id');
  api_id  = req.param('api_id');
  json = "";
  // レコメンド物件取得処理 
  async.waterfall( [getActionHistoryOra, getBukkenIdsOra, calcKeywordOra, getKeyBestTenOra, calcBukkenOra, getBukkenJsonOra],
                   function(err, results) {
                     if (err) {
                       return console.log(new Date + " ORACLE API RESULTS ERROR: " + err + " results = " + results);
                     }
                     res.send(results);
  });
});

/* レコメンド取得処理 */
/* 行動履歴取得 */
function getActionHistoryOra(callback){
  oradb.connect(function(err) {
    if (err) {
      return console.log(new Date + " ORACLE getActionHistoryOra connect ERROR: " + err);
    }
    this.query().select('*').from('actionhistory').where('"user_id"=' + user_id).execute(function(err, docs) {
      if (err) {
        return console.log(new Date + " ORACLE getActionHistoryOra query ERROR: " + err);
      }
      callback(null, docs);
    });
  });
}

/* 行動履歴から物件情報リストを作成する */
function getBukkenIdsOra(docs, callback) {
  var bukken_ids = new Array();
  for ( var i=0; i < docs.length; i++) {
    bukken_ids.push(docs[i].bukken_id);
    if ( i == (docs.length - 1) ) {callback(null, bukken_ids);}
  }
}

/* 物件情報リストから物件に含まれるキーワードごとの合計を計算 */
function calcKeywordOra(bukken_ids, callback) {
  var keyhash = {};
  oradb.connect(function(err) {
    if (err) {
      return console.log(new Date + " ORACLE calcKeywordOra connect ERROR: " + err);
    }
    this.query().select('"keyword"').from('keyword').where('"bukken_id" in (' + bukken_ids.join(',') +')').execute(function(err, keys) {
      if (err) {
        return console.log(new Date + " ORACLE calcKeywordOra query ERROR: " + err);
      }
      if ( typeof keys === "undefined" || keys.length == 0 ) {callback(null, keyhash);}
      for ( var i=0; i < keys.length; i++) {
        if ( typeof keyhash[keys[i].keyword] === "undefined" ) {
          keyhash[keys[i].keyword] = 1;
        } else {
          keyhash[keys[i].keyword] = keyhash[keys[i].keyword] + 1;
        }
        if ( i == (keys.length - 1) ) {callback(null, keyhash);}
      }
    });
  });
}

/* キーワード上位10件を配列化 */
function getKeyBestTenOra(keyhash, callback) {
  var keyword_list = new Array();

  keyhash = sortObj(keyhash, false, true, true);
  var count = 0;
  for (var key in keyhash) {
    count++;
    if (count > 10){break;}
    keyword_list.push("'" + key + "'");
  }
  callback(null, keyword_list);
}

/* キーワードを含む物件のIDを取得 */
function calcBukkenOra(keyword_list, callback){
  var bukkenhash = {};
  oradb.connect(function(err) {
    if (err) {
      return console.log(new Date + " ORACLE calcBukkenOra connect ERROR: " + err);
    }
    this.query().select('"bukken_id"').from('keyword').where('"keyword" in (' + keyword_list.join(',') +')').execute(function(err, keys) {
      if (err) {
        return console.log(new Date + " ORACLE calcBukkenOra query ERROR: " + err);
      }
      if ( typeof keys === "undefined" || keys.length == 0 ) {callback(null, bukkenhash);}
      for ( var i=0; i < keys.length; i++) {
        if ( typeof bukkenhash[keys[i].bukken_id] === "undefined" ) {
          bukkenhash[keys[i].bukken_id] = 1;
        } else {
          bukkenhash[keys[i].bukken_id] = bukkenhash[keys[i].bukken_id] + 1;
        }
        if ( i == (keys.length - 1) ) {callback(null, bukkenhash);}
      }
    });
  });
}

/* 物件上位2件をjsonとして返す */
function getBukkenJsonOra (bukkenhash, callback) {
  bukkenhash = sortObj(bukkenhash, false, true, true);
  var bukken_ids = new Array();
  var count = 0;
  for (var bukken_id in bukkenhash) {
    count++;
    if (count > 2){break;}
    bukken_ids.push(parseInt(bukken_id));
  }
  /* 物件が2以下だった場合は空のハッシュを返す */
  if (count < 2 ) {callback(null,{});}

  oradb.connect(function(err) {
    if (err) {
      return console.log(new Date + " ORACLE getBukkenJsonOra connect ERROR: " + err);
    }
    this.query().select('*').from('bukken').where('"bukken_id" in (' + bukken_ids.join(',') +')').execute(function(err, bukkens) {
    if (err) {
      return console.log(new Date + " ORACLE getBukkenJsonOra query ERROR: " + err);
    }
      callback(null, bukkens);
    });
  });
}






app.get('/mongo', function(req, res){
  var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;
  
  var server = new Server(mongo_server, 27017, {});
  var db = new Db('test', server, {safe:true});
  
  db.open(function(err, db) {
    if (err) {
      return console.log(new Date + " MONGO DB OPEN ERROR: " + err);
    }
    //console.log("DB name: " + db.databaseName);
    db.collection('users', function(err, collection) {
      if (err) {
        return console.log(new Date + " MONGO DB COLLECTION ERROR: " + err);
      }
      //console.log("Collection name: " + collection.collectionName);
      collection.find().toArray(function(err, doc) {
        if (err) {
          return console.log(new Date + " MONGO DB FIND ERROR: " + err);
        }
        //console.log(doc);
        db.close();
        res.send(doc);
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
      database: 'XE.oracle-server'
  }).connect(function(err) {
      if (err) {
        return console.log(new Date + " ORACLE DB connect ERROR: " + err);
      }
      this.query().select('*').from('emp').execute(function(err, rows) {
          if (err) {
            return console.log(new Date + " ORACLE DB query ERROR: " + err);
          }
          console.log(rows.length + ' ROWS');
          console.log(rows[0]);
          //db.close();
          res.send(rows[0]);
      });
  });
});

function sortObj(obj, isKey, isNumber, isDesc){
  var ary = new Array();
  for(var i in obj){
    ary.push({key:i, value:obj[i]});
  }
  ary = ary.sort(sortFunc);
  var ret = new Object();
  for(var i = 0; i < ary.length; i++){
    ret[ary[i].key] = ary[i].value;
  }
  return ret;
  
  function sortFunc(left, right){
    var kv = (isKey) ? "key" : "value";
    var a = left[kv], b = right[kv];
    if(isNumber){
      a = parseFloat(a);
      b = parseFloat(b);
    }else{
      a = String(a);
      b = String(b);
    }
    if(isDesc){
      return a > b ? -1 : a < b ? 1 : 0;
    }else{
      return a < b ? -1 : a > b ? 1 : 0;
    }
  }
}

app.listen(8080);

process.on('uncaughtException', function (err) {
    console.log('uncaughtException => ' + err);
});

}
