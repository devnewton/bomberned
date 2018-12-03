/// <reference path="../../typings/phaser.d.ts"/>

import { GamepadUtils } from "./GamepadUtils";

export enum ControllerType {
    NONE = -2,
    CPU = -1,
    KEYBOARD = 0,
    PAD1 = 1,
    PAD2 = 2,
    PAD3 = 3,
    PAD4 = 4
}

export class Controllers {
    controllers: Array<AbstractControls>;

    constructor( game: Phaser.Game ) {
        game.input.gamepad.start();
        this.controllers = [
            new KeyboardControls( game ),
            new PadControls( game, 1 ),
            new PadControls( game, 2 ),
            new PadControls( game, 3 ),
            new PadControls( game, 4 ),
        ];
    }

    getController( type: ControllerType ): AbstractControls {
        switch ( type ) {
            case ControllerType.NONE:
                return null;
            case ControllerType.CPU:
                return new CPUControls();
            default:
                return this.controllers[type];
        }
    }

    getKeyboard(): KeyboardControls {
        return this.controllers[0] as KeyboardControls;
    }

    getPad( padIndex: number ): PadControls {
        return this.controllers[padIndex] as PadControls;
    }

    updatePadLayout() {
        for ( let i = 1; i < 4; ++i ) {
            ( <PadControls>this.controllers[i] ).updatePadLayout();
        }
    }
}

export abstract class AbstractControls {

    abstract isGoingUp(): boolean;
    abstract isGoingDown(): boolean;
    abstract isGoingLeft(): boolean;
    abstract isGoingRight(): boolean;
    abstract isDroppingBomb(): boolean;
    abstract isMenuAsked(): boolean;
    abstract dashingAngle( playerPos: Phaser.Point ): number;

    protected readNumberFromLocalStorage( key: string, defaultValue: number ) {
        let i = parseInt( localStorage.getItem( key ) );
        if ( isNaN( i ) ) {
            return defaultValue;
        } else {
            return i;
        }
    }
}

export class CPUControls extends AbstractControls {

    goingUp: boolean = false;
    goingDown: boolean = false;
    goingLeft: boolean = false;
    goingRight: boolean = false;
    droppingBomb: boolean = false;
    dashAngle: number = null;

    reset() {
        this.goingUp = false;
        this.goingDown = false;
        this.goingLeft = false;
        this.goingRight = false;
        this.droppingBomb = false;
        this.dashAngle = null;
    }

    isGoingUp(): boolean {
        return this.goingUp;
    }
    isGoingDown(): boolean {
        return this.goingDown;
    }
    isGoingLeft(): boolean {
        return this.goingLeft;
    }
    isGoingRight(): boolean {
        return this.goingRight;
    }
    isDroppingBomb(): boolean {
        return this.droppingBomb;
    }
    dashingAngle( playerPos: Phaser.Point ): number {
        return this.dashAngle;
    }
    isMenuAsked(): boolean {
        return false;
    }
}

export interface KeyboardControlsMapping {
    moveUp?: number;
    moveDown?: number;
    moveLeft?: number;
    moveRight?: number;
    droppingBomb?: number;
    dash?: number;
    menu?: number;
}

export class KeyboardControls extends AbstractControls {
    kb: Phaser.Keyboard;
    game: Phaser.Game;
    keyCodeMoveUp: number;
    keyCodeMoveDown: number;
    keyCodeMoveLeft: number;
    keyCodeMoveRight: number;
    keyCodeDroppingBomb: number;
    keyCodeDash: number;
    keyCodeMenu: number;

    constructor( game: Phaser.Game ) {
        super();
        this.game = game;
        this.setupKeyboardLayout();
    }

    setupKeyboardLayout() {
        const layout = localStorage.getItem( 'keyboard.layout' );
        this.kb = this.game.input.keyboard;
        try {
            let mapping: KeyboardControlsMapping = JSON.parse( layout ) || {};
            this.keyCodeMoveUp = mapping.moveUp || Phaser.KeyCode.UP;
            this.keyCodeMoveDown = mapping.moveDown || Phaser.KeyCode.DOWN;
            this.keyCodeMoveLeft = mapping.moveLeft || Phaser.KeyCode.LEFT;
            this.keyCodeMoveRight = mapping.moveRight || Phaser.KeyCode.RIGHT;
            this.keyCodeDroppingBomb = mapping.droppingBomb || Phaser.KeyCode.SHIFT;
            this.keyCodeDash = mapping.dash || Phaser.KeyCode.CONTROL;
            this.keyCodeMenu = mapping.menu || Phaser.KeyCode.ESC;
            return;
        } catch ( e ) {
        }
        if ( layout == 'azerty' ) {
            this.useAzertyLayout();
        } else if ( layout == 'qwerty' ) {
            this.useQwertyLayout();
        } else {
            this.useOtherKeyboardLayout();
        }
    }

