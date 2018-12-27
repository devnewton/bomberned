/// <reference path="../../typings/phaser.d.ts"/>
import { CPUControls } from "../utils/Controls";
import { Player } from "../entities/Player";

export class CPU {
    controls: CPUControls;
    me: Player;
    opponents: Phaser.Group;
    buddies: Phaser.Group;
    waitUntil: number;
    destination: Phaser.Point;

    think() {
        this.controls.reset();
        if(this.me.alive) {
            if(!this.destination) {
                this.destination = this.findSafePos();
            }else if(Phaser.Point.distance(this.me.position, this.destination) < 32 ){
                this.destination = null;
            } else {
                this.moveToXY(this.destination.x, this.destination.y);
            }
            this.tryToShootArrow();
            this.tryToDropBomb();
        }
    }
    
    tryToShootArrow() {
        let opponent = this.opponents.getFirstAlive();
        if(opponent) {
            this.controls.aimAngle = Phaser.Math.angleBetweenPoints(this.me.position, opponent.position);
            this.controls.shooting = !this.me.arrow.alive;
        }
    }
    
    tryToDropBomb() {
        if(!this.controls.shooting) {
            this.controls.droppingBomb = this.me.game.rnd.integerInRange(0, 100) < 20;
        }
    }
    
    findSafePos() : Phaser.Point {
        let worldBounds = this.me.game.physics.arcade.bounds;
        let x = this.me.game.rnd.between(worldBounds.left, worldBounds.right);
        let y = this.me.game.rnd.between(worldBounds.top, worldBounds.bottom);
        return new Phaser.Point(x, y);
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