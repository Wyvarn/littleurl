// init project
var express = require('express');
var app = express();

app.use(express.static('public'));

// where the magic happens
app.get("/", function (request, response) {
  
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
