/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { Menu } from "../ui/Menu";

export class Title extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        this.game.load.image('school', 'title/background.jpg');
        this.game.load.audio('main-music', 'musics/opengameart/hungry-dino-9-chiptune-tracks-10-sfx/main.mp3')
        Menu.preload(this.game);
    }

    create() {
        super.create();
        this.game.sound.stopAll();
        this.game.sound.play('main-music', 1, true);
        this.game.add.image(0, 0, 'school');

        const menu = new Menu(this.game);
        menu.button("Start", 200, 250, () => this.game.state.start('TeamSelectScreen'));
        menu.button("Options", 200, 400, () => this.game.state.start('Options'));
        menu.button("Help", 200, 550, () => this.game.state.start('Help1'));
    }
}
