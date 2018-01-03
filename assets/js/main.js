var game = new Phaser.Game(1400, 380, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/kitariworld.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('tiles', 'assets/tilemaps/tiles/tileset1.png');
    game.load.image('cloud', 'assets/tilemaps/tiles/tileset3.png');
    game.load.image('back', 'assets/tilemaps/tiles/king.jpg');
    game.load.audio('song', ['assets/audio/narusong2.mp3']);
    game.load.audio('jump', ['assets/audio/jump4.wav']);
    game.load.image('button', 'assets/tilemaps/mute.png', 120, 120);
    game.load.spritesheet('player', 'assets/images/foxyfree1.png', 64.5, 54, 8);

}

var map;
var layer;
var cursors;
var music;
var button;
var player;
var jumpButton;
var jumpTimer = 0;

function create() {



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


    //button
    button = game.add.button(game.world.centerX - 1600, 20, 'button', actionOnClick);
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

    //camera avec le clavier
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.camera.follow(player);

    music = game.sound.play('song');

    game.physics.enable(sprite);

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

    game.physics.arcade.collide(player, level1Layer);


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