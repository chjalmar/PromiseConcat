var fs = require("fs");

fs.readFile('autores.json', 'utf8', function(err, data){ 
    
    // Display the file content 
    const autores = JSON.parse(data);

    printCSV(autores);
});

function printCSV(total) {
  let title = `Nombre;Apellido;Firma\n`;
  fs.writeFileSync("autores.csv", title, { flag:"a", encoding:"UTF-8" }, function(err) {
      if(err) {
        return console.log(err);
      }
  });
  
  total.map(author => {
    let line = `${author.firstName};${author.lastName};${author.byline}\n`;
    fs.writeFileSync("autores.csv", line, { flag:"a", encoding:"UTF-8" }, function(err) {
      if(err) {
        return console.log(err);
      }
    });
  });
}