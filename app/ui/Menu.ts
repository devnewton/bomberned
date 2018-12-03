/// <reference path="../../typings/phaser.d.ts"/>

import { MenuCursor } from "./MenuCursor";
import { MenuButton } from "./MenuButton";
import { MenuSelect, MenuSelectOption } from "./MenuSelect";

export class Menu extends Phaser.Group {
    buttons: Phaser.Group;
    menuCursor: MenuCursor;

    constructor(game: Phaser.Game) {
        super(game);
        this.buttons = game.add.group();
        this.add(this.buttons);
        this.menuCursor = new MenuCursor(game, this.buttons);
        this.add(this.menuCursor);
        game.add.existing(this);
    }

    disableGamepadCursor(): Menu {
        this.menuCursor.gamepadCursor = false;
        return this;
    }

    disableKeyboardCursor(): Menu {
        this.menuCursor.gamepadCursor = false;
        return this;
    }

    addButton(button: MenuButton) {
        this.buttons.add(button);
    }

    button(label: string, x: number, y: number, callback: Function) {
        this.buttons.add(new MenuButton(this.game, label, x, y, callback));
    }

    select<T>(x: number, y: number, options: Array<MenuSelectOption<T>>): MenuSelect<T> {
        const select = new MenuSelect(this.game, x, y, options);
        this.buttons.add(select);
        return select;
    }

    static preload(game: Phaser.Game) {
        game.load.atlasXML('menu-buttons', 'menu/buttons.png', 'menu/buttons.xml');
    }
}