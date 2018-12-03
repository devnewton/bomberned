/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { Menu } from "../ui/Menu";
import { BombernedGame } from "../BombernedGame";


export class KeyboardOptionsBindKey extends AbstractState {

    bindingsDescription = [
        { label: 'Press move up key', localStorageKey: 'moveUp' },
        { label: 'Press move down key', localStorageKey: 'moveDown' },
        { label: 'Press move left key', localStorageKey: 'moveLeft' },
        { label: 'Press move right key', localStorageKey: 'moveRight' },
        { label: 'Press hammer key', localStorageKey: 'hammer' },
        { label: 'Press dash key', localStorageKey: 'dash' },
        { label: 'Press menu key', localStorageKey: 'menu' }
    ];

    currentBinding: number = 0;
    bindings = {};

    constructor() {
        super();
    }

    preload() {
        Menu.preload(this.game);
    }

    init(binding: number = 0, bindings?: any) {
        this.bindings = bindings || {};
        if (binding >= this.bindingsDescription.length) {
            this.currentBinding = 0;
            localStorage.setItem('keyboard.layout', JSON.stringify(this.bindings));
            (this.game as BombernedGame).controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('KeyboardOptions');
        } else {
            this.currentBinding = binding;
        }
    }

    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindingsDescription[this.currentBinding].label, { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        const menu = new Menu(this.game).disableKeyboardCursor();
        menu.button("Back", 200, 600, () => this.game.state.start('KeyboardOptions'));
    }

    update() {
        for (var k in Phaser.KeyCode) {
            let keycode = Phaser.KeyCode[k];
            if (this.input.keyboard.isDown(keycode)) {
                this.bindings[this.bindingsDescription[this.currentBinding].localStorageKey] = keycode;
                this.game.state.start('KeyboardOptionsBindKey', true, false, this.currentBinding + 1, this.bindings);
                break;
            }
        }
    }
}
