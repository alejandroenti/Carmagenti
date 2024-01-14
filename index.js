let static = require('node-static');
let http = require('http');
let ws = require('ws');

// Conexión de los usuarios
let p1Conn;
let p2Conn;

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

    // Asignamos la nueva conexión a uno de los jugadores y les enviamos qué usuario son
    if (p1Conn === undefined) {
        p1Conn = conn;
        p1Conn.send('{"playerNum": 1}');
        p1Conn.on('message', (data) => {
            if (p2Conn != undefined) {
                p2Conn.send(data.toString());
                console.log(data.toString());
            }
        });
    }
    else if (p2Conn === undefined) {
        p2Conn = conn;
        p2Conn.send('{"playerNum": 2}');
        p2Conn.on('message', (data) => {
            p1Conn.send(data);
        });
    }
});