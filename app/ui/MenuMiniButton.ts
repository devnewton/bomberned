/// <reference path="../../typings/phaser.d.ts"/>
export class MenuMiniButton extends Phaser.Button {

    labelText: Phaser.Text;
    callback: Function;
    constructor(game: Phaser.Game, label: string, x: number, y: number, callback: Function) {
        super(game, x, y, 'menu-mini-buttons', callback, null, 'over', 'out', 'down');
        this.callback = callback;
        this.labelText = new Phaser.Text(this.game, 15, 15, label, { font: "64px monospace", fill: 'white' });
        this.addChild(this.labelText);
    }
    
    static preload(game: Phaser.Game) {
        game.load.atlasXML('menu-mini-buttons', 'menu/mini-buttons.png', 'menu/mini-buttons.xml');
    }

    toggle() {
        this.callback();
    }

    setText(text: string) {
        this.labelText.setText(text);
    }
}