/// <reference path="../../typings/phaser.d.ts"/>
import { BombernedGame } from "../BombernedGame";

export class EmotionSprite extends Phaser.Sprite {

    constructor(game: Phaser.Game, key: string, emotion: string) {
        super(game, game.world.centerX, game.world.centerY, 'emotions');
        this.health = 3;
        const anim = key + "." + emotion;
        (<BombernedGame>game).addSpriteAnimation(this, anim, emotion === 'sad' ? 10 : 4);

        this.play(anim, 4, true);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);
    }

    static preload(game: Phaser.Game) {
        game.load.atlasXML('emotions', 'sprites/opengameart/emotions.png', 'sprites/opengameart/emotions.xml');
    }
}