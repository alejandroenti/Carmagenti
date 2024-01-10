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

let car;

const game = new Phaser.Game(config);

function preload () {
    this.load.image("car1-img", "assets/PNG/Cars/car_black_1.png");
}

function create () {
    car = this.add.image(config.width / 2, config.height / 2, "car1-img");
}

function update () {}