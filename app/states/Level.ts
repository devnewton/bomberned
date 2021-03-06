/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { BombernedGame } from "../BombernedGame";
import { Player } from "../entities/Player";
import { Bomb } from "../entities/Bomb";
import { Arrow } from "../entities/Arrow";

import { Team } from "../entities/Team";
import { Menu } from "../ui/Menu";

import { ControllerType, CPUControls } from "../utils/Controls";
import { DamageResolver } from "../utils/DamageResolver";
import { CPU } from "../ia/CPU";

export class LevelConfig {
    nedController: ControllerType;
    ned2Controller: ControllerType;
    moustakiController: ControllerType;
    moustaki2Controller: ControllerType;
}

export class Level extends AbstractState {

    config: LevelConfig;
    collisionSprites: Phaser.Group;
    damageResolver : DamageResolver;
    bombs: Phaser.Group;
    arrows: Phaser.Group;
    explosions: Phaser.Group;
    nedsTeam: Team;
    moustakisTeam: Team;
    menu: Menu;
    cpus: Array<CPU>;
    isNotFirstFrame: boolean;
    victory: boolean;

    constructor() {
        super();
    }

    preload() {
        Player.preload( this.game );
        Arrow.preload( this.game );
        Bomb.preload( this.game );
        Menu.preload( this.game );
        this.game.load.image( 'neds-win', 'victory/neds-win.png' );
        this.game.load.image( 'moustakis-win', 'victory/moustakis-win.png' );
        this.game.load.tilemap( 'map', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON );
        this.game.load.image( 'dojo', 'levels/dojo.png' );
        this.game.load.audio( 'level-music', 'musics/opengameart/8-bit-music-pack-loopable/bgm_action_4.mp3' )
        this.game.load.audio( 'victory-music', 'musics/opengameart/hungry-dino-9-chiptune-tracks-10-sfx/victory.mp3' )
    }

    init( config: LevelConfig ) {
        this.config = config;
        this.cpus = [];
        this.isNotFirstFrame = false;
        this.victory = false;
    }

    create() {
        super.create();
        this.game.sound.stopAll();
        this.game.sound.play( 'level-music', 1, true );

        this.game.physics.startSystem( Phaser.Physics.ARCADE );
        const map = this.game.add.tilemap( 'map' );
        map.addTilesetImage( 'dojo' );

        const layer = map.createLayer( 'ground' );
        map.createLayer( 'wall' );
        layer.resizeWorld();
        
        this.damageResolver = new DamageResolver(this.game);

        this.collisionSprites = this.game.add.physicsGroup( Phaser.Physics.ARCADE );
        for ( let o of map.objects['collision'] ) {
            if ( o.name === 'world-bounds' ) {
                this.game.physics.arcade.setBounds( o.x, o.y, o.width, o.height );
            } else if ( o.rectangle ) {
                const sprite = this.game.add.sprite( o.x, o.y );
                this.game.physics.enable( sprite, Phaser.Physics.ARCADE );
                sprite.body.immovable = true;
                sprite.width = o.width;
                sprite.height = o.height;
                this.collisionSprites.add( sprite );
            }
        }
        
        this.bombs = new Phaser.Group( this.game );
        this.arrows = new Phaser.Group( this.game );
        this.explosions = new Phaser.Group( this.game );

        let controllers = ( this.game as BombernedGame ).controllers;

        this.nedsTeam = new Team( this.game );
        let nedControls = controllers.getController( this.config.nedController );
        if ( nedControls ) {
            let ned = new Player( this.game, 'ned' );
            ned.x = 256;
            ned.y = 320;
            ned.controls = nedControls
            this.nedsTeam.add( ned );
        }

        let ned2Controls = controllers.getController( this.config.ned2Controller );
        if ( ned2Controls ) {
            let ned2 = new Player( this.game, 'ned2' );
            ned2.x = 256;
            ned2.y = 480;
            ned2.controls = ned2Controls;
            this.nedsTeam.add( ned2 );
        }

        this.moustakisTeam = new Team( this.game );
        let moustakiControls = controllers.getController( this.config.moustakiController );
        if ( moustakiControls ) {
            let moustaki = new Player( this.game, 'moustaki' );
            moustaki.x = 1024;
            moustaki.y = 320;
            moustaki.controls = moustakiControls;
            this.moustakisTeam.add( moustaki );
        }

        let moustaki2Controls = controllers.getController( this.config.moustaki2Controller );
        if ( moustaki2Controls ) {
            let moustaki2 = new Player( this.game, 'moustaki2' );
            moustaki2.x = 1024;
            moustaki2.y = 480;
            moustaki2.controls = moustaki2Controls;
            this.moustakisTeam.add( moustaki2 );
        }

        this.nedsTeam.forEachAlive(( player ) => {
            if ( player.controls instanceof CPUControls ) {
                let cpu = new CPU();
                cpu.me = player;
                cpu.buddies = this.nedsTeam;
                cpu.opponents = this.moustakisTeam;
                cpu.controls = player.controls;
                this.cpus.push( cpu );
            }
        }, null );
        this.moustakisTeam.forEachAlive(( player ) => {
            if ( player.controls instanceof CPUControls ) {
                let cpu = new CPU();
                cpu.me = player;
                cpu.buddies = this.moustakisTeam;
                cpu.opponents = this.nedsTeam;
                cpu.controls = player.controls;
                this.cpus.push( cpu );
            }
        }, null );

        this.menu = new Menu( this.game );
        this.menu.alive = false;
        this.menu.visible = false;
        this.menu.button( "Continue", 200, 260, () => {
            if ( this.victory ) {
                this.game.state.restart( true, false, this.config );
            } else {
                this.menu.alive = false;
                this.menu.visible = false;
            }
        } );
        this.menu.button( "Change teams", 200, 410, () => this.game.state.start( 'TeamSelectScreen', true, false ) );
        this.menu.button( "Return to title", 200, 560, () => this.game.state.start( 'Title', true, false ) );
    }

