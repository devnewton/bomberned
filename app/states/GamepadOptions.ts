/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {Menu} from "../ui/Menu";
import {MenuButton} from "../ui/MenuButton";
import {GamepadUtils} from "../utils/GamepadUtils";


export class GamepadOptions extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        Menu.preload(this.game);
    }

    create() {
        super.create();
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad', { font: "42px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);

        let subtitle = this.game.add.text(0, 0, 'Move stick or press button to show gamepad number', { font: "32px monospace", fill: 'white' });
        subtitle.y = this.game.world.height - subtitle.height;

        const menu = new Menu(this.game).disableGamepadCursor();
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad1, "Gamepad 1", 200, 100, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 1);
        }));
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad2, "Gamepad 2", 200, 200, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 2);
        }));
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad3, "Gamepad 3", 200, 300, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 3);
        }));
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad4, "Gamepad 4", 200, 400, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 4);
        }));
        menu.button("Back", 200, 550, () => this.game.state.start('Options'));
    }
}

class GamepadMenuButton extends MenuButton {
    pad: Phaser.SinglePad;
    constructor(pad: Phaser.SinglePad, label: string, x: number, y: number, callback: Function) {
        super(pad.game, label, x, y, callback);
        this.pad = pad;
    }

    update() {
        super.update();

        if (this.isPadActive()) {
            this.labelText.tint = GamepadUtils.gamepadColor(this.pad);
        } else {
            this.labelText.tint = 0xFFFFFF;
        }
    }

    isPadActive(): boolean {
        for (let b = 0; b < 16; ++b) {
            let button = this.pad.getButton(b);
            if (button && button.isDown) {
                return true;
            }
        }
        for (let a = 0; a < 16; ++a) {
            if (Math.abs(this.pad.axis(a)) > this.pad.deadZone) {
                return true;
            }
        }
        return false;
    }

}
