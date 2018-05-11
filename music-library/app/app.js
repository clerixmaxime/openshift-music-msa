/*eslint-env node*/

var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;

var port = process.env.PORT || 8080;

app.get('/', function (req, res) {
  res.send('Welcome to my music app!');
});

app.get('/music', function (req, res) {
    
    MongoClient.connect("mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME, function(err, db) {
        
        if(err) {
            res.status(500).send("Can't connect to the database" + err);
            return console.dir(err);
        }
        
        var collection = db.collection('music');
        
        collection.find().toArray(function (err, items) {
            if (err) {
                res.status(500).send("Could not retrieve musics");
            } else {
                res.status(200).send(items);
            }
        });
    });
});

app.post('/music', function (req, res) {
    
    MongoClient.connect("mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME, function(err, db) {
        
        if(err) {
            res.status(500).send("Can't connect to the database" + err);
            return console.dir(err);
        }
        
        var collection = db.collection('music');
        
        collection.insert(req.body, function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(201).send("Music created");
            }
        });
    });
});

app.get('/music/:id', function (req, res) {
  MongoClient.connect("mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME, function(err, db) {
        
        if(err) {
            res.status(500).send("Can't connect to the database" + err);
            return console.dir(err);
        }
        
        var collection = db.collection('music');
        
        collection.findOne(req.parameters.id, function (err, item) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(201).send(item);
            }
        });
    });
});

app.delete('/music/:id', function (req, res) {
  MongoClient.connect("mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME, function(err, db) {
        
        if(err) {
            res.status(500).send("Can't connect to the database" + err);
            return console.dir(err);
        }
        
        var collection = db.collection('music');
        
        collection.remove({id:req.parameters.id}, function (err, item) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(item);
            }
        });
    });
});

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
