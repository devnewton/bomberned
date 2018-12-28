/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { Menu } from "../ui/Menu";
import { MenuMiniButton } from "../ui/MenuMiniButton";
import { BombernedGame } from "../BombernedGame";
import { GamepadUtils } from "../utils/GamepadUtils";

export class GamepadOptionsBindAxisOrButton extends AbstractState {

    bindingsDescription = [
        { label: 'Pull move X axis', localStorageKey: 'moveXAxis' },
        { label: 'Pull move Y axis', localStorageKey: 'moveYAxis' },
        { label: 'Press drop bomb button', localStorageKey: 'droppingBombButton' },
        { label: 'Pull aim X axis', localStorageKey: 'aimXAxis' },
        { label: 'Pull aim Y axis', localStorageKey: 'aimYAxis' },
        { label: 'Press shoot button', localStorageKey: 'shootButton' },
        { label: 'Press menu button', localStorageKey: 'menuButton' }
    ];

    currentBinding: number = 0;
    pad: Phaser.SinglePad;
    padIndex = 1;
    axisButtons: Phaser.Group;
    buttonsButtons: Phaser.Group;
    bindings = {};

    constructor() {
        super();
    }

    preload() {
        Menu.preload(this.game);
        MenuMiniButton.preload(this.game);
    }

    init(padIndex: number, binding: number = 0, bindings: any) {
        this.bindings = bindings || {};
        this.pad = GamepadUtils.gamepadByIndex(this.game, padIndex);
        if (binding >= this.bindingsDescription.length) {
            this.currentBinding = 0;
            localStorage.setItem('bomberned.gamepad.' + GamepadUtils.gamepadId(this.pad) + '.layout', JSON.stringify(this.bindings));
            (this.game as BombernedGame).controllers.updatePadLayout();
            this.game.state.start('GamepadOptions');
        } else {
            this.currentBinding = binding;
        }
    }

    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindingsDescription[this.currentBinding].label, { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        const menu = new Menu(this.game).disableGamepadCursor();
        menu.button("Back", 200, 600, () => this.game.state.start('GamepadOptions'));
        this.createAxisButtons();
        this.createButtonsButtons();

    }

    createAxisButtons() {
        this.axisButtons = this.game.add.group();
        this.axisButtons.visible = false;
        const nbButtonsPerColumn = Math.ceil(Math.sqrt(GamepadUtils.NB_AXIS));
        for (let y = 0, axisCode =0; axisCode< GamepadUtils.NB_AXIS; ++y) {
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
        const nbButtonsPerColumn = Math.ceil(Math.sqrt(GamepadUtils.NB_BUTTONS));
        for (let y = 0, buttonCode =0; buttonCode< GamepadUtils.NB_BUTTONS; ++y) {
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
        } else {
            this.axisButtons.visible = false;
            this.buttonsButtons.visible = true;
        }
    }

    bindAxis(axisCode: number) {
        this.bindings[this.bindingsDescription[this.currentBinding].localStorageKey] = axisCode;
        this.game.state.start('GamepadOptionsBindAxisOrButton', true, false, this.padIndex, this.currentBinding + 1, this.bindings);
    }

    bindButton(buttonCode: number) {
        this.bindings[this.bindingsDescription[this.currentBinding].localStorageKey] = buttonCode;
        this.game.state.start('GamepadOptionsBindAxisOrButton', true, false, this.padIndex, this.currentBinding + 1, this.bindings);
    }
}

class AxisButton extends MenuMiniButton {
    pad: Phaser.SinglePad;
    axisCode: number;
    constructor(game: Phaser.Game, pad: Phaser.SinglePad, axisCode: number, x: number, y: number, callback: Function) {
        super(game, axisCode.toString(), x, y, callback);
        this.pad = pad;
        this.axisCode = axisCode;
    }
    update() {
        super.update();

        if (Math.abs(this.pad.axis(this.axisCode)) > this.pad.deadZone) {
            this.labelText.tint = GamepadUtils.gamepadColor(this.pad);
        } else {
            this.labelText.tint = 0xFFFFFF;
        }
    }

}

class ButtonButton extends MenuMiniButton {
    pad: Phaser.SinglePad;
    buttonCode: number;
    constructor(game: Phaser.Game, pad: Phaser.SinglePad, buttonCode: number, x: number, y: number, callback: Function) {
        super(game, buttonCode.toString(), x, y, callback);
        this.pad = pad;
        this.buttonCode = buttonCode;
    }
    update() {
        super.update();

        if (this.pad.isDown(this.buttonCode)) {
            this.labelText.tint = GamepadUtils.gamepadColor(this.pad);
        } else {
            this.labelText.tint = 0xFFFFFF;
        }
    }

}