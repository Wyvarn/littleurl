module.exports = (app, db)=>{
  
  // handle the given url on the APP URL, this will get the url and parse it, before trying to getch the given url from the mongo db 
  // database
  app.route("/:url").get(handleGet);
  
  // handle post requests to enable url shortenning
  app.get("/little/:url*", handlePost);
  
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
    // create a short url and store the display information
    let url = request.url.slice(11);
    
    // we check if the url is valid and generate a shortened url
    if(validateUrl(url)){
      // generate the given url
      
      // Generate link, save in db and send response
      linkGenerator(url, response, db, saveToDb);
    }else{
      response.send({error :"Wrong URL format, please make sure you have a correct and valid url to use."});
    }
  }
  
  /**
  * Finds the url from the given link in the database. Checks if the given url exists on the given database and returns it, if it is available
  * @param{String} link The link to search for in the database
  * @param{Object} db the database to use for the search
  * @param{Object} response 
  */
  function findUrl(link, db, response){
    let sites = db.collection("sites");
    
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
  * Link generator, where the magic actually happens, 
  * @param url the url to generate a short url for
  * @param res the response to us
  * @param db the database to use for the storage of the generated url
  * @param callback the callback function to use to store the url and its shortened version to the database and send back a response
  **/
  function linkGenerator(url, res, db, callback){
    db.collection("sites").find().toArray((err, data) => {
      if(err){
        return callback(err);
      }
      
      // get all short links and put them in an array
      let urlList = data.map((obj)=> {
        return obj.short_url;
      });
      
      // an array of alphabets used in the construction of the shortener
      let alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('')
      let newLink;
      do{
        // Generates random four digit number for link
        let num = Math.floor(100000 + Math.random() * 900000);
        let alpha = alphabets.slice(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)).join("");
        let chars = num.toString() + alpha;
        
        newLink = process.env.APP_URL + chars.substring(0, 5);
      }while(urlList.indexOf(newLink) != -1);
      
      // call callback to perform database transaction
      return callback(null, url, newLink, res, db);
    })
  }
  
  
  /**Callback to save the url to the database alongside the original url
  * @param {String} err the error to handle, if any
  * @param {String} url the url to shorten and save to db for reference
  * @param {String} newLink, the shortened Url link to send as response and save to db
  * @param {object} db, the database to use as storage
  **/
  function saveToDb(err, url, newLink, res, db){
    if(err){
      console.log(`Failed to save to databser with error ${err}`);
      throw err;
    }  
  
    // Create new object
    let urlObj = {
      "original_url": url,
      "short_url": newLink
    };
    
    let sites = db.collection("sites");
    
    sites.save(urlObj, (err, result) =>{
      if(err){
        console.log(`Error encountered while saving to db ${err}`);
        throw err;
      }
      
      // Send response object
      // We need to create the object again because
      // urlObj now contains database id
      res.send({
        "original_url": url,
        "short_url": newLink
      });
      console.log('Saved ' + result);
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