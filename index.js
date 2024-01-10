let static = require('node-static');
let http = require('http');
let ws = require('ws');

// El servidor buscar recursos dentro de nuestra carpeta './public'
let file = new static.Server('./public');
 
let httpServer = http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);

let wsServer = ws.WebSocketServer({ httpServer });