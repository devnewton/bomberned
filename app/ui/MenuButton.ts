/// <reference path="../../typings/phaser.d.ts"/>
export class MenuButton extends Phaser.Button{

    labelText: Phaser.Text;
    callback: Function;
    constructor(game: Phaser.Game, label: string, x: number, y: number, callback: Function) {
        super(game, x, y, 'menu-buttons', callback, null, 'over', 'out', 'down');
        this.callback = callback;
        this.labelText = new Phaser.Text(this.game, 140, 15, label, {font: "64px monospace", fill: 'white'});
        this.addChild(this.labelText);
    }

    toggle() {
        this.callback();
    }

    setText(text: string) {
        this.labelText.setText(text);
    }
}