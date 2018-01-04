var game = new Phaser.Game(1400, 380, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/kitariworld.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('tiles', 'assets/tilemaps/tiles/tileset1.png');
    game.load.image('cloud', 'assets/tilemaps/tiles/tileset3.png');
    game.load.image('back', 'assets/tilemaps/tiles/king.jpg');
    game.load.audio('song', ['assets/audio/narusong2.mp3']);
    game.load.audio('jump', ['assets/audio/jump4.wav']);
    game.load.spritesheet('coin', 'assets/sprites/coin.png', 31, 31);
    game.load.image('button', 'assets/tilemaps/mute.png', 120, 120);
    game.load.spritesheet('player', 'assets/images/foxyfree1.png', 64.5, 54, 8);

    game.load.audio("coinsnd", "assets/audio/keepcoins2.wav");
}

var map;
var layer;
var cursors;
var music;
var button;
var player;
var jumpButton;
var jumpTimer = 0;
var coins;
var score = 0;
var scoreText;

function create() {

    music = game.sound.play('song');
    game.hurtSnd = game.add.audio('coinsnd');


    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = this.game.width;
    this.scale.maxHeight = this.game.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);


    game.physics.startSystem(Phaser.Physics.ARCADE);



    //////////////////map json/////////////////////////////////

    game.stage.backgroundColor = '#000C51';

    map = game.add.tilemap('map');


    map.addTilesetImage('tileset1', 'tiles');
    map.addTilesetImage('tileset3', 'cloud');
    map.addTilesetImage('king', 'back');


    layer = map.createLayer('back');
    layer.scrollFactorX = 0.2


    level1Layer = map.createLayer('level1');


    layer = map.createLayer('top1');
    layer.scrollFactorX = 0.4

    layer = map.createLayer('top2');

    map.setCollisionBetween(0, 2, true, level1Layer);
    map.setCollisionBetween(19, 20, true, level1Layer);
    map.setCollision(4, true, level1Layer);
    layer.resizeWorld();

    //////////////////////////////////////////////////////////////////////



    stars = game.add.group();


    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 40; i++) {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 120, 0, 'coin');

        //  Let gravity do its thing
        star.body.gravity.y = 200;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.5 + Math.random() * 0.2;


    }



    //button
    button = game.add.button(game.world.centerX - 1600, 330, 'button', actionOnClick);
    button.scale.x = 0.3;
    button.scale.y = 0.3;
    button.fixedToCamera = true;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // le personnage et les  réglages du personnage
    player = game.add.sprite(35, game.world.height - 500, 'player');


    //  activer la physique sur le personnage
    game.physics.enable(player);


    //  propriétés physique du personnage
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 1200;
    player.body.collideWorldBounds = true;



    // spritesheet mouvement gauche et droite
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [4, 5, 6, 7], 10, true);
    player.health = 100;


    //commandes avec le clavier
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


    //camera suit le joueur
    game.camera.follow(player);

    //score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#F5F5F5' });
    scoreText.fixedToCamera = true;
    ///////////////////////score/////////////////////

}

///////////////mute sound/////////////////////////////////////////

function actionOnClick() {

    if (button) {
        music.pause();
    } else {
        music.resume();
    }
    button = !button;
}


//////////////////////////////////////////////////////////////////


function update() {

    game.physics.arcade.collide(stars, level1Layer);
    game.physics.arcade.collide(player, level1Layer);
    game.physics.arcade.overlap(player, stars, collectStar, null, this, );



    //  initialise les mouvement du personnage
    player.body.velocity.x = 0;


    //function pour la camera (clavier)
    if (cursors.left.isDown) {
        //  vers la gauche + vitesse
        player.body.velocity.x = -350;

        player.animations.play('left');
    } else if (cursors.right.isDown) {
        //  vers la droite + vitesse
        player.body.velocity.x = 350;

        player.animations.play('right');
    } else {
        //  a l'arret
        player.animations.stop();

        player.frame = 5;

    }


    //  Jump and sound
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -500;
        jumpTimer = game.time.now + 150;
        var snd = game.add.audio('jump');
        snd.play();
    }
}

function collectStar(player, star) {

    var coins = game.add.audio("coinsnd");
    coins.play();
    // Removes the star from the screen
    star.kill();

    score += 100;
    scoreText.text = 'Score: ' + score;
}