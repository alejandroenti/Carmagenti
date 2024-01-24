let playerNum = 0;

// Cars
let player1;
let player2;

const socket = new WebSocket("ws://10.40.3.34:8080");

socket.addEventListener('open', (event) => {
});

socket.addEventListener('message', (event) => {
    let data = JSON.parse(event.data);

    // Si recibimos un campo llamado playerNum, asignaremos el valor a nuestra variable playerNum
    if (data.playerNum != undefined) {
        playerNum = data.playerNum;
    }

    // Si recibidos datos con un campo x (con uno nos sirve) revisaremos qué usuario somos para poder mover al otro jugador con los datos recibidos ({x, y, r})
    else if (data.x != undefined) {
        // En caso de ser el jugador 1, asignamos los valores recibidos al player2
        if (playerNum === 1 && player2 != undefined) {
            player2.x = data.x;
            player2.y = data.y;
            player2.rotation = data.r;
        }

        // En caso de ser el jugador 2, asignamos los valores recibidos al player1
        if (playerNum === 2 && player1 != undefined) {
            player1.x = data.x;
            player1.y = data.y;
            player1.rotation = data.r;
        }
    }
});

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Car Speed (LINEAR AND ANGULAR)
const CAR_SPEED = 4;
const CAR_ROTATION = 5;

// Car Angles
let player1Angle = 0;
let player2Angle = 0;

// Input Keys
let cursors;

// Track background
let bg;

const game = new Phaser.Game(config);

function preload() {
    this.load.image("bg-img", "assets/PNG/Tracks/track.png");
    this.load.image("car1-img", "assets/PNG/Cars/car_blue_small_1.png");
    this.load.image("car2-img", "assets/PNG/Cars/car_red_small_1.png");
}

function create() {

    bg = this.add.image(config.width / 2, config.height / 2, "bg-img");

    player1 = this.add.image(config.width / 4, config.height / 2, "car1-img");
    player2 = this.add.image(3 * config.width / 4, config.height / 2, "car2-img");

    player1.setScale(0.5);
    player2.setScale(0.5);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {

    // Si aún no nos hemos conectado al servidor, no movemos ningún coche
    if (playerNum === 0) {
        return;
    }

    // El player 1 es el que actualmente puede realizar inputs para mover el coche
    if (playerNum === 1) {
        // Car 1 Input Update
        if (cursors.up.isDown) {
            player1.y -= CAR_SPEED * Math.cos(player1Angle * Math.PI / 180);
            player1.x += CAR_SPEED * Math.sin(player1Angle * Math.PI / 180);
        }

        if (cursors.left.isDown) {
            player1Angle -= CAR_ROTATION;
        }
        else if (cursors.right.isDown) {
            player1Angle += CAR_ROTATION;
        }
        
        player1.rotation = player1Angle * Math.PI / 180;

        let playerData = {
            x: player1.x,
            y: player1.y,
            r: player1.rotation
        }

        socket.send(JSON.stringify(playerData));
    }

    else if (playerNum === 2) {
        // Car 1 Input Update
        if (cursors.up.isDown) {
            player2.y -= CAR_SPEED * Math.cos(player2Angle * Math.PI / 180);
            player2.x += CAR_SPEED * Math.sin(player2Angle * Math.PI / 180);
        }

        if (cursors.left.isDown) {
            player2Angle -= CAR_ROTATION;
        }
        else if (cursors.right.isDown) {
            player2Angle += CAR_ROTATION;
        }
        
        player2.rotation = player2Angle * Math.PI / 180;

        let playerData = {
            x: player2.x,
            y: player2.y,
            r: player2.rotation
        }

        socket.send(JSON.stringify(playerData));
    }
}