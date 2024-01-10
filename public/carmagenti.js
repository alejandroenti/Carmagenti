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
let car2;

const game = new Phaser.Game(config);

function preload () {
    this.load.image("car1-img", "assets/PNG/Cars/car_blue_small_1.png");
    this.load.image("car2-img", "assets/PNG/Cars/car_red_small_1.png");
}

function create () {
    car = this.add.image(config.width / 4, config.height / 2, "car1-img");
    car2 = this.add.image(3 * config.width / 4, config.height / 2, "car2-img");
}

function update () {}