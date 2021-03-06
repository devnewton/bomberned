/// <reference path="../../typings/phaser.d.ts"/>

import { GamepadUtils } from "./GamepadUtils";

export enum ControllerType {
	NONE = -2,
	CPU = -1,
	KEYBOARD_AND_MOUSE = 0,
	PAD1 = 1,
	PAD2 = 2,
	PAD3 = 3,
	PAD4 = 4
}

export class Controllers {
	controllers: Array<AbstractControls>;

	constructor(game: Phaser.Game) {
		game.input.gamepad.start();
		this.controllers = [
			new KeyboardAndMouseControls(game),
			new PadControls(game, 1),
			new PadControls(game, 2),
			new PadControls(game, 3),
			new PadControls(game, 4),
		];
	}

	getController(type: ControllerType): AbstractControls {
		switch (type) {
			case ControllerType.NONE:
				return null;
			case ControllerType.CPU:
				return new CPUControls();
			default:
				return this.controllers[type];
		}
	}

	getKeyboardAndMouse(): KeyboardAndMouseControls {
		return this.controllers[0] as KeyboardAndMouseControls;
	}

	getPad(padIndex: number): PadControls {
		return this.controllers[padIndex] as PadControls;
	}

	updatePadLayout() {
		for (let i = 1; i < 4; ++i) {
			(<PadControls>this.controllers[i]).updatePadLayout();
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
	abstract isShooting(): boolean;
	abstract aimingAngle(playerPos: Phaser.Point): number;
}

export class CPUControls extends AbstractControls {

	goingUp: boolean = false;
	goingDown: boolean = false;
	goingLeft: boolean = false;
	goingRight: boolean = false;
	droppingBomb: boolean = false;
	aimAngle: number = null;
	shooting: boolean = false;

	reset() {
		this.goingUp = false;
		this.goingDown = false;
		this.goingLeft = false;
		this.goingRight = false;
		this.droppingBomb = false;
		this.aimAngle = null;
		this.shooting = false;
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
	aimingAngle(playerPos: Phaser.Point): number {
		return this.aimAngle;
	}
	isShooting(): boolean {
		return this.shooting;
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
	menu?: number;
}

export class KeyboardAndMouseControls extends AbstractControls {
	kb: Phaser.Keyboard;
	game: Phaser.Game;
	keyCodeMoveUp: number;
	keyCodeMoveDown: number;
	keyCodeMoveLeft: number;
	keyCodeMoveRight: number;
	keyCodeMenu: number;
    bombMouseButton: string;
    shootMouseButton: string;

	constructor(game: Phaser.Game) {
		super();
		this.game = game;
		this.setupKeyboardLayout();
		this.setupMouseLayout();
	}
	
	setupMouseLayout() {
	    this.bombMouseButton = localStorage.getItem('bomberned.mouse.bomb') || 'LB';
	    this.shootMouseButton = localStorage.getItem('bomberned.mouse.shoot') || 'RB';
	}

	setupKeyboardLayout() {
		const layout = localStorage.getItem('bomberned.keyboard.layout');
		this.kb = this.game.input.keyboard;
		try {
			let mapping: KeyboardControlsMapping = JSON.parse(layout) || {};
			this.keyCodeMoveUp = mapping.moveUp || Phaser.KeyCode.UP;
			this.keyCodeMoveDown = mapping.moveDown || Phaser.KeyCode.DOWN;
			this.keyCodeMoveLeft = mapping.moveLeft || Phaser.KeyCode.LEFT;
			this.keyCodeMoveRight = mapping.moveRight || Phaser.KeyCode.RIGHT;
			this.keyCodeMenu = mapping.menu || Phaser.KeyCode.ESC;
			return;
		} catch (e) {
		}
		if (layout == 'azerty') {
			this.useAzertyLayout();
		} else if (layout == 'qwerty') {
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
		this.keyCodeMenu = Phaser.KeyCode.ESC;
	}

	private useQwertyLayout() {
		this.keyCodeMoveUp = Phaser.KeyCode.W;
		this.keyCodeMoveDown = Phaser.KeyCode.S;
		this.keyCodeMoveLeft = Phaser.KeyCode.A;
		this.keyCodeMoveRight = Phaser.KeyCode.D;
		this.keyCodeMenu = Phaser.KeyCode.ESC;
	}

	private useOtherKeyboardLayout() {
		this.keyCodeMoveUp = Phaser.KeyCode.UP;
		this.keyCodeMoveDown = Phaser.KeyCode.DOWN;
		this.keyCodeMoveLeft = Phaser.KeyCode.LEFT;
		this.keyCodeMoveRight = Phaser.KeyCode.RIGHT;
		this.keyCodeMenu = Phaser.KeyCode.ESC;
	}

	isShooting(): boolean {
		return this.isMouseButtonDown(this.shootMouseButton);
	}

	aimingAngle(playerPos: Phaser.Point): number {
		const pointer = this.game.input.activePointer;
		return Phaser.Math.angleBetween(playerPos.x, playerPos.y, pointer.worldX, pointer.worldY);
	}

	isGoingUp(): boolean {
		return this.kb && this.kb.isDown(this.keyCodeMoveUp);
	}
	isGoingDown(): boolean {
		return this.kb && this.kb.isDown(this.keyCodeMoveDown);
	}

	isGoingLeft(): boolean {
		return this.kb && this.kb.isDown(this.keyCodeMoveLeft);
	}

	isGoingRight(): boolean {
		return this.kb && this.kb.isDown(this.keyCodeMoveRight);
	}

	isDroppingBomb(): boolean {
	    return this.isMouseButtonDown(this.bombMouseButton);
	}

	isMenuAsked(): boolean {
		return this.kb && this.kb.isDown(this.keyCodeMenu);
	}
	
	private isMouseButtonDown(button: string): boolean {
	    switch(button) {
	    case 'LB':
	        return this.game.input.activePointer.leftButton.isDown;
        case 'RB':
            return this.game.input.activePointer.rightButton.isDown;
        default:
            return false;
	    }
	}

}

export interface PadControlsMapping {
	moveXAxis?: number;
	moveYAxis?: number;
	aimXAxis?: number;
	aimYAxis?: number;
	shootButton?: number;
	menuButton?: number;
	droppingBombButton?: number;
}

export class PadControls extends AbstractControls {
	padIndex: number;
	private pad: Phaser.SinglePad;
	private game: Phaser.Game;
	private moveXAxis: number;
	private moveYAxis: number;
	private aimXAxis: number;
	private aimYAxis: number;
	private shootButton: number;
	private menuButton: number;
	private droppingBombButton: number;

	constructor(game: Phaser.Game, padIndex: number) {
		super();
		this.game = game;
		this.padIndex = padIndex;
	}

	updatePadLayout() {
		this.pad = null;
	}

	private checkPad(): boolean {
		let pad = GamepadUtils.gamepadByIndex(this.game, this.padIndex);
		if (pad != null) {
			if (this.pad != pad) {
				this.pad = pad;
				let layout: PadControlsMapping = {};
				try {
					layout = JSON.parse(localStorage.getItem('bomberned.gamepad.' + GamepadUtils.gamepadId(this.pad) + '.layout')) || {};
				} catch (e) {
					layout = {};
				}
				this.moveXAxis = layout.moveXAxis || Phaser.Gamepad.XBOX360_STICK_LEFT_X;
				this.moveYAxis = layout.moveYAxis || Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
				this.aimXAxis = layout.aimXAxis || Phaser.Gamepad.XBOX360_STICK_RIGHT_X;
				this.aimYAxis = layout.aimYAxis || Phaser.Gamepad.XBOX360_STICK_RIGHT_Y;
				this.shootButton = layout.shootButton || Phaser.Gamepad.XBOX360_RIGHT_BUMPER;
				this.menuButton = layout.menuButton || Phaser.Gamepad.XBOX360_START;
				this.droppingBombButton = layout.droppingBombButton || Phaser.Gamepad.XBOX360_LEFT_BUMPER;
			}
			return true;
		} else {
			return false;
		}
	}

	isShooting(): boolean {
		return this.checkPad() && this.pad.isDown(this.shootButton);
	}

	aimingAngle(playerPos: Phaser.Point): number {
		return this.checkPad() && this.aimingAngleFromPad();
	}

	private aimingAngleFromPad(): number {
		let dx = this.pad.axis(this.aimXAxis);
		let dy = this.pad.axis(this.aimYAxis);
		dx = Math.abs(dx) <= this.pad.deadZone ? 0 : dx;
		dy = Math.abs(dy) <= this.pad.deadZone ? 0 : dy;
		if (dx != 0 || dy != 0) {
			return Phaser.Math.angleBetween(0, 0, dx, dy);
		} else {
			return null;
		}
	}

	isGoingUp(): boolean {
		return this.checkPad() && this.pad.axis(this.moveYAxis) < -this.pad.deadZone
			;
	}
	isGoingDown(): boolean {
		return this.checkPad() && this.pad.axis(this.moveYAxis) > this.pad.deadZone;
	}

	isGoingLeft(): boolean {
		return this.checkPad() && this.pad.axis(this.moveXAxis) < -this.pad.deadZone;
	}

	isGoingRight(): boolean {
		return this.checkPad() && this.pad.axis(this.moveXAxis) > this.pad.deadZone;
	}

	isDroppingBomb(): boolean {
		return this.checkPad() && this.pad.isDown(this.droppingBombButton);
	}

	isMenuAsked(): boolean {
		return this.checkPad() && this.pad.isDown(this.menuButton);
	}

}