/// <reference path="../typings/phaser.d.ts"/>
import {Intro} from "./states/Intro";
import {Help1} from "./states/Help1";
import {Title} from "./states/Title";
import {Options} from "./states/Options";
import {KeyboardOptions} from "./states/KeyboardOptions";
import {KeyboardOptionsBindKey} from "./states/KeyboardOptionsBindKey";
import {GamepadOptions} from "./states/GamepadOptions";
import {GamepadOptionsLayout} from "./states/GamepadOptionsLayout";
import {GamepadOptionsBindAxisOrButton} from "./states/GamepadOptionsBindAxisOrButton";
import {TeamSelectScreen} from "./states/TeamSelectScreen";
import {Level} from "./states/Level";
import {Controllers} from "./utils/Controls";

export class BombernedGame extends Phaser.Game {

    controllers: Controllers;

    constructor() {
        super(1280, 720, Phaser.CANVAS, 'game', {
            preload: () => this.preloadGame()
            , create: () => this.createGame()
        });
        this.state.add('Intro', Intro);
        this.state.add('Title', Title);
        this.state.add('Help1', Help1);
        this.state.add('Options', Options);
        this.state.add('GamepadOptionsLayout', GamepadOptionsLayout);
        this.state.add('GamepadOptionsBindAxisOrButton', GamepadOptionsBindAxisOrButton);
        this.state.add('KeyboardOptions', KeyboardOptions);
        this.state.add('KeyboardOptionsBindKey', KeyboardOptionsBindKey);
        this.state.add('GamepadOptions', GamepadOptions);
        this.state.add('TeamSelectScreen', TeamSelectScreen);
        this.state.add('Level', Level);
    }

    preloadGame() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }

    createGame() {
        this.controllers = new Controllers(this);
        this.state.start('Intro');
    }

    addSpriteAnimation(sprite: Phaser.Sprite, animationName: string, frameCount: number): Phaser.Animation {
        return sprite.animations.add(animationName, this.genAnimArray(animationName, frameCount));
    }

    private genAnimArray(name: string, n: number) {
        let result = new Array<string>();
        for (let i = 0; i < n; ++i) {
            result.push(name + i);
        }
        return result;
    }

}