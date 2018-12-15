/// <reference path="../../typings/phaser.d.ts"/>
import { BombernedGame } from "../BombernedGame";
import { Level } from "../states/Level";
import { Explosion } from "./Explosion";

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
        ( <Level>this.game.state.getCurrentState() ).arrows.add(this);
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
    
    kill(): Phaser.Sprite {
        let explosion = new ArrowExplosion( this.game );
        let explosionPos = new Phaser.Point(this.x + 16, this.y);
        Phaser.Point.rotate(explosionPos, this.x, this.y, this.rotation);
        explosion.x = explosionPos.x;
        explosion.y = explosionPos.y;
        return super.kill();
    }

}

export class ArrowExplosion extends Explosion {
    constructor( game: Phaser.Game ) {
        super( game, game.world.centerX, game.world.centerY, 'arrow' );
        ( <BombernedGame>game ).addSpriteAnimation( this, 'arrow.explode', 8 );
        this.play( 'arrow.explode', 3, false, true );
        this.anchor.setTo( 0.5, 0.5 );
        ( <Level>this.game.state.getCurrentState() ).explosions.add(this);
    }
    
    kill(): Phaser.Sprite {
        this.destroy();
        return super.kill();
    }
}