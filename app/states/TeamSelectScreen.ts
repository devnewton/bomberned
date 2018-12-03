/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { LevelConfig } from "./Level";
import { Menu } from "../ui/Menu";
import { MenuSelect, MenuSelectOption } from "../ui/MenuSelect";
import { BombernedGame } from "../BombernedGame";
import { ControllerType } from "../utils/Controls";

export class TeamSelectScreen extends AbstractState {

    nedSelect: MenuSelect<ControllerType>;
    ned2Select: MenuSelect<ControllerType>;
    moustakiSelect: MenuSelect<ControllerType>;
    moustaki2Select: MenuSelect<ControllerType>;

    constructor() {
        super();
    }

    preload() {
        Menu.preload( this.game );
        this.game.load.atlasXML( 'ned', 'sprites/devnewton/ned.png', 'sprites/devnewton/player.xml' );
        this.game.load.atlasXML( 'ned2', 'sprites/devnewton/ned2.png', 'sprites/devnewton/player.xml' );
        this.game.load.atlasXML( 'moustaki', 'sprites/devnewton/moustaki.png', 'sprites/devnewton/player.xml' );
        this.game.load.atlasXML( 'moustaki2', 'sprites/devnewton/moustaki2.png', 'sprites/devnewton/player.xml' );

    }

    create() {
        super.create();
        let logo = this.game.add.text( this.game.world.centerX, 0, 'Team selection', { font: "64px monospace", fill: 'white' } );
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo( 0.5, 0 );

        let ned = this.add.sprite( 150, 175, 'ned', 0 );
        ( <BombernedGame>this.game ).addSpriteAnimation( ned, 'player.wait', 1 );
        ned.play( 'player.wait', 8, true );

        let ned2 = this.add.sprite( 150, 275, 'ned2', 0 );
        ( <BombernedGame>this.game ).addSpriteAnimation( ned2, 'player.wait', 1 );
        ned2.play( 'player.wait', 8, true );

        let moustaki = this.add.sprite( 1060, 375, 'moustaki', 0 );
        ( <BombernedGame>this.game ).addSpriteAnimation( moustaki, 'player.wait', 1 );
        moustaki.play( 'player.wait', 8, true );

        let moustaki2 = this.add.sprite( 1060, 475, 'moustaki2', 0 );
        ( <BombernedGame>this.game ).addSpriteAnimation( moustaki2, 'player.wait', 1 );
        moustaki2.play( 'player.wait', 8, true );

        const menu = new Menu( this.game );

        let playerOptions = [
            new MenuSelectOption<ControllerType>( ControllerType.NONE, 'None' ),
            new MenuSelectOption<ControllerType>( ControllerType.CPU, 'CPU' ),
            new MenuSelectOption<ControllerType>( ControllerType.KEYBOARD, 'Keyboard' ),
            new MenuSelectOption<ControllerType>( ControllerType.PAD1, 'Pad 1' ),
            new MenuSelectOption<ControllerType>( ControllerType.PAD2, 'Pad 2' ),
            new MenuSelectOption<ControllerType>( ControllerType.PAD3, 'Pad 3' ),
            new MenuSelectOption<ControllerType>( ControllerType.PAD4, 'Pad 4' )
        ];

        this.nedSelect = menu.select( 200, 150, playerOptions );
        this.ned2Select = menu.select( 200, 250, playerOptions );
        this.moustakiSelect = menu.select( 200, 350, playerOptions );
        this.moustaki2Select = menu.select( 200, 450, playerOptions );

        this.autoSelect();
        menu.button( "Play", 200, 600, () => {
            let config = new LevelConfig();
            config.nedController = this.nedSelect.getSelectedValue();
            config.ned2Controller = this.ned2Select.getSelectedValue();
            config.moustakiController = this.moustakiSelect.getSelectedValue();
            config.moustaki2Controller = this.moustaki2Select.getSelectedValue();
            this.game.state.start( 'Level', true, false, config )
        } );

        this.input.gamepad.onConnectCallback = this.input.gamepad.onDisconnectCallback = () => this.autoSelect();
    }

    shutdown() {
        this.input.gamepad.onConnectCallback = this.input.gamepad.onDisconnectCallback = null;
    }

    autoSelect() {
        switch ( this.input.gamepad.padsConnected ) {
            case 0:
                this.nedSelect.setSelectedValue( ControllerType.KEYBOARD );
                this.ned2Select.setSelectedValue( ControllerType.CPU );
                this.moustakiSelect.setSelectedValue( ControllerType.CPU );
                this.moustaki2Select.setSelectedValue( ControllerType.CPU );
                break;
            case 1:
                this.nedSelect.setSelectedValue( ControllerType.PAD1 );
                this.ned2Select.setSelectedValue( ControllerType.CPU );
                this.moustakiSelect.setSelectedValue( ControllerType.CPU );
                this.moustaki2Select.setSelectedValue( ControllerType.CPU );
                break;
            case 2:
                this.nedSelect.setSelectedValue( ControllerType.PAD1 );
                this.ned2Select.setSelectedValue( ControllerType.CPU );
                this.moustakiSelect.setSelectedValue( ControllerType.PAD2 );
                this.moustaki2Select.setSelectedValue( ControllerType.CPU );
                break;
            case 3:
                this.nedSelect.setSelectedValue( ControllerType.PAD1 );
                this.ned2Select.setSelectedValue( ControllerType.PAD2 );
                this.moustakiSelect.setSelectedValue( ControllerType.PAD3 );
                this.moustaki2Select.setSelectedValue( ControllerType.CPU );
                break;
            default:
                this.nedSelect.setSelectedValue( ControllerType.PAD1 );
                this.ned2Select.setSelectedValue( ControllerType.PAD2 );
                this.moustakiSelect.setSelectedValue( ControllerType.PAD3 );
                this.moustaki2Select.setSelectedValue( ControllerType.PAD4 );
                break;
        }
    }
}
