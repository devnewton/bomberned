"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
class KeyboardOptions extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        Menu_1.Menu.preload(this.game);
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Choose keyboard layout', { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        const menu = new Menu_1.Menu(this.game).disableKeyboardCursor();
        menu.button("Azerty zsqd jk", 200, 100, () => {
            localStorage.setItem('keyboard.layout', 'azerty');
            this.game.controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('Options');
        });
        menu.button("Qwerty wsad jk", 200, 200, () => {
            localStorage.setItem('keyboard.layout', 'qwerty');
            this.game.controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('Options');
        });
        menu.button("⬆⬇⬅➡ shift ctrl", 200, 300, () => {
            localStorage.setItem('keyboard.layout', 'other');
            this.game.controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('Options');
        });
        menu.button("Custom", 200, 400, () => {
            this.game.state.start('KeyboardOptionsBindKey', true, false);
        });
        menu.button("Back", 200, 600, () => this.game.state.start('Options'));
    }
}
exports.KeyboardOptions = KeyboardOptions;
//# sourceMappingURL=KeyboardOptions.js.map