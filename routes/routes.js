module.exports = function(app, db){
  app.route("/").get((request, response) => {
    response.sendFile(__dirname + '/index.html');
  });
  
  app.route("/little").get((request, response)=> {
    response.send({
      error: "You need to provide a proper URL"
    });
  });
}