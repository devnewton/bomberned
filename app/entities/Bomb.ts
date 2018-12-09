/// <reference path="../../typings/phaser.d.ts"/>
import { BombernedGame } from "../BombernedGame";

const TIME_BEFORE_EXPLOSION = 5000;
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
        this.game.add.existing( this );
    }

    static preload( game: Phaser.Game ) {
        game.load.atlasXML( 'bomb', 'sprites/devnewton/bomb.png', 'sprites/devnewton/bomb.xml' );
    }

    update() {
        if ( this.game.time.time > ( this.explosionTime - ABOUT_TO_EXPLODE_ANIM_DURATION ) ) {
            this.play( 'bomb.abouttoexplode', 15, false );
        }
        if ( this.game.time.time > this.explosionTime ) {
            let explosion = new Explosion( this.game, 'bomb.explosion.center', 0 );
            explosion.x = this.x;
            explosion.y = this.y;

            for ( let i = 1; i <= this.explosionSize; ++i ) {
                let animation = i === this.explosionSize ? 'bomb.explosion.end' : 'bomb.explosion.side';
                
                let explosionTop = new Explosion( this.game, animation, 180 );
                explosionTop.x = this.x;
                explosionTop.y = this.y - i * 32;
                
                let explosionBottom = new Explosion( this.game, animation, 0 );
                explosionBottom.x = this.x;
                explosionBottom.y = this.y + i * 32;
                
                let explosionLeft = new Explosion( this.game, animation, 90 );
                explosionLeft.x = this.x - i * 32;
                explosionLeft.y = this.y;
                
                let explosionRight = new Explosion( this.game, animation, -90 );
                explosionRight.x = this.x + i * 32;
                explosionRight.y = this.y;
            }
            this.destroy();
        }
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