let static = require('node-static');

// El servidor buscar recursos dentro de nuestra carpeta './public'
let file = new static.Server('./public');
 
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);