    private useAzertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.Z;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.Q;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeDroppingBomb = Phaser.KeyCode.K;
        this.keyCodeDash = Phaser.KeyCode.J;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }

    private useQwertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.W;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.A;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeDroppingBomb = Phaser.KeyCode.K;
        this.keyCodeDash = Phaser.KeyCode.J;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }

    private useOtherKeyboardLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.UP;
        this.keyCodeMoveDown = Phaser.KeyCode.DOWN;
        this.keyCodeMoveLeft = Phaser.KeyCode.LEFT;
        this.keyCodeMoveRight = Phaser.KeyCode.RIGHT;
        this.keyCodeDroppingBomb = Phaser.KeyCode.SHIFT;
        this.keyCodeDash = Phaser.KeyCode.CONTROL;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }

    dashingAngle( playerPos: Phaser.Point ): number {
        if ( this.kb && this.kb.isDown( this.keyCodeDash ) ) {
            return this.lookingAngle();
        }
    }

    lookingAngle(): number {
        let dx = 0;
        if ( this.kb.isDown( this.keyCodeMoveLeft ) ) {
            dx = -1;
        } else if ( this.kb.isDown( this.keyCodeMoveRight ) ) {
            dx = 1;
        }
        let dy = 0;
        if ( this.kb.isDown( this.keyCodeMoveUp ) ) {
            dy = -1;
        } else if ( this.kb.isDown( this.keyCodeMoveDown ) ) {
            dy = 1;
        }
        if ( dx != 0 || dy != 0 ) {
            return Phaser.Math.angleBetween( 0, 0, dx, dy );
        } else {
            return null;
        }
    }
    isGoingUp(): boolean {
        return this.kb && this.kb.isDown( this.keyCodeMoveUp );
    }
    isGoingDown(): boolean {
        return this.kb && this.kb.isDown( this.keyCodeMoveDown );
    }

    isGoingLeft(): boolean {
        return this.kb && this.kb.isDown( this.keyCodeMoveLeft );
    }

    isGoingRight(): boolean {
        return this.kb && this.kb.isDown( this.keyCodeMoveRight );
    }

    isDroppingBomb(): boolean {
        return this.kb && this.kb.isDown( this.keyCodeDroppingBomb );
    }

    isMenuAsked(): boolean {
        return this.kb && this.kb.isDown( this.keyCodeMenu );
    }

}

export interface PadControlsMapping {
    moveXAxis?: number;
    moveYAxis?: number;
    dashButton?: number;
    menuButton?: number;
    droppingBombButton?: number;
}

export class PadControls extends AbstractControls {
    padIndex: number;
    private pad: Phaser.SinglePad;
    private game: Phaser.Game;
    private moveXAxis: number;
    private moveYAxis: number;
    private dashButton: number;
    private menuButton: number;
    private hammerTimeButton: number;

    constructor( game: Phaser.Game, padIndex: number ) {
        super();
        this.game = game;
        this.padIndex = padIndex;
    }

    updatePadLayout() {
        this.pad = null;
    }

    private checkPad(): boolean {
        let pad = GamepadUtils.gamepadByIndex( this.game, this.padIndex );
        if ( pad != null ) {
            if ( this.pad != pad ) {
                this.pad = pad;
                let layout: PadControlsMapping = {};
                try {
                    layout = JSON.parse( localStorage.getItem( 'gamepad.' + GamepadUtils.gamepadId( this.pad ) + '.layout' ) ) || {};
                } catch ( e ) {
                    layout = {};
                }
                this.moveXAxis = layout.moveXAxis || Phaser.Gamepad.XBOX360_STICK_LEFT_X;
                this.moveYAxis = layout.moveYAxis || Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
                this.dashButton = layout.dashButton || Phaser.Gamepad.XBOX360_X;
                this.menuButton = layout.menuButton || Phaser.Gamepad.XBOX360_START;
                this.hammerTimeButton = layout.droppingBombButton || Phaser.Gamepad.XBOX360_A;
            }
            return true;
        } else {
            return false;
        }
    }

    dashingAngle( playerPos: Phaser.Point ): number {
        if ( this.checkPad() && this.pad.isDown( this.dashButton ) ) {
            return this.lookingAngle();
        }
    }

    private lookingAngle(): number {
        let dx = this.pad.axis( this.moveXAxis );
        let dy = this.pad.axis( this.moveYAxis );
        dx = Math.abs( dx ) <= this.pad.deadZone ? 0 : dx;
        dy = Math.abs( dy ) <= this.pad.deadZone ? 0 : dy;
        if ( dx != 0 || dy != 0 ) {
            return Phaser.Math.angleBetween( 0, 0, dx, dy );
        } else {
            return null;
        }
    }

    isGoingUp(): boolean {
        return this.checkPad() && this.pad.axis( this.moveYAxis ) < -this.pad.deadZone
            ;
    }
    isGoingDown(): boolean {
        return this.checkPad() && this.pad.axis( this.moveYAxis ) > this.pad.deadZone;
    }

    isGoingLeft(): boolean {
        return this.checkPad() && this.pad.axis( this.moveXAxis ) < -this.pad.deadZone;
    }

    isGoingRight(): boolean {
        return this.checkPad() && this.pad.axis( this.moveXAxis ) > this.pad.deadZone;
    }

    isDroppingBomb(): boolean {
        return this.checkPad() && this.pad.isDown( this.hammerTimeButton );
    }

    isMenuAsked(): boolean {
        return this.checkPad() && this.pad.isDown( this.menuButton );
    }

}