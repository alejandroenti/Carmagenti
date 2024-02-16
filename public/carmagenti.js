let playerNum = 0;

// Cars
let player1;
let player2;

// Bullet
let bullet1;
let bullet2;
let canShoot = true;
const BULLET_SPEED = 4;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const socket = new WebSocket("ws://10.40.3.34:8080");

socket.addEventListener('open', (event) => {
});

socket.addEventListener('message', (event) => {
    let data = JSON.parse(event.data);

    // Si recibimos un campo llamado playerNum, asignaremos el valor a nuestra variable playerNum
    if (data.playerNum != undefined) {
        playerNum = data.playerNum;
        console.log(`Player Number: ${playerNum}`);
    }

    // Si recibidos datos con un campo x (con uno nos sirve) revisaremos qué usuario somos para poder mover al otro jugador con los datos recibidos ({x, y, r})
    else if (data.x != undefined) {
        // En caso de ser el jugador 1, asignamos los valores recibidos al player2
        if (playerNum === 1&& player2 != undefined) {
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

        if (playerNum > 2 && player1 != undefined && player2 != undefined) {
            if (data.n === 1) {
                player1.x = data.x;
                player1.y = data.y;
                player1.rotation = data.r;
            }
        
            if (data.n === 2) {
                player2.x = data.x;
                player2.y = data.y;
                player2.rotation = data.r;
            }
        }
    }

    // Si recibidos datos con un campo bx, deberemos generar (si no está creada una bala y actualizar su posicón)
    else if (data.bx != undefined) {
        if (playerNum === 1) {
            if (bullet2 === undefined) {
                bullet2 = global_game.add.image(data.bx, data.by, "bullet-img");
                bullet2.setScale(0.3);
                bullet2.rotation = data.br;
                global_game.physics.add.collider(player1, bullet2, () => {
                    console.log("Collided Player " + playerNum);
                    bullet2.destroy(true, false);
                    let collided = {
                        player: 1,
                        collided: true
                    };
                    socket.send(JSON.stringify(collided));
                });
                global_game.physics.add.existing(bullet2, false);
            }
            bullet2.y -= BULLET_SPEED * Math.cos(bullet2.rotation);
            bullet2.x += BULLET_SPEED * Math.sin(bullet2.rotation);
        }
        
        else if (playerNum === 2) {
            if (bullet1 === undefined) {
                bullet1 = global_game.add.image(data.bx, data.by, "bullet-img");
                bullet1.setScale(0.3);
                bullet1.rotation = data.br;
                global_game.physics.add.collider(player2, bullet1, () => {
                    console.log("Collided Player " + playerNum);
                    bullet1.destroy(true, false);
                    let collided = {
                        player: 2,
                        collided: true
                    };
                    socket.send(JSON.stringify(collided));
                });
                global_game.physics.add.existing(bullet1, false);
            }
            bullet1.y -= BULLET_SPEED * Math.cos(bullet1.rotation);
            bullet1.x += BULLET_SPEED * Math.sin(bullet1.rotation);
        }

        else {
            if (data.n === 1) {
                if (bullet1 === undefined) {
                    bullet1 = global_game.add.image(data.bx, data.by, "bullet-img");
                    bullet1.setScale(0.3);
                    bullet1.rotation = data.br;
                }
                bullet1.y -= BULLET_SPEED * Math.cos(bullet1.rotation);
                bullet1.x += BULLET_SPEED * Math.sin(bullet1.rotation);
            }

            if (data.n === 2) {
                if (bullet2 === undefined) {
                    bullet2 = global_game.add.image(data.bx, data.by, "bullet-img");
                    bullet2.setScale(0.3);
                    bullet2.rotation = data.br;
                }
                bullet2.y -= BULLET_SPEED * Math.cos(bullet2.rotation);
                bullet2.x += BULLET_SPEED * Math.sin(bullet2.rotation);
            }
        }
    }

    else if (data.gameOver != undefined) {

        bg_endgame = global_game.add.rectangle(0, 0, config.width*2, config.height*2, 0x000000);

        if (data.gameOver === playerNum) {
            text = global_game.add.text(config.width / 3, config.height / 2, "YOU LOSE!", {font: '600 36px Arial', color: '#E21A1A'});
        }
        else if (data.gameOver != playerNum && playerNum <= 2) {
            text = global_game.add.text(config.width / 3, config.height / 2, "YOU WON!", {font: '600 36px Arial', color: '#29B72B'});
        }
        else {
            let number;
            data.gameOver === 1 ? number = 2 : number = 1;
            text = global_game.add.text(config.width / 3, config.height / 2, "Player " + number + " WON", {font: '600 36px Arial', color: '#FFFFFF'});
        }
    }
});

// Car Speed (LINEAR AND ANGULAR)
const CAR_SPEED = 3.5;
const CAR_ROTATION = 4;

// Car Angles
let player1Angle = 0;
let player2Angle = 0;

// Input Keys
let cursors;
let space;

// Track background
let bg;
let bg_endgame;
let text;

const game = new Phaser.Game(config);

let global_game

function preload() {
    global_game = this

    this.load.image("bg-img", "assets/PNG/Tracks/track.png");
    this.load.image("car1-img", "assets/PNG/Cars/car_blue_small_1.png");
    this.load.image("car2-img", "assets/PNG/Cars/car_red_small_1.png");
    this.load.image("bullet-img", "assets/PNG/Objects/bullet.png");
}

function create() {

    bg = this.add.image(config.width / 2, config.height / 2, "bg-img");

    player1 = this.add.image(config.width / 4, config.height / 2, "car1-img");
    player2 = this.add.image(3 * config.width / 4, config.height / 2, "car2-img");

    player1.setScale(0.5);
    player2.setScale(0.5);

    cursors = this.input.keyboard.createCursorKeys();
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.physics.add.collider(player1, player2);

    this.physics.add.existing(player1, false);
    this.physics.add.existing(player2, false);
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

        // Al pulsar el espacio dispararemos una bala
        // X + 2/3 ancho * sin(ángulo)
        // Y - 2/3 ancho * cos(ángulo)
        if (space.isDown && canShoot) {
            bullet1 = this.add.image(
                player1.x + (2 * player1.width / 3)* Math.sin(player1Angle * Math.PI / 180),
                player1.y - (2 * player1.width / 3) * Math.cos(player1Angle * Math.PI / 180),
                "bullet-img"
            );
            bullet1.setScale(0.3);
            bullet1.rotation = player1Angle * Math.PI / 180;
            canShoot = false;
        }
        
        player1.rotation = player1Angle * Math.PI / 180;
        
        let playerData = {
            n: 1,
            x: player1.x,
            y: player1.y,
            r: player1.rotation
        }

        socket.send(JSON.stringify(playerData));

        // Actualizamos la posición de la bala en caso de que exista o que no podamos disparar 
        if (bullet1 === undefined || canShoot) {
            return;
        }

        bullet1.y -= BULLET_SPEED * Math.cos(bullet1.rotation);
        bullet1.x += BULLET_SPEED * Math.sin(bullet1.rotation);

        let bulletData = {
            n: 1,
            bx: bullet1.x,
            by: bullet1.y,
            br: bullet1.rotation
        }

        socket.send(JSON.stringify(bulletData));
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

        if (space.isDown && canShoot) {
            bullet2 = this.add.image(
                player2.x + (2 * player2.width / 3) * Math.sin(player2Angle * Math.PI / 180),
                player2.y - (2 * player2.width / 3) * Math.cos(player2Angle * Math.PI / 180),
                "bullet-img"
            );
            bullet2.setScale(0.3);
            bullet2.rotation = player2Angle * Math.PI / 180;
            canShoot = false;
        }
        
        player2.rotation = player2Angle * Math.PI / 180;

        let playerData = {
            n: 2,
            x: player2.x,
            y: player2.y,
            r: player2.rotation
        }

        socket.send(JSON.stringify(playerData));

        // Actualizamos la posición de la bala en caso de que exista o que no podamos disparar 
        if (bullet2 === undefined || canShoot) {
            return;
        }

        bullet2.y -= BULLET_SPEED * Math.cos(bullet2.rotation);
        bullet2.x += BULLET_SPEED * Math.sin(bullet2.rotation);

        let bulletData = {
            n: 2,
            bx: bullet2.x,
            by: bullet2.y,
            br: bullet2.rotation
        }

        socket.send(JSON.stringify(bulletData));
    }
}