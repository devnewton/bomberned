/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState"; // you import only AClass

export class Intro extends AbstractState {

    lastKey: Phaser.Key;
    video: Phaser.Video;

    constructor() {
        super();
    }

    preload() {
        this.game.load.video('intro', 'intro/intro.webm');
    }

    create() {
        super.create();
        this.video = this.game.add.video('intro');
        this.video.play();
        this.video.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5);
        this.video.onComplete.add(() => this.game.state.start('Title'));
        this.lastKey = this.game.input.keyboard.lastKey;
        this.game.input.onTap.add(() => {
            this.gotoTitle();
        });
    }

    update() {
        if (this.lastKey != this.game.input.keyboard.lastKey) {
            this.gotoTitle();
            return;
        }
        for (let b = 0; b < 16; ++b) {
            if (this.input.gamepad.isDown(b)) {
                this.gotoTitle();
                return;
            }
        }
    }

    gotoTitle() {
        this.video.stop();
        this.game.state.start('Title');
    }
}
