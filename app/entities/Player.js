"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerRunningState {
    update(player) {
        if (!player.oldPos.equals(player.position)) {
            player.oldPos = player.position.clone();
        }
        if (player.controls) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            if (player.controls.isGoingLeft()) {
                player.body.velocity.x = -300;
            }
            else if (player.controls.isGoingRight()) {
                player.body.velocity.x = 300;
            }
            if (player.controls.isGoingUp()) {
                player.body.velocity.y = -300;
            }
            else if (player.controls.isGoingDown()) {
                player.body.velocity.y = 300;
            }
            if (player.body.velocity.y < 0) {
                player.play("player.walk.back", 8, false);
            }
            else if (player.body.velocity.y > 0) {
                player.play("player.walk.front", 8, false);
            }
            else if (player.body.velocity.x < 0) {
                player.play("player.walk.left", 8, false);
            }
            else if (player.body.velocity.x > 0) {
                player.play("player.walk.right", 8, false);
            }
            else {
                player.play("player.wait", 8, false);
            }
        }
    }
}
class Player extends Phaser.Sprite {
    constructor(game, key) {
        super(game, game.world.centerX, game.world.centerY, key);
        this.cpuData = {};
        this.oldPos = new Phaser.Point(0, 0);
        this.health = 3;
        game.addSpriteAnimation(this, 'player.walk.back', 4);
        game.addSpriteAnimation(this, 'player.walk.front', 4);
        game.addSpriteAnimation(this, 'player.walk.left', 4);
        game.addSpriteAnimation(this, 'player.walk.right', 4);
        game.addSpriteAnimation(this, 'player.dash.back', 1);
        game.addSpriteAnimation(this, 'player.dash.front', 1);
        game.addSpriteAnimation(this, 'player.dash.left', 1);
        game.addSpriteAnimation(this, 'player.dash.right', 1);
        game.addSpriteAnimation(this, 'player.hammertime', 4);
        game.addSpriteAnimation(this, 'player.hammered', 4);
        game.addSpriteAnimation(this, 'player.wait', 1);
        this.play("player.wait", 8, false);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(24);
        this.body.collideWorldBounds = true;
        this.game.add.existing(this);
        this.state = Player.RUNNING_STATE;
    }
    static preload(game) {
        game.load.atlasXML('ned', 'sprites/devnewton/ned.png', 'sprites/devnewton/player.xml');
        game.load.atlasXML('ned2', 'sprites/devnewton/ned2.png', 'sprites/devnewton/player.xml');
        game.load.atlasXML('moustaki', 'sprites/devnewton/moustaki.png', 'sprites/devnewton/player.xml');
        game.load.atlasXML('moustaki2', 'sprites/devnewton/moustaki2.png', 'sprites/devnewton/player.xml');
    }
    update() {
        super.update();
        this.state.update(this);
    }
}
Player.RUNNING_STATE = new PlayerRunningState();
exports.Player = Player;
//# sourceMappingURL=Player.js.map