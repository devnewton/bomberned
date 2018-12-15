/// <reference path="../../typings/phaser.d.ts"/>
export class Explosion extends Phaser.Sprite {

    kill(): Phaser.Sprite {
        this.destroy();
        return super.kill();
    }
    
    damage(amount: number): Phaser.Sprite {
        return this;
    }
}