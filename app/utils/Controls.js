"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GamepadUtils_1 = require("./GamepadUtils");
var ControllerType;
(function (ControllerType) {
    ControllerType[ControllerType["NONE"] = -2] = "NONE";
    ControllerType[ControllerType["CPU"] = -1] = "CPU";
    ControllerType[ControllerType["KEYBOARD"] = 0] = "KEYBOARD";
    ControllerType[ControllerType["PAD1"] = 1] = "PAD1";
    ControllerType[ControllerType["PAD2"] = 2] = "PAD2";
    ControllerType[ControllerType["PAD3"] = 3] = "PAD3";
    ControllerType[ControllerType["PAD4"] = 4] = "PAD4";
})(ControllerType = exports.ControllerType || (exports.ControllerType = {}));
class Controllers {
    constructor(game) {
        game.input.gamepad.start();
        this.controllers = [
            new KeyboardControls(game),
            new PadControls(game, 1),
            new PadControls(game, 2),
            new PadControls(game, 3),
            new PadControls(game, 4),
        ];
    }
    getController(type) {
        switch (type) {
            case ControllerType.NONE:
                return null;
            case ControllerType.CPU:
                return new CPUControls();
            default:
                return this.controllers[type];
        }
    }
    getKeyboard() {
        return this.controllers[0];
    }
    getPad(padIndex) {
        return this.controllers[padIndex];
    }
    updatePadLayout() {
        for (let i = 1; i < 4; ++i) {
            this.controllers[i].updatePadLayout();
        }
    }
}
exports.Controllers = Controllers;
class AbstractControls {
    readNumberFromLocalStorage(key, defaultValue) {
        let i = parseInt(localStorage.getItem(key));
        if (isNaN(i)) {
            return defaultValue;
        }
        else {
            return i;
        }
    }
}
exports.AbstractControls = AbstractControls;
class CPUControls extends AbstractControls {
    constructor() {
        super(...arguments);
        this.goingUp = false;
        this.goingDown = false;
        this.goingLeft = false;
        this.goingRight = false;
        this.droppingBomb = false;
        this.dashAngle = null;
    }
    reset() {
        this.goingUp = false;
        this.goingDown = false;
        this.goingLeft = false;
        this.goingRight = false;
        this.droppingBomb = false;
        this.dashAngle = null;
    }
    isGoingUp() {
        return this.goingUp;
    }
    isGoingDown() {
        return this.goingDown;
    }
    isGoingLeft() {
        return this.goingLeft;
    }
    isGoingRight() {
        return this.goingRight;
    }
    isDroppingBomb() {
        return this.droppingBomb;
    }
    dashingAngle(playerPos) {
        return this.dashAngle;
    }
    isMenuAsked() {
        return false;
    }
}
exports.CPUControls = CPUControls;
class KeyboardControls extends AbstractControls {
    constructor(game) {
        super();
        this.game = game;
        this.setupKeyboardLayout();
    }
    setupKeyboardLayout() {
        const layout = localStorage.getItem('keyboard.layout');
        this.kb = this.game.input.keyboard;
        try {
            let mapping = JSON.parse(layout) || {};
            this.keyCodeMoveUp = mapping.moveUp || Phaser.KeyCode.UP;
            this.keyCodeMoveDown = mapping.moveDown || Phaser.KeyCode.DOWN;
            this.keyCodeMoveLeft = mapping.moveLeft || Phaser.KeyCode.LEFT;
            this.keyCodeMoveRight = mapping.moveRight || Phaser.KeyCode.RIGHT;
            this.keyCodeDroppingBomb = mapping.droppingBomb || Phaser.KeyCode.SHIFT;
            this.keyCodeDash = mapping.dash || Phaser.KeyCode.CONTROL;
            this.keyCodeMenu = mapping.menu || Phaser.KeyCode.ESC;
            return;
        }
        catch (e) {
        }
        if (layout == 'azerty') {
            this.useAzertyLayout();
        }
        else if (layout == 'qwerty') {
            this.useQwertyLayout();
        }
        else {
            this.useOtherKeyboardLayout();
        }
    }
    useAzertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.Z;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.Q;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeDroppingBomb = Phaser.KeyCode.K;
        this.keyCodeDash = Phaser.KeyCode.J;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }
    useQwertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.W;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.A;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeDroppingBomb = Phaser.KeyCode.K;
        this.keyCodeDash = Phaser.KeyCode.J;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }
    useOtherKeyboardLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.UP;
        this.keyCodeMoveDown = Phaser.KeyCode.DOWN;
        this.keyCodeMoveLeft = Phaser.KeyCode.LEFT;
        this.keyCodeMoveRight = Phaser.KeyCode.RIGHT;
        this.keyCodeDroppingBomb = Phaser.KeyCode.SHIFT;
        this.keyCodeDash = Phaser.KeyCode.CONTROL;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }
    dashingAngle(playerPos) {
        if (this.kb && this.kb.isDown(this.keyCodeDash)) {
            return this.lookingAngle();
        }
    }
    lookingAngle() {
        let dx = 0;
        if (this.kb.isDown(this.keyCodeMoveLeft)) {
            dx = -1;
        }
        else if (this.kb.isDown(this.keyCodeMoveRight)) {
            dx = 1;
        }
        let dy = 0;
        if (this.kb.isDown(this.keyCodeMoveUp)) {
            dy = -1;
        }
        else if (this.kb.isDown(this.keyCodeMoveDown)) {
            dy = 1;
        }
        if (dx != 0 || dy != 0) {
            return Phaser.Math.angleBetween(0, 0, dx, dy);
        }
        else {
            return null;
        }
    }
    isGoingUp() {
        return this.kb && this.kb.isDown(this.keyCodeMoveUp);
    }
    isGoingDown() {
        return this.kb && this.kb.isDown(this.keyCodeMoveDown);
    }
    isGoingLeft() {
        return this.kb && this.kb.isDown(this.keyCodeMoveLeft);
    }
    isGoingRight() {
        return this.kb && this.kb.isDown(this.keyCodeMoveRight);
    }
    isDroppingBomb() {
        return this.kb && this.kb.isDown(this.keyCodeDroppingBomb);
    }
    isMenuAsked() {
        return this.kb && this.kb.isDown(this.keyCodeMenu);
    }
}
exports.KeyboardControls = KeyboardControls;
class PadControls extends AbstractControls {
    constructor(game, padIndex) {
        super();
        this.game = game;
        this.padIndex = padIndex;
    }
    updatePadLayout() {
        this.pad = null;
    }
    checkPad() {
        let pad = GamepadUtils_1.GamepadUtils.gamepadByIndex(this.game, this.padIndex);
        if (pad != null) {
            if (this.pad != pad) {
                this.pad = pad;
                let layout = {};
                try {
                    layout = JSON.parse(localStorage.getItem('gamepad.' + GamepadUtils_1.GamepadUtils.gamepadId(this.pad) + '.layout')) || {};
                }
                catch (e) {
                    layout = {};
                }
                this.moveXAxis = layout.moveXAxis || Phaser.Gamepad.XBOX360_STICK_LEFT_X;
                this.moveYAxis = layout.moveYAxis || Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
                this.dashButton = layout.dashButton || Phaser.Gamepad.XBOX360_X;
                this.menuButton = layout.menuButton || Phaser.Gamepad.XBOX360_START;
                this.hammerTimeButton = layout.droppingBombButton || Phaser.Gamepad.XBOX360_A;
            }
            return true;
        }
        else {
            return false;
        }
    }
    dashingAngle(playerPos) {
        if (this.checkPad() && this.pad.isDown(this.dashButton)) {
            return this.lookingAngle();
        }
    }
    lookingAngle() {
        let dx = this.pad.axis(this.moveXAxis);
        let dy = this.pad.axis(this.moveYAxis);
        dx = Math.abs(dx) <= this.pad.deadZone ? 0 : dx;
        dy = Math.abs(dy) <= this.pad.deadZone ? 0 : dy;
        if (dx != 0 || dy != 0) {
            return Phaser.Math.angleBetween(0, 0, dx, dy);
        }
        else {
            return null;
        }
    }
    isGoingUp() {
        return this.checkPad() && this.pad.axis(this.moveYAxis) < -this.pad.deadZone;
    }
    isGoingDown() {
        return this.checkPad() && this.pad.axis(this.moveYAxis) > this.pad.deadZone;
    }
    isGoingLeft() {
        return this.checkPad() && this.pad.axis(this.moveXAxis) < -this.pad.deadZone;
    }
    isGoingRight() {
        return this.checkPad() && this.pad.axis(this.moveXAxis) > this.pad.deadZone;
    }
    isDroppingBomb() {
        return this.checkPad() && this.pad.isDown(this.hammerTimeButton);
    }
    isMenuAsked() {
        return this.checkPad() && this.pad.isDown(this.menuButton);
    }
}
exports.PadControls = PadControls;
//# sourceMappingURL=Controls.js.map