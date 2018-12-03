"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Intro_1 = require("./states/Intro");
const Help1_1 = require("./states/Help1");
const Help2_1 = require("./states/Help2");
const Title_1 = require("./states/Title");
const Options_1 = require("./states/Options");
const KeyboardOptions_1 = require("./states/KeyboardOptions");
const KeyboardOptionsBindKey_1 = require("./states/KeyboardOptionsBindKey");
const GamepadOptions_1 = require("./states/GamepadOptions");
const GamepadOptionsLayout_1 = require("./states/GamepadOptionsLayout");
const GamepadOptionsBindAxisOrButton_1 = require("./states/GamepadOptionsBindAxisOrButton");
const TeamSelectScreen_1 = require("./states/TeamSelectScreen");
const Level_1 = require("./states/Level");
const Controls_1 = require("./utils/Controls");
class BombernedGame extends Phaser.Game {
    constructor() {
        super(1280, 720, Phaser.CANVAS, 'game', {
            preload: () => this.preloadGame(),
            create: () => this.createGame()
        });
        this.state.add('Intro', Intro_1.Intro);
        this.state.add('Title', Title_1.Title);
        this.state.add('Help1', Help1_1.Help1);
        this.state.add('Help2', Help2_1.Help2);
        this.state.add('Options', Options_1.Options);
        this.state.add('GamepadOptionsLayout', GamepadOptionsLayout_1.GamepadOptionsLayout);
        this.state.add('GamepadOptionsBindAxisOrButton', GamepadOptionsBindAxisOrButton_1.GamepadOptionsBindAxisOrButton);
        this.state.add('KeyboardOptions', KeyboardOptions_1.KeyboardOptions);
        this.state.add('KeyboardOptionsBindKey', KeyboardOptionsBindKey_1.KeyboardOptionsBindKey);
        this.state.add('GamepadOptions', GamepadOptions_1.GamepadOptions);
        this.state.add('TeamSelectScreen', TeamSelectScreen_1.TeamSelectScreen);
        this.state.add('Level', Level_1.Level);
    }
    preloadGame() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }
    createGame() {
        this.controllers = new Controls_1.Controllers(this);
        this.state.start('Intro');
    }
    addSpriteAnimation(sprite, animationName, frameCount) {
        return sprite.animations.add(animationName, this.genAnimArray(animationName, frameCount));
    }
    genAnimArray(name, n) {
        let result = new Array();
        for (let i = 0; i < n; ++i) {
            result.push(name + i);
        }
        return result;
    }
}
exports.BombernedGame = BombernedGame;
//# sourceMappingURL=BombernedGame.js.map