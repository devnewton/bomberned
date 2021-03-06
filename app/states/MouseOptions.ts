/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {Menu} from "../ui/Menu";
import { BombernedGame } from "../BombernedGame";

export class MouseOptions extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        Menu.preload(this.game);
    }

    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Choose mouse layout',{font: "42px monospace", fill: 'white'});
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);

        const menu = new Menu(this.game).disableKeyboardCursor();
        menu.button("Bomb LB, shoot RB", 200, 100, () => {
            localStorage.setItem('bomberned.mouse.bomb', 'LB');
            localStorage.setItem('bomberned.mouse.shoot', 'RB');
            (this.game as BombernedGame).controllers.getKeyboardAndMouse().setupMouseLayout();
            this.game.state.start('Options');
        });
        menu.button("Bomb RB, shoot LB", 200, 200, () => {
            localStorage.setItem('bomberned.mouse.bomb', 'RB');
            localStorage.setItem('bomberned.mouse.shoot', 'LB');
            (this.game as BombernedGame).controllers.getKeyboardAndMouse().setupMouseLayout();
            this.game.state.start('Options');
        });
        menu.button("Back", 200, 600, () => this.game.state.start('Options'));
    }
}
