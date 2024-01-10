let playerNum = 0;

const socket = new WebSocket("ws://10.40.3.34:8080");

socket.addEventListener('open', (event) => {
    
});

socket.addEventListener('message', (event) => {
    console.log("[*] EVENT: Message from server - ", event.data);
    let data = JSON.parse(event.data);

    if (data.playerNum != undefined) {
        playerNum = data.playerNum;
        console.log("[*] EVENT: Message from server - Player number " + playerNum);
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
const CAR_SPEED = 5;
const CAR_ROTATION = 3;

// Cars
let player1;
let player2;

// Car Angles
let player1Angle = 0;
let player2Angle = 0;

// Input Keys
let cursors;

const game = new Phaser.Game(config);

function preload () {
    this.load.image("car1-img", "assets/PNG/Cars/car_blue_small_1.png");
    this.load.image("car2-img", "assets/PNG/Cars/car_red_small_1.png");
}

function create () {
    player1 = this.add.image(config.width / 4, config.height / 2, "car1-img");
    player2 = this.add.image(3 * config.width / 4, config.height / 2, "car2-img");

    cursors = this.input.keyboard.createCursorKeys();
}

function update () {

    // Car 2 Input Update
    if (cursors.up.isDown) {
        player1.y -= CAR_SPEED * Math.cos(player1Angle * Math.PI / 180);
        player1.x += CAR_SPEED * Math.sin(player1Angle * Math.PI / 180);
    }

    if (cursors.left.isDown) {
        player1Angle -= CAR_ROTATION
        player1.rotation = player1Angle * Math.PI / 180;
    }
    else if (cursors.right.isDown) {
        player1Angle += CAR_ROTATION
    }
    
    player1.rotation = player1Angle * Math.PI / 180;

    let playerData = {
        x: player1.x,
        y: player2.y,
        r: player1.rotation
    }

    socket.send(JSON.stringify(playerData))
}