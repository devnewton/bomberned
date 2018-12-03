/// <reference path="../../typings/phaser.d.ts"/>
export class GamepadUtils {
    static NB_BUTTONS = 16;
    static NB_AXIS = 10;

    static gamepadColor(pad: Phaser.SinglePad): number {
        let gamepad = pad.game.input.gamepad;
        if (pad == gamepad.pad4) {
            return 0xFFFF00;
        } else if (pad == gamepad.pad3) {
            return 0x0000FF;
        } else if (pad == gamepad.pad2) {
            return 0x00FF00;
        } else {
            return 0xFF0000;
        }
    }
    static gamepadId(pad: Phaser.SinglePad): string {
        let anyPad = <any>pad;
        if (anyPad._rawPad) {
            return anyPad._rawPad.id;
        } else {
            return null;
        }
    }

    static gamepadByIndex(game: Phaser.Game, padIndex : number): Phaser.SinglePad {
        return game.input.gamepad['pad' + padIndex];
    }
}