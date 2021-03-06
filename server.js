// init project
let express = require('express');
let routes = require("./routes/routes.js");
let mongo = require("mongodb");
let path = require("path");
let api = require("./api/url_shortener.js");

let app = express();

let mongodbUri = process.env.MONGODB_URI

mongo.MongoClient.connect(mongodbUri, (err, db) => {  
  if(err){
    console.log(`Database failed connection with err ${err}`)
    throw new Error("Database failed to connect");
  }else{
    console.log("Successully connected to MongoDB");
  }

  db.createCollection("sites", {
    capped: true,
    size: 5242880,
    max: 5000
  });
  
  app.use(express.static('public'));

  // configure routes
  routes(app, db);
  
  // where the magic happens
  api(app, db);

  // listen for requests :)
  let port = process.env.PORT || 8000;
  app.listen(port, function () {
    console.log(`LittleUrl is listening on port ${port}`);
  });  
});

