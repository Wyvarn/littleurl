// init project
var express = require('express');
let routes = require("./routes/routes.js");
let mongo = require("mongodb");
let path = require("path");

var app = express();

mongo.MongoClient.connect(process.env.MONGOLAB_URI || "mongodb://localhost:27017/url-shortener", (err, db) => {
  
  if(err){
    throw new Error("Database failed to connect");
  }else{
    console.log("Successully connected to MongoDB");
  }
  
});
app.use(express.static('public'));


// simplly serve the index.html file
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// where the magic happens
app.get("/little", (request, response) => {
  
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
