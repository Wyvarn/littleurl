module.exports = (app, db)=>{
  
  // handle the given url on the APP URL, this will get the url and parse it, before trying to getch the given url from the mongo db 
  // database
  app.route("/:url").get(handleGet);
  
  /**
  * Handles get requests on the given url, Will check which type of url we are handling before trying tofind it in the database
  * In this case, gets the url for the given link and passes it to find the url in the db
  * @param request the request to handle
  * @param response the response to send back to client
  **/
  function handleGet(request, response){
    let url = process.env.APP_URL + request.params.url;
    if(url != process.env.APP_URL + "favicon.ico"){
      findUrl(url, db, response);
    }
  }
  
  /**
  * Handles Post requests, which will entail serving the shortened url to the client
  * @param request The request to handle for the given client
  * @param response The response to send back to the client, this will be a JSON
  **/
  function handlePost(request, response){
    
  }
  
  /**
  * Finds the url from the given link in the database. Checks if the given url exists on the given database and returns it, if it is available
  * @param{String} link The link to search for in the database
  * @param{Object} db the database to use for the search
  * @param{Object} response 
  */
  function findUrl(link, db, response){
    let sites = db.Collection("sites");
    
    sites.findOne({
      "short_url" : link
    }, (err, result) => {
      // catch any errors
      if(err){
        console.log(`Error thrown fetching ${link} from databse`)
        throw err
      }
      
      // this is the object of the result
      if(result){
        console.log(`Found link ${result}`);
        console.log(`Redirecting to ${result.original_url}`);
        response.redirect(result.original_url);
      }else{
        // we do not have the original url stored in the database
        response.send({
          error : "This url is not in the database :(. Are you sure you shortened it?"
        });
      }
    });
  }
  
  
  /**
  * Validates the given url, Checks to see if it is an actual url
  * Regex from https://gist.github.com/dperini/729294
  * @param {String} Url to validate
  */
  function validateUrl(url){
    let regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
  }
}