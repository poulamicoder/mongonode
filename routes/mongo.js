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

    _url = "mongodb://newmongoapp:UBiylxbkpDoMvH8Od2yfW70Ofq4jyDYH3NrrEtTFoY3dKRbVk8rGkDhOSLFT0TrxzTajPhTFzl7WuthPNj7adg==@newmongoapp.documents.azure.com:10255/?ssl=true" + dbName;

  //  _url = "mongodb://localhost:27017/" + dbName;

    _collectName = collName;
    console.log("init");
    return true;
}
function _connectDB() {                                 //connecting mongodb
    mongoClient = require('mongodb').MongoClient;
    mongoClient.connect(_url, function (err,db) {
        if (err) throw err;
        console.log("connected to " + _url);
        _createCollection(db);
    });
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

            console.log('find');
           // var keyword = 
           //keyword = JSON.stringify(keyword);
           //console.log(keyword);return false;
             var id = new require('mongodb').ObjectID(keyword);//req.params.id
            _collection.findOne({"_id":id},function(err, records){
                console.log(records);
                //var data = {"message":"Record added! ",result:records.ops};
                _res.send(records);
            });
          // var id = new require('mongodb').ObjectID('5965f26b29e0991a283b331f');//req.params.id
           
           

            break;
        case 'u':
            console.log("update");
           var id = new require('mongodb').ObjectID(keyword);//req.params.id
            _collection.updateOne({"_id":id},{$set:doc},function(err, records){
                
               // _res.send("Updated! ");
                _collection.findOne({"_id":id},function(err, records){
                console.log(records);
                //var data = {"message":"Record added! ",result:records.ops};
                _res.send(records);
            });

            });
            
            break;
        case 'd':
            console.log("delete");
             var id = new require('mongodb').ObjectID(keyword);//req.params.id
            _collection.remove({"_id":id},function(err, records){
                 _collection.findOne({"_id":id},function(err, records){
                console.log(records);
                //var data = {"message":"Record added! ",result:records.ops};
                _res.send(keyword + " id  deleted");
            });

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

