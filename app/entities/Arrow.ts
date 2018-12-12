/// <reference path="../../typings/phaser.d.ts"/>
import { BombernedGame } from "../BombernedGame";

export class Arrow extends Phaser.Sprite {

    constructor(game: Phaser.Game) {
        super(game, 0, 0, 'arrow');
        (<BombernedGame>game).addSpriteAnimation(this, 'arrow.fly', 4);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
        this.health = 0;
        this.alive = false;
        this.game.add.existing( this );
    }
    
    static preload( game: Phaser.Game ) {
        game.load.atlasXML( 'arrow', 'sprites/devnewton/arrow.png', 'sprites/devnewton/arrow.xml' );
    }

    fire(fromX: number, fromY: number, angle: number, speed: number) {
        this.reset(fromX, fromY, 1);
        this.scale.set(1);
        this.game.physics.arcade.velocityFromRotation(angle, speed, this.body.velocity);
        this.rotation = angle;
        this.play('arrow.fly', 4, true);
    }

}

export class Explosion extends Phaser.Sprite {
    constructor( game: Phaser.Game, animation: string, angle: number ) {
        super( game, game.world.centerX, game.world.centerY, 'bomb' );
        ( <BombernedGame>game ).addSpriteAnimation( this, animation, 8 );
        this.play( animation, 3, false );
        this.anchor.setTo( 0.5, 0.5 );
        this.angle = angle;
        this.game.add.existing( this );
    }
}