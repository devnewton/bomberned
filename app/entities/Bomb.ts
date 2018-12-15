/// <reference path="../../typings/phaser.d.ts"/>
import { BombernedGame } from "../BombernedGame";
import { Level } from "../states/Level";
import { Explosion } from "./Explosion";

const TIME_BEFORE_EXPLOSION = 50000;
const ABOUT_TO_EXPLODE_ANIM_DURATION = 3000;

export class Bomb extends Phaser.Sprite {

    explosionTime: number;
    explosionSize = 3;

    constructor( game: Phaser.Game ) {
        super( game, game.world.centerX, game.world.centerY, 'bomb' );
        ( <BombernedGame>game ).addSpriteAnimation( this, 'bomb.dropped', 2 );
        ( <BombernedGame>game ).addSpriteAnimation( this, 'bomb.abouttoexplode', 3 );

        this.explosionTime = game.time.time + TIME_BEFORE_EXPLOSION;
        this.play( 'bomb.dropped', 4, true );
        this.anchor.setTo( 0.5, 0.5 );
        
        ( <Level>this.game.state.getCurrentState() ).bombs.add(this);
    }

    static preload( game: Phaser.Game ) {
        game.load.atlasXML( 'bomb', 'sprites/devnewton/bomb.png', 'sprites/devnewton/bomb.xml' );
    }
    
    damage(amount: number): Phaser.Sprite {
        if ( this.game.time.time < ( this.explosionTime - ABOUT_TO_EXPLODE_ANIM_DURATION ) ) {
            this.explosionTime = this.game.time.time + ABOUT_TO_EXPLODE_ANIM_DURATION;
        }
        return this;
    }

    update() {
        if ( this.game.time.time > ( this.explosionTime - ABOUT_TO_EXPLODE_ANIM_DURATION ) ) {
            this.play( 'bomb.abouttoexplode', 15, false );
        }
        if ( this.game.time.time > this.explosionTime ) {
            let explosion = new BombExplosion( this.game, 'bomb.explosion.center', 0 );
            explosion.x = this.x;
            explosion.y = this.y;

            for ( let i = 1; i <= this.explosionSize; ++i ) {
                let animation = i === this.explosionSize ? 'bomb.explosion.end' : 'bomb.explosion.side';
                
                let explosionTop = new BombExplosion( this.game, animation, 180 );
                explosionTop.x = this.x;
                explosionTop.y = this.y - i * 32;
                
                let explosionBottom = new BombExplosion( this.game, animation, 0 );
                explosionBottom.x = this.x;
                explosionBottom.y = this.y + i * 32;
                
                let explosionLeft = new BombExplosion( this.game, animation, 90 );
                explosionLeft.x = this.x - i * 32;
                explosionLeft.y = this.y;
                
                let explosionRight = new BombExplosion( this.game, animation, -90 );
                explosionRight.x = this.x + i * 32;
                explosionRight.y = this.y;
            }
            this.destroy();
        }
    }
}

export class BombExplosion extends Explosion {
    constructor( game: Phaser.Game, animation: string, angle: number ) {
        super( game, game.world.centerX, game.world.centerY, 'bomb' );
        ( <BombernedGame>game ).addSpriteAnimation( this, animation, 8 );
        this.play( animation, 3, false, true );
        this.anchor.setTo( 0.5, 0.5 );
        this.angle = angle;
        ( <Level>this.game.state.getCurrentState() ).explosions.add(this);
    }
    
    kill(): Phaser.Sprite {
        this.destroy();
        return super.kill();
    }
}