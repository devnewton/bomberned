"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
const MenuMiniButton_1 = require("../ui/MenuMiniButton");
const GamepadUtils_1 = require("../utils/GamepadUtils");
class GamepadOptionsBindAxisOrButton extends AbstractState_1.AbstractState {
    constructor() {
        super();
        this.bindingsDescription = [
            { label: 'Pull move X axis', localStorageKey: 'moveXAxis' },
            { label: 'Pull move Y axis', localStorageKey: 'moveYAxis' },
            { label: 'Press drop bomb button', localStorageKey: 'droppingBombButton' },
            { label: 'Press dash button', localStorageKey: 'dashButton' },
            { label: 'Press menu button', localStorageKey: 'menuButton' }
        ];
        this.currentBinding = 0;
        this.padIndex = 1;
        this.bindings = {};
    }
    preload() {
        Menu_1.Menu.preload(this.game);
        MenuMiniButton_1.MenuMiniButton.preload(this.game);
    }
    init(padIndex, binding = 0, bindings) {
        this.bindings = bindings || {};
        this.pad = GamepadUtils_1.GamepadUtils.gamepadByIndex(this.game, padIndex);
        if (binding >= this.bindingsDescription.length) {
            this.currentBinding = 0;
            localStorage.setItem('gamepad.' + GamepadUtils_1.GamepadUtils.gamepadId(this.pad) + '.layout', JSON.stringify(this.bindings));
            this.game.controllers.updatePadLayout();
            this.game.state.start('GamepadOptions');
        }
        else {
            this.currentBinding = binding;
        }
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindingsDescription[this.currentBinding].label, { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        const menu = new Menu_1.Menu(this.game).disableGamepadCursor();
        menu.button("Back", 200, 600, () => this.game.state.start('GamepadOptions'));
        this.createAxisButtons();
        this.createButtonsButtons();
    }
    createAxisButtons() {
        this.axisButtons = this.game.add.group();
        this.axisButtons.visible = false;
        const nbButtonsPerColumn = Math.ceil(Math.sqrt(GamepadUtils_1.GamepadUtils.NB_AXIS));
        for (let y = 0, axisCode = 0; axisCode < GamepadUtils_1.GamepadUtils.NB_AXIS; ++y) {
            for (let x = 0; x < nbButtonsPerColumn; ++x) {
                const buttonAxisCode = axisCode++;
                let miniButton = new AxisButton(this.game, this.pad, buttonAxisCode, 250 + x * 200, 100 + y * 120, () => this.bindAxis(buttonAxisCode));
                this.axisButtons.add(miniButton);
            }
        }
    }
    createButtonsButtons() {
        this.buttonsButtons = this.game.add.group();
        this.buttonsButtons.visible = false;
        const nbButtonsPerColumn = Math.ceil(Math.sqrt(GamepadUtils_1.GamepadUtils.NB_BUTTONS));
        for (let y = 0, buttonCode = 0; buttonCode < GamepadUtils_1.GamepadUtils.NB_BUTTONS; ++y) {
            for (let x = 0; x < nbButtonsPerColumn; ++x) {
                const buttonButtonCode = buttonCode++;
                let miniButton = new ButtonButton(this.game, this.pad, buttonButtonCode, 250 + x * 200, 100 + y * 120, () => this.bindButton(buttonButtonCode));
                this.buttonsButtons.add(miniButton);
            }
        }
    }
    update() {
        super.update();
        if (this.bindingsDescription[this.currentBinding].localStorageKey.match(/axis/gi)) {
            this.axisButtons.visible = true;
            this.buttonsButtons.visible = false;
        }
        else {
            this.axisButtons.visible = false;
            this.buttonsButtons.visible = true;
        }
    }
    bindAxis(axisCode) {
        this.bindings[this.bindingsDescription[this.currentBinding].localStorageKey] = axisCode;
        this.game.state.start('GamepadOptionsBindAxisOrButton', true, false, this.padIndex, this.currentBinding + 1, this.bindings);
    }
    bindButton(buttonCode) {
        this.bindings[this.bindingsDescription[this.currentBinding].localStorageKey] = buttonCode;
        this.game.state.start('GamepadOptionsBindAxisOrButton', true, false, this.padIndex, this.currentBinding + 1, this.bindings);
    }
}
exports.GamepadOptionsBindAxisOrButton = GamepadOptionsBindAxisOrButton;
class AxisButton extends MenuMiniButton_1.MenuMiniButton {
    constructor(game, pad, axisCode, x, y, callback) {
        super(game, axisCode.toString(), x, y, callback);
        this.pad = pad;
        this.axisCode = axisCode;
    }
    update() {
        super.update();
        if (Math.abs(this.pad.axis(this.axisCode)) > this.pad.deadZone) {
            this.labelText.tint = GamepadUtils_1.GamepadUtils.gamepadColor(this.pad);
        }
        else {
            this.labelText.tint = 0xFFFFFF;
        }
    }
}
class ButtonButton extends MenuMiniButton_1.MenuMiniButton {
    constructor(game, pad, buttonCode, x, y, callback) {
        super(game, buttonCode.toString(), x, y, callback);
        this.pad = pad;
        this.buttonCode = buttonCode;
    }
    update() {
        super.update();
        if (this.pad.isDown(this.buttonCode)) {
            this.labelText.tint = GamepadUtils_1.GamepadUtils.gamepadColor(this.pad);
        }
        else {
            this.labelText.tint = 0xFFFFFF;
        }
    }
}
//# sourceMappingURL=GamepadOptionsBindAxisOrButton.js.map