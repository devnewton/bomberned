/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {Menu} from "../ui/Menu";

export class Help2 extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        this.game.load.image('help2', 'help/help2.png');
        Menu.preload(this.game);
    }

    create() {
        super.create();
        this.game.add.image(0, 0, 'help2');
        const menu = new Menu(this.game);
        menu.button("Continue", 200, 610, () => this.game.state.start('Title'));
    }
}
