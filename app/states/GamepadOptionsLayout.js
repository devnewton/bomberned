"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
const GamepadUtils_1 = require("../utils/GamepadUtils");
class GamepadOptionsLayout extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        Menu_1.Menu.preload(this.game);
    }
    init(padIndex) {
        this.padIndex = padIndex || 1;
    }
    create() {
        super.create();
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad layout', { font: "42px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);
        const menu = new Menu_1.Menu(this.game).disableGamepadCursor();
        menu.button("Xbox", 200, 200, () => {
            localStorage.setItem('gamepad.' + GamepadUtils_1.GamepadUtils.gamepadId(GamepadUtils_1.GamepadUtils.gamepadByIndex(this.game, this.padIndex)) + '.layout', 'xbox');
            this.game.state.start('Options');
        });
        menu.button("Custom", 200, 300, () => {
            this.game.state.start('GamepadOptionsBindAxisOrButton', true, false, this.padIndex);
        });
        menu.button("Back", 200, 500, () => this.game.state.start('Options'));
    }
}
exports.GamepadOptionsLayout = GamepadOptionsLayout;
//# sourceMappingURL=GamepadOptionsLayout.js.map