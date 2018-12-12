/// <reference path="../../typings/phaser.d.ts"/>
import { CPUControls } from "../utils/Controls";
import { Player } from "../entities/Player";

export class CPU {
    controls: CPUControls;
    me: Player;
    opponents: Phaser.Group;
    buddies: Phaser.Group;
    waitUntil: number;
    lastCapturedCount: number = 0;

    think() {
        this.controls.reset();
        //TODO  
    }

    moveToXY(x: number, y: number) {
        if (this.me.body.x < x) {
            this.controls.goingRight = true;
        } else if (this.me.body.x > x) {
            this.controls.goingLeft = true;
        }
        if (this.me.body.y < y) {
            this.controls.goingDown = true;
        } else if (this.me.body.y > y) {
            this.controls.goingUp = true;
        }
    }
}