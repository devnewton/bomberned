/// <reference path="../../typings/phaser.d.ts"/>
import { Arrow } from "../entities/Arrow";

export class DamageResolver {
    game: Phaser.Game;

    constructor( game: Phaser.Game ) {
        this.game = game;
    }

    arrowsVersusGroup( arrows: Phaser.Group, groupB: Phaser.Group ) {
        for ( let arrow of arrows.children ) {
            if ( arrow instanceof Arrow ) {
                this.arrowVersusGroup( arrow.arrowCharge, groupB );
            }
        }
    }

    arrowVersusGroup( spriteA: Phaser.Sprite, groupB: Phaser.Group ) {
        if ( spriteA.exists ) {
            for ( let spriteB of groupB.children ) {
                if ( spriteB instanceof Phaser.Sprite ) {
                    this.arrowVersusSprite( spriteA, spriteB );
                }
            }
        }
    }

    arrowVersusSprite( spriteA: Phaser.Sprite, spriteB: Phaser.Sprite ) {
        if ( this.checkArrowCollision( spriteA, spriteB ) ) {
            this.onCollide( spriteA, spriteB );
        }
    }

    checkArrowCollision( spriteA: Phaser.Sprite, spriteB: Phaser.Sprite ) {
        let arrowChargeBound = spriteA.getBounds();
        let arrowChargeX = arrowChargeBound.x + arrowChargeBound.width / 2;
        let arrowChargeY = arrowChargeBound.y + arrowChargeBound.height / 2;
        return spriteA.exists && spriteB.exists && spriteB.getBounds().contains(arrowChargeX, arrowChargeY);
    }


    groupVersusGroup( groupA: Phaser.Group, groupB: Phaser.Group ) {
        for ( let spriteA of groupA.children ) {
            if ( spriteA instanceof Phaser.Sprite ) {
                this.spriteVersusGroup( spriteA, groupB );
            }
        }
    }

    spriteVersusGroup( spriteA: Phaser.Sprite, groupB: Phaser.Group ) {
        if ( spriteA.exists ) {
            for ( let spriteB of groupB.children ) {
                if ( spriteB instanceof Phaser.Sprite ) {
                    this.spriteVersusSprite( spriteA, spriteB );
                }
            }
        }
    }

    spriteVersusSprite( spriteA: Phaser.Sprite, spriteB: Phaser.Sprite ) {
        if ( this.checkCollision( spriteA, spriteB ) ) {
            this.onCollide( spriteA, spriteB );
        }
    }

    checkCollision( spriteA: Phaser.Sprite, spriteB: Phaser.Sprite ) {
        return spriteA.exists && spriteB.exists && spriteA.overlap( spriteB );
    }

    onCollide( a: Phaser.Sprite, b: Phaser.Sprite ) {
        if ( !b.data.friends || !b.data.friends.includes( a.name ) ) {
            a.damage( 1 );
        }
        if ( !a.data.friends || !a.data.friends.includes( b.name ) ) {
            b.damage( 1 );
        }
    }
}