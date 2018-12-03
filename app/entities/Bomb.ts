/// <reference path="../../typings/phaser.d.ts"/>
import { BombernedGame } from "../BombernedGame";

export class Bomb extends Phaser.Sprite {

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, game.world.centerY, 'bomb');
        (<BombernedGame>game).addSpriteAnimation(this, 'bomb.dropped', 2);
        (<BombernedGame>game).addSpriteAnimation(this, 'bomb.abouttoexplode', 3);

        this.play('bomb.dropped', 4, true);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);
    }

    static preload(game: Phaser.Game) {
        game.load.atlasXML('bomb', 'sprites/devnewton/bomb.png', 'sprites/devnewton/bomb.xml');
    }
}