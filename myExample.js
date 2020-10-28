var fs = require("fs");
var request = require('request');

//Setting some general scope variables for flow control, and in order
//to avoid private scope problems since this script generates only one general result
var pagina = 0;
var respuesta = "";

//'total' array will contain all the results from all different requests
var total = [];
var errores = [];

//First declaration of the promise
var getAll = new Promise(getCandidatos);
//Here's the first use of my promise function; I will keep declaring it privately
//inside "terminar" function, using it from within the flow
getAll.then(terminar);

function terminar(finished) {
	//I will call this function every time a request promise is resolved; 
	//I will only set finished as TRUE inside the promise when I find an empty results page,
	//which means there is nothing left to read from the API
	if (!finished) {
		console.log(pagina);
		var getAnother = new Promise(getCandidatos);
		//Let's call the same function again, so it creates a new instance of the
		//promise for using it again
		getAnother.then(terminar);
  } else {
  	//I'm finished making requests, so I call the function that processes the results
  	imprimeCandidatos(total);
  	
  	//If there are errors in some requests, we will see the page numbers in console so we can recover
  	//these pages later
  	console.log(errores);
  	console.log("FINISHED");
  	
  }
}

function getCandidatos(resolve, reject) {
  //This is a very straight-forward node http request; I ended up using 'request' library
  //but same thing can be done with regular http.request() method
  
  respuesta = "";
  //starting at already declared page 0
  console.log("PAGINA: " + pagina);

  let param = pagina ? `?last=${pagina}` : '';
  
  var options = {
    url: 'https://[ARC-API_URL]/author/v2/author-service' + param
  };
  
  //whenever I haven't found an empty results page, this is false
  var lastpage = false;
  
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      respuesta = JSON.parse(body);
      
      if (respuesta.more == false) {
        //I reached an empty results page; this must be the end
        lastpage = true;	
      } else {
        for (var x = 0; x < respuesta.authors.length; x++) {
      	  total.push(respuesta.authors[x]);
      	}
      }
      console.log("PRÓXIMA PAG: " + respuesta.last);
      pagina = respuesta.last;
      resolve(lastpage);
    } else {
      //If there's an error, let's just save the page number and go to the next page
      //resolve anyway
      console.log("ERROR:" + ":: " + error);
      errores.push(pagina);
      pagina = Number(pagina) + 1;
      resolve(lastpage);
    }
  });
  
}

function imprimeCandidatos(total) {
  fs.writeFile("autores.json", JSON.stringify(total),{ flag:"w", encoding:"UTF-8" }, function(err) {
    if(err) {
      return console.log(err);
    }
  });

  printCSV(total);
}

function printCSV(total) {
  total.map(author => {
    let line = `${author._id};${author.firstName};${author.lastName};${author.byline};${author.role};${author.image};${author.email};${author.bio};${author.longBio}\n\l`;
    fs.writeFile("autores.csv", line, { flag:"w+", encoding:"UTF-8" }, function(err) {
      if(err) {
        return console.log(err);
      }
    });
  });
}