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

    // Asignamos la nueva conexión a uno de los jugadores y les enviamos qué usuario son
    // Les asignamos un evento de "mesage" a cada conexión donde, en caso que el otro jugador este conectado, le enviaremos el mensaje
    if (p1Conn === undefined) {
        p1Conn = conn;
        p1Conn.send('{"playerNum": 1}');
        console.log("[*] EVENT: Connection - Player 1");
        p1Conn.on('message', (data) => {
            if (p2Conn == undefined) {
                return;
            }
            p2Conn.send(data.toString());
        });
    }
    else if (p2Conn === undefined) {
        p2Conn = conn;
        p2Conn.send('{"playerNum": 2}');
        console.log("[*] EVENT: Connection - Player 2");
        p2Conn.on('message', (data) => {
            if (p1Conn == undefined) {
                return;
            }
            p1Conn.send(data.toString());
        });
    }
});