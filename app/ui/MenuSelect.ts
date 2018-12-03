/// <reference path="../../typings/phaser.d.ts"/>

export class MenuSelectOption<T> {
    label: string;
    value: T;
    callback: Function;

    constructor(value: T, label: string, callback?: Function) {
        this.label = label;
        this.value = value;
        this.callback = callback;
    }
}

export class MenuSelect<T> extends Phaser.Button {

    options: Array<MenuSelectOption<T>>;
    selectedOption = 0;
    labelText: Phaser.Text;
    constructor(game: Phaser.Game, x: number, y: number, options: Array<MenuSelectOption<T>>) {
        super(game, x, y, 'menu-buttons', () => this.toggle(), null, 'over', 'out', 'down');
        this.options = options;
        this.labelText = new Phaser.Text(this.game, 140, 15, options[0].label, { font: "64px monospace", fill: 'white' });
        this.addChild(this.labelText);
        game.add.existing(this);
    }

    toggle() {
        this.selectedOption = (this.selectedOption + 1) % this.options.length;
        this.labelText.setText(this.options[this.selectedOption].label);
    }

    getSelectedValue(): T {
        return this.options[this.selectedOption].value;
    }

    setSelectedValue(optionValue: T) {
        let foundIndex = this.options.findIndex((option: MenuSelectOption<T>) => option.value === optionValue);
        this.selectedOption = foundIndex >= 0 ? foundIndex : 0;
        this.labelText.setText(this.options[this.selectedOption].label);
    }

}