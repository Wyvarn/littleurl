module.exports = function(app, db){
  app.route("/").get((request, response) => {
    response.render("index");
  });
  
  app.route("/little").get((request, response)=> {
    response.render("index", {
      error: "You need to provide a proper URL"
    });
  });
}