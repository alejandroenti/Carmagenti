const socket = new WebSocket("ws://10.40.3.34:8080");

socket.addEventListener('open', (event) => {
    socket.send("Conectando!");
});

socket.addEventListener('message', (event) => {
    console.log("[!] Mensaje del servidor: ", event.data);
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
let car1;
let car2;

// Car Angles
let car1Angle = 0;
let car2Angle = 0;

// Input Keys
let cursors;

const game = new Phaser.Game(config);

function preload () {
    this.load.image("car1-img", "assets/PNG/Cars/car_blue_small_1.png");
    this.load.image("car2-img", "assets/PNG/Cars/car_red_small_1.png");
}

function create () {
    car1 = this.add.image(config.width / 4, config.height / 2, "car1-img");
    car2 = this.add.image(3 * config.width / 4, config.height / 2, "car2-img");

    cursors = this.input.keyboard.createCursorKeys();
}

function update () {

    // Car 2 Input Update
    if (cursors.up.isDown) {
        car2.y -= CAR_SPEED * Math.cos(car2Angle * Math.PI / 180);
        car2.x += CAR_SPEED * Math.sin(car2Angle * Math.PI / 180);
    }

    if (cursors.left.isDown) {
        car2Angle -= CAR_ROTATION
        car2.rotation = car2Angle * Math.PI / 180;
    }
    else if (cursors.right.isDown) {
        car2Angle += CAR_ROTATION
        car2.rotation = car2Angle * Math.PI / 180;
    }
}