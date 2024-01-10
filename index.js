let static = require('node-static');
let http = require('http');
let ws = require('ws');

// El servidor buscar recursos dentro de nuestra carpeta './public'
let file = new static.Server('./public');
 
let httpServer = http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
});

// Configuramos el servidor de Web Socket a través del servidor HTTP
let wsServer = new ws.WebSocketServer({ server: httpServer });

// Ponemos a escuchar el servidor HTTP
httpServer.listen(8080);

// Configuramos las peticiones que deberemos escuchar mediante el servidor de Web Sockets
wsServer.on('connection', (conn) => {
    console.log("[*] EVENT: Connection");
    conn.on('message', (data) => {
        console.log("[*] EVENT: Data recived - " + data.toString());
    });
});