    update() {
        if ( this.isNotFirstFrame ) {
            if ( !this.checkVictory() ) {
                this.damageResolver.arrowsVersusGroup(this.arrows, this.bombs);
                this.damageResolver.arrowsVersusGroup(this.arrows, this.nedsTeam);
                this.damageResolver.arrowsVersusGroup(this.arrows, this.moustakisTeam);
                this.damageResolver.groupVersusGroup(this.explosions, this.nedsTeam);
                this.damageResolver.groupVersusGroup(this.explosions, this.moustakisTeam);
                this.game.physics.arcade.collide( this.nedsTeam, this.collisionSprites );
                this.game.physics.arcade.collide( this.moustakisTeam, this.collisionSprites );
                this.cpus.forEach( c => c.think() );
            }
            this.checkMenu();
        } else {
            this.isNotFirstFrame = true;
        }

    }

    checkMenu(): boolean {
        if ( this.menu.alive ) {
            return true;
        }
        const controllers = ( this.game as BombernedGame ).controllers;
        let isMenuAsked = controllers.getKeyboardAndMouse().isMenuAsked();
        this.nedsTeam.forEachAlive(( player ) => {
            isMenuAsked = isMenuAsked || player.controls.isMenuAsked();
        }, null );
        this.moustakisTeam.forEachAlive(( player ) => {
            isMenuAsked = isMenuAsked || player.controls.isMenuAsked();
        }, null );
        if ( isMenuAsked ) {
            this.showMenu();
        }
    }

    checkVictory(): boolean {
        if ( !this.victory ) {
            const nedsTeamWin = this.moustakisTeam.countLiving() === 0;
            const moustakisTeamWin = this.nedsTeam.countLiving() === 0;
            this.victory = nedsTeamWin || moustakisTeamWin;
            if ( this.victory ) {
                this.game.sound.stopAll();
                this.game.sound.play( 'victory-music', 1, false );
                //TODO
                /*this.nedsTeam.forEachAlive(( player ) => {
                    player.kill();
                }, null );
                this.moustakisTeam.forEachAlive(( player ) => {
                    player.kill();
                }, null );*/
                let victoryText = this.game.add.sprite( this.game.world.centerX, 100, nedsTeamWin && moustakisTeamWin && 'draw' || nedsTeamWin && 'neds-win' || 'moustakis-win' );
                var tween = this.game.add.tween( victoryText.scale ).to( { x: 1.4, y: 1.4 }, 1000, "Linear", true, 0, -1 );
                tween.yoyo( true );
                victoryText.anchor.setTo( 0.5, 0 );
                this.showMenu();
            }
        }
        return this.victory;
    }

    showMenu() {
        this.menu.alive = true;
        this.menu.visible = true;
    }

    render() {
    }
}
