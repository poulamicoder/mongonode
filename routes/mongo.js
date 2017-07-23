/**
 * Created by i.k on 5/10/17.dbmanagement
 */
var express = require('express');
var router = express.Router();
var _res;
var _collection;
var _url;
var _collectName;
var command, doc, keyword;

function checkLogin(req, res, next) {
    var adminDet = req.session.admin;
    if (adminDet && adminDet.authenticated) {
        req.session.admin = adminDet;
        return next();
    } else {
        res.redirect('/');
    }
}
/* GET home page. */
router.route('/')
        .get(checkLogin, function(req, res, next) {
  res.render('mongo', { title: 'Mongodb Management' });
});
router.post('/', function(req, res, next) {                 //receiving post request from a client(mongodb management)
    command = req.body.command;
    if(req.body.doc != ""){
        doc = JSON.parse(req.body.doc);
    }else {
        doc = "";
    }
    if(req.body.search != ""){
        keyword = JSON.parse(req.body.search);
    }else {
        keyword = "";
    }

    _res = res;
    dbName = req.body.dbName;
    collName = req.body.collName;
    if(init(dbName,collName))
    {
        _connectDB();
    }
});

function  init(dbName,collName) {                       //for initializing mongodb object
  //  _url = "mongodb://newmongoapp:UBiylxbkpDoMvH8Od2yfW70Ofq4jyDYH3NrrEtTFoY3dKRbVk8rGkDhOSLFT0TrxzTajPhTFzl7WuthPNj7adg==@newmongoapp.documents.azure.com:10255/?ssl=true" + dbName;
    _collectName = collName;
    console.log("init");
    return true;
}
function _connectDB() {                                 //connecting mongodb
    mongoClient = require('mongodb').MongoClient;
 mongoClient.connect("mongodb://newmongoapp:UBiylxbkpDoMvH8Od2yfW70Ofq4jyDYH3NrrEtTFoY3dKRbVk8rGkDhOSLFT0TrxzTajPhTFzl7WuthPNj7adg==@newmongoapp.documents.azure.com:10255/?ssl=true", function (err, db) {
  if (err) console.log("err " + err);
        console.log("connected to " + _url);
        _createCollection(db);
});  

//     mongoClient.connect(_url, function (err,db) {
//         if (err) throw err;
//         console.log("connected to " + _url);
//         _createCollection(db);
//     });
    return true;
}
function _createCollection(db) {                        //new collection create or get exist collection
    db.createCollection(_collectName, function(err, collection){
        if (err) throw err;
        console.log("Created " + _collectName);
        _collection = collection;
        _panel(command);
    });
    return true;
}
function _panel(command) {                              //mongodb control panel.
    switch (command){
        case 'i':
            console.log("insert");
            _collection.insert(doc,function(err, records){
                console.log(records);
                var data = {"message":"Record added! ",result:records.ops};
                _res.send(data);
            });
            break;
        case 'f':
            console.log("find");
            _collection.find(keyword,function(err, records){
                console.log(records);
                //var data = {"message":"Record added! ",result:records.ops};
                _res.send("found! ");
            });
            break;
        case 'u':
            console.log("update");
            _collection.update(keyword,doc,function(err, records){
                console.log(records);
                _res.send("Updated! ");
            });
            break;
        case 'd':
            console.log("delete");
            _collection.remove(keyword,function(err, records){
                console.log(records);
                _res.send("Deleted!");
            });
            break;
    }
}
module.exports = router;

