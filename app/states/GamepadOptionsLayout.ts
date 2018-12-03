/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {Menu} from "../ui/Menu";
import {BombernedGame} from "../BombernedGame";
import {GamepadUtils} from '../utils/GamepadUtils';

export class GamepadOptionsLayout extends AbstractState {
    padIndex: number;

    constructor() {
        super();
    }

    preload() {
        Menu.preload(this.game);
    }

    init(padIndex : number) {
        this.padIndex = padIndex || 1;
    }

    create() {
        super.create();
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad layout', { font: "42px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);

        const menu = new Menu(this.game).disableGamepadCursor();
        menu.button("Xbox", 200, 200, () => {
            localStorage.setItem('gamepad.' + GamepadUtils.gamepadId(GamepadUtils.gamepadByIndex(this.game, this.padIndex)) + '.layout', 'xbox');
            this.game.state.start('Options');
        });
        menu.button("Custom", 200, 300, () => {
            this.game.state.start('GamepadOptionsBindAxisOrButton', true, false, this.padIndex);
        });
        menu.button("Back", 200, 500, () => this.game.state.start('Options'));
    }
}