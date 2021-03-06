/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {Menu} from "../ui/Menu";
import { BombernedGame } from "../BombernedGame";

export class KeyboardOptions extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        Menu.preload(this.game);
    }

    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Choose keyboard layout',{font: "42px monospace", fill: 'white'});
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);

        const menu = new Menu(this.game).disableKeyboardCursor();
        menu.button("Azerty zsqd", 200, 100, () => {
            localStorage.setItem('bomberned.keyboard.layout', 'azerty');
            (this.game as BombernedGame).controllers.getKeyboardAndMouse().setupKeyboardLayout();
            this.game.state.start('MouseOptions');
        });
        menu.button("Qwerty wsad", 200, 200, () => {
            localStorage.setItem('bomberned.keyboard.layout', 'qwerty');
            (this.game as BombernedGame).controllers.getKeyboardAndMouse().setupKeyboardLayout();
            this.game.state.start('MouseOptions');
        });
        menu.button("⬆⬇⬅➡", 200, 300, () => {
            localStorage.setItem('bomberned.keyboard.layout', 'other');
            (this.game as BombernedGame).controllers.getKeyboardAndMouse().setupKeyboardLayout();
            this.game.state.start('MouseOptions');
        });
        menu.button("Custom", 200, 400, () => {
            this.game.state.start('KeyboardOptionsBindKey', true, false);
        });
        menu.button("Back", 200, 600, () => this.game.state.start('Options'));
    }
}
