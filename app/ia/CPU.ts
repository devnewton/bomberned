/// <reference path="../../typings/phaser.d.ts"/>
import { CPUControls } from "../utils/Controls";
import { Player } from "../entities/Player";

enum CPUAttitude {
    OFFENSIVE = 1,
    DEFENSIVE = 2
}

export class CPU {
    controls: CPUControls;
    underwears: Phaser.Group;
    me: Player;
    opponents: Phaser.Group;
    buddies: Phaser.Group;
    waitUntil: number;
    hammerUntil: number;
    lastCapturedCount: number = 0;

    think() {
        this.controls.reset();
        if (!this.waiting() && !this.hammering()) {
            switch (this.chooseBehavior()) {
                case CPUAttitude.OFFENSIVE:
                    this.attack();
                    break;
                case CPUAttitude.DEFENSIVE:
                    this.defend();
                    break;
            }

        }
    }

    chooseBehavior(): CPUAttitude {
        if (!this.me.cpuData.attitude) {
            let nbOffensive = 0;
            let nbDefensive = 0;
            this.buddies.forEachAlive((player) => {
                switch (player.cpuData.attitude) {
                    case CPUAttitude.OFFENSIVE:
                        ++nbOffensive;
                        break;
                    case CPUAttitude.DEFENSIVE:
                        ++nbDefensive;
                        break;
                }
            }, null);
            if (nbDefensive < nbOffensive) {
                this.me.cpuData.attitude = this.me.game.rnd.weightedPick([CPUAttitude.OFFENSIVE, CPUAttitude.DEFENSIVE]);
            } else if (nbDefensive > nbOffensive) {
                this.me.cpuData.attitude = CPUAttitude.OFFENSIVE;
            } else {
                this.me.cpuData.attitude = this.me.game.rnd.weightedPick([CPUAttitude.OFFENSIVE, CPUAttitude.DEFENSIVE]);
            }
        }
        return this.me.cpuData.attitude;
    }

    attack() {
        //TODO
    }


    defend() {
        let opponent = this.opponents.getClosestTo(this.me);
        if (opponent) {
            if (this.me.game.physics.arcade.overlap(this.me, this.opponents)) {
                this.hammerUntil = this.me.game.time.time + 500;
                this.me.cpuData.attitude = null;
            } else {
                this.moveToXY(opponent.body.x, opponent.body.y)
            }
        }
    }

    pushUnderwear(underwear, capturePoint) {
        if (underwear.body.blocked.up && underwear.body.blocked.left) {
            this.unblockTopLeftUnderwear(underwear);
        } else if (underwear.body.blocked.up && underwear.body.blocked.right) {
            this.unblockTopRightUnderwear(underwear);
        } if (underwear.body.blocked.down && underwear.body.blocked.left) {
            this.unblockBottomLeftUnderwear(underwear);
        } else if (underwear.body.blocked.down && underwear.body.blocked.right) {
            this.unblockBottomRightUnderwear(underwear);
        } else {
            this.pushUnderwearToCapturePoint(underwear, capturePoint);
        }
    }

    pushUnderwearToCapturePoint(underwear, capturePoint) {
        let ucVector = new Phaser.Point(underwear.body.x - capturePoint.body.x, underwear.body.y - capturePoint.body.y);
        ucVector.setMagnitude(underwear.body.radius).add(underwear.body.x, underwear.body.y);
        this.moveToXY(ucVector.x, ucVector.y);
    }

    unblockTopLeftUnderwear(underwear) {
        this.moveToXY(underwear.left, underwear.top);
    }
    unblockTopRightUnderwear(underwear) {
        this.moveToXY(underwear.right, underwear.top);
    }
    unblockBottomLeftUnderwear(underwear) {
        this.moveToXY(underwear.left, underwear.bottom);
    }
    unblockBottomRightUnderwear(underwear) {
        this.moveToXY(underwear.right, underwear.bottom);
    }
    waiting(): boolean {
        if (this.waitUntil) {
            if (this.me.game.time.time < this.waitUntil) {
                return true;
            } else {
                this.waitUntil = null;
            }
        }
        return false;
    }

    hammering(): boolean {
        if (this.hammerUntil) {
            if (this.me.game.time.time < this.hammerUntil) {
                this.controls.droppingBomb = true;
                return true;
            } else {
                this.waitUntil = this.me.game.time.time + 500;
                this.hammerUntil = null;
            }
        }
        return false;
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