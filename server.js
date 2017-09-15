// init project
let express = require('express');
let routes = require("./routes/routes.js");
let mongo = require("mongodb");
let path = require("path");
let api = require("./api/url_shortener.js");

var app = express();

mongo.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/url-shortener", (err, db) => {
  
  if(err){
    console.error(`Database failed connection with err ${err}`)
    throw new Error("Database failed to connect");
  }else{
    console.log("Successully connected to MongoDB");
  }
  
  app.set("view", path.join(__dirname, "views"));
  app.set("view engine", "pug");

  db.createCollection("sites", {
    capped: true,
    size: 5242880,
    max: 5000
  });
  
  // configure routes
  routes(app, db);
  
  // where the magic happens
  api(app, db);
  
  // app.use(express.static('public'));

  // simplly serve the index.html file
  // app.get("/", function (request, response) {
  //    response.sendFile(__dirname + '/views/index.html');
  //});

  // listen for requests :)
  let port = process.eng.PORT || 8000;
  app.listen(port, function () {
    console.log(`LittleUrl is listening on port ${port}`);
  });  
});

