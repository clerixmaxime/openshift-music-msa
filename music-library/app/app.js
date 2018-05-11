/*eslint-env node*/

/*eslint-disable radix, no-unused-params, unknown-require*/
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var probe = require('kube-probe');

var port = process.env.PORT || 8080;
var mongodb_url = "mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@"  + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

probe(app);

app.get('/', function (req, res) {
  res.send('Welcome to my music app!');
});

app.get('/music', function (req, res) {
    
    MongoClient.connect(mongodb_url, function(err, client) {
        
        if(err) {
            res.status(500).send("Can't connect to the database" + err);
            return console.dir(err);
        }
        
        var collection = client.db("music").collection("music");
        
        collection.find().toArray(function (err, items) {
            if (err) {
                res.status(500).send("Empty result." + err);
            } else {
                res.status(200).send(items);
            }
        });
    });
});

app.post('/music', function (req, res) {
    
    MongoClient.connect(mongodb_url, function(err, client) {
        
        if(err) {
            res.status(500).send("Can't connect to the database" + err);
            return console.dir(err);
        }
        
        var collection = client.db("music").collection("music");
        
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
  MongoClient.connect(mongodb_url, function(err, client) {
        
        if(err) {
            res.status(500).send("Can't connect to the database" + err);
            return console.dir(err);
        }
        
        var collection = client.db("music").collection("music");
        
        var id = parseInt(req.params.id);
        
        collection.findOne({'id': id}, function(err,item){
            if (err) {
                res.status(500).send(err);
            } else {
                console.log(item);
                res.status(201).send(item);
            }
        });
        
    });
});

app.delete('/music/:id', function (req, res) {
  MongoClient.connect(mongodb_url, function(err, client) {
        
        if(err) {
            res.status(500).send("Can't connect to the database" + err);
            return console.dir(err);
        }
        
        var collection = client.db("music").collection("music");
        var id = parseInt(req.params.id);
        
        collection.remove({'id': id}, function (err, item) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(item);
            }
        });
    });
});

app.listen(port, function () {
  console.log('Example app listening on port : ' + port);
});
