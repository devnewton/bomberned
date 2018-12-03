/// <reference path="../../typings/phaser.d.ts"/>
export abstract class AbstractState extends Phaser.State {

    constructor() {
        super();
    }

    create() {
        this.game.input.keyboard.addKey(Phaser.Keyboard.F11).onDown.add(() => this.toggleFullscreen());
    }

    toggleFullscreen() {
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            this.game.scale.startFullScreen();
        }
    }
}
