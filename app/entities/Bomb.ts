/// <reference path="../../typings/phaser.d.ts"/>
import { BombernedGame } from "../BombernedGame";

const TIME_BEFORE_EXPLOSION = 5000;
const ABOUT_TO_EXPLODE_ANIM_DURATION = 3000;

export class Bomb extends Phaser.Sprite {
    
    explosionTime : number;

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, game.world.centerY, 'bomb');
        (<BombernedGame>game).addSpriteAnimation(this, 'bomb.dropped', 2);
        (<BombernedGame>game).addSpriteAnimation(this, 'bomb.abouttoexplode', 3);

        this.explosionTime = game.time.time + TIME_BEFORE_EXPLOSION;
        this.play('bomb.dropped', 4, true);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);
    }

    static preload(game: Phaser.Game) {
        game.load.atlasXML('bomb', 'sprites/devnewton/bomb.png', 'sprites/devnewton/bomb.xml');
    }
    
    update() {
        if(this.game.time.time > (this.explosionTime - ABOUT_TO_EXPLODE_ANIM_DURATION)) {
            this.play('bomb.abouttoexplode', 15, true);
        }
        if(this.game.time.time > this.explosionTime) {
            // TODO explode !
            this.kill();
        }
    }
}