/// <reference path="../../typings/phaser.d.ts"/>
import { BombernedGame } from "../BombernedGame";
import { AbstractControls } from "../utils/Controls";
import { Bomb } from "./Bomb";
import { Arrow } from "./Arrow";

interface PlayerState {
    update( player: Player );
}

class PlayerRunningState implements PlayerState {
    
    update( player: Player ) {
        if ( !player.oldPos.equals( player.position ) ) {
            player.oldPos = player.position.clone();
        }
        if ( player.controls ) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            
            let aimingAngle = player.controls.aimingAngle(player.position);
            if(aimingAngle != null) {
	            if( player.controls.isShooting() && !player.arrow.alive && player.game.time.time > player.nextArrowTime ) {
	                player.arrow.fire(player.x, player.y, aimingAngle, 500);
	                player.nextArrowTime = player.game.time.time + 1000;
	            }
            }
            
            if( player.controls.isDroppingBomb() && player.game.time.time > player.nextBombTime) {
                let bomb = new Bomb(player.game);
                bomb.x = player.x;
                bomb.y = player.y;
                player.nextBombTime = player.game.time.time + 1000;
            }
            
            if ( player.controls.isGoingLeft() ) {
                player.body.velocity.x = -1;
            } else if ( player.controls.isGoingRight() ) {
                player.body.velocity.x = 1;
            }           
            if ( player.controls.isGoingUp() ) {
                player.body.velocity.y = -1;
            } else if ( player.controls.isGoingDown() ) {
                player.body.velocity.y = 1;
            }
            player.body.velocity = player.body.velocity.setMagnitude(300);

            if ( player.body.velocity.y < 0 ) {
                player.play( "player.walk.back", 8, false );
            } else if ( player.body.velocity.y > 0 ) {
                player.play( "player.walk.front", 8, false );
            } else if ( player.body.velocity.x < 0 ) {
                player.play( "player.walk.left", 8, false );
            } else if ( player.body.velocity.x > 0 ) {
                player.play( "player.walk.right", 8, false );
            } else {
                player.play( "player.wait", 8, false );
            }
        }

    }
}

const PLAYER_HEALTH = 4

export class Player extends Phaser.Sprite {

    controls: AbstractControls;
    state: PlayerState;
    cpuData: any = {};
    arrow: Arrow;
    nextBombTime = -1;
    nextArrowTime = -1;
    healthbar: Lifebar;
    static RUNNING_STATE = new PlayerRunningState();

    constructor( game: Phaser.Game, key: string ) {
        super( game, game.world.centerX, game.world.centerY, key );
        this.health = PLAYER_HEALTH;
        ( <BombernedGame>game ).addSpriteAnimation( this, 'player.walk.back', 4 );
        ( <BombernedGame>game ).addSpriteAnimation( this, 'player.walk.front', 4 );
        ( <BombernedGame>game ).addSpriteAnimation( this, 'player.walk.left', 4 );
        ( <BombernedGame>game ).addSpriteAnimation( this, 'player.walk.right', 4 );
        ( <BombernedGame>game ).addSpriteAnimation( this, 'player.wait', 1 );

        this.play( "player.wait", 8, false );
        this.anchor.setTo( 0.5, 0.5 );
        this.game.physics.enable( this, Phaser.Physics.ARCADE );
        this.body.setCircle( 24 );
        this.body.collideWorldBounds = true;
        this.game.add.existing( this );
        this.state = Player.RUNNING_STATE;
        
        this.name = key;
        
        this.arrow = new Arrow(game);
        this.arrow.arrowCharge.data.friends = [ this.name ];
        this.arrow.arrowCharge.name = this.name + '-arrow-charge';

        this.data.friends = [ this.arrow.arrowCharge.name ];
        
        this.healthbar = new Lifebar(this.game, PLAYER_HEALTH, 0, 32);
        this.addChild(this.healthbar);
    }

    static preload( game: Phaser.Game ) {
    	game.load.atlasXML( 'healthbar', 'sprites/devnewton/healthbar.png', 'sprites/devnewton/healthbar.xml' );
        game.load.atlasXML( 'ned', 'sprites/devnewton/ned.png', 'sprites/devnewton/player.xml' );
        game.load.atlasXML( 'ned2', 'sprites/devnewton/ned2.png', 'sprites/devnewton/player.xml' );
        game.load.atlasXML( 'moustaki', 'sprites/devnewton/moustaki.png', 'sprites/devnewton/player.xml' );
        game.load.atlasXML( 'moustaki2', 'sprites/devnewton/moustaki2.png', 'sprites/devnewton/player.xml' );
    }

    oldPos = new Phaser.Point( 0, 0 );

    update() {
        super.update()
        this.state.update( this );
    }
    
    invincible = false;

    damage(amount: number): Phaser.Sprite {
        if (!this.invincible) {
            this.invincible = true;
            this.game.add.tween(this).from({ tint: 0xFF0000 }).to({ tint: 0xFFFFFF }, 1000, Phaser.Easing.Linear.None, true, 0, 4, false).onComplete.add(() => this.invincible = false);
            super.damage(amount);
            this.healthbar.update();
        }
        return this;
    }
    
    
    kill(): Phaser.Sprite {
        let ghost = new Ghost(this.game, this.key as string);
        ghost.x = this.x;
        ghost.y = this.y;
        
        let goToHeavenTween = this.game.add.tween(ghost);
        goToHeavenTween.to({y: -100}, 5000, "Linear", true);
        
        let swirlTween = this.game.add.tween(ghost);
        swirlTween.to({x: "-50"}, 1000, "Linear", true, 0, -1, true);
        
        this.game.state.getCurrentState().add.existing(ghost);
        
        this.destroy();
        return this;
    }

}

class Ghost extends Phaser.Sprite{
    constructor( game: Phaser.Game, key: string ) {
        super( game, game.world.centerX, game.world.centerY, key );
        this.outOfBoundsKill = true;
        ( <BombernedGame>game ).addSpriteAnimation( this, 'player.ghost', 1 );
        this.play( "player.ghost", 1, false );
        this.anchor.setTo( 0.5, 0.5 );
    }
}

const LIFEBAR_FRAMES = 4;
class Lifebar extends Phaser.Sprite {	
    constructor( game: Phaser.Game, maxHealth: number, x:number, y:number) {
        super( game, x, y, "healthbar" );
        this.maxHealth = maxHealth;
        for(let i=1; i<=LIFEBAR_FRAMES; ++i) {
        	let h = 'health' + i;
        	this.animations.add(h, [h]);
        } 
        this.play( "life" + LIFEBAR_FRAMES, 1, false );
        this.anchor.setTo( 0.5, 0.5 );
    }
    
    update() {
    	let health = this.parent ? (this.parent as Phaser.Sprite).health : 0;
     	if(health >= LIFEBAR_FRAMES ) {
     		health = LIFEBAR_FRAMES;
     	}
     	if(health <= 0) {
     		this.kill();
     	} else {
    		this.play( "health" + health, 1, false );
    	}
    }
}