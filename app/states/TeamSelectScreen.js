"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractState_1 = require("./AbstractState");
const Level_1 = require("./Level");
const Menu_1 = require("../ui/Menu");
const MenuSelect_1 = require("../ui/MenuSelect");
const Controls_1 = require("../utils/Controls");
class TeamSelectScreen extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        Menu_1.Menu.preload(this.game);
        this.game.load.atlasXML('ned', 'sprites/devnewton/ned.png', 'sprites/devnewton/player.xml');
        this.game.load.atlasXML('ned2', 'sprites/devnewton/ned2.png', 'sprites/devnewton/player.xml');
        this.game.load.atlasXML('moustaki', 'sprites/devnewton/moustaki.png', 'sprites/devnewton/player.xml');
        this.game.load.atlasXML('moustaki2', 'sprites/devnewton/moustaki2.png', 'sprites/devnewton/player.xml');
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Team selection', { font: "64px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        let ned = this.add.sprite(150, 175, 'ned', 0);
        this.game.addSpriteAnimation(ned, 'player.wait', 1);
        ned.play('player.wait', 8, true);
        let ned2 = this.add.sprite(150, 275, 'ned2', 0);
        this.game.addSpriteAnimation(ned2, 'player.wait', 1);
        ned2.play('player.wait', 8, true);
        let moustaki = this.add.sprite(1060, 375, 'moustaki', 0);
        this.game.addSpriteAnimation(moustaki, 'player.wait', 1);
        moustaki.play('player.wait', 8, true);
        let moustaki2 = this.add.sprite(1060, 475, 'moustaki2', 0);
        this.game.addSpriteAnimation(moustaki2, 'player.wait', 1);
        moustaki2.play('player.wait', 8, true);
        const menu = new Menu_1.Menu(this.game);
        let playerOptions = [
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.NONE, 'None'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.CPU, 'CPU'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.KEYBOARD, 'Keyboard'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD1, 'Pad 1'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD2, 'Pad 2'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD3, 'Pad 3'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD4, 'Pad 4')
        ];
        this.nedSelect = menu.select(200, 150, playerOptions);
        this.ned2Select = menu.select(200, 250, playerOptions);
        this.moustakiSelect = menu.select(200, 350, playerOptions);
        this.moustaki2Select = menu.select(200, 450, playerOptions);
        this.autoSelect();
        menu.button("Play", 200, 600, () => {
            let config = new Level_1.LevelConfig();
            config.nedController = this.nedSelect.getSelectedValue();
            config.ned2Controller = this.ned2Select.getSelectedValue();
            config.moustakiController = this.moustakiSelect.getSelectedValue();
            config.moustaki2Controller = this.moustaki2Select.getSelectedValue();
            this.game.state.start('Level', true, false, config);
        });
        this.input.gamepad.onConnectCallback = this.input.gamepad.onDisconnectCallback = () => this.autoSelect();
    }
    shutdown() {
        this.input.gamepad.onConnectCallback = this.input.gamepad.onDisconnectCallback = null;
    }
    autoSelect() {
        switch (this.input.gamepad.padsConnected) {
            case 0:
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.KEYBOARD);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            case 1:
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            case 2:
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.PAD2);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            case 3:
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.PAD2);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.PAD3);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            default:
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.PAD2);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.PAD3);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.PAD4);
                break;
        }
    }
}
exports.TeamSelectScreen = TeamSelectScreen;
//# sourceMappingURL=TeamSelectScreen.js.map