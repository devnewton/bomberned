/// <reference path="../../typings/phaser.d.ts"/>
export class CollisionResolver {
    game: Phaser.Game;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    groupVersusGroup(groupA: Phaser.Group, groupB: Phaser.Group) {
        for (let spriteA of groupA.children) {
            if (spriteA instanceof Phaser.Sprite) {
                this.spriteVersusGroup(spriteA, groupB);
            }
        }
    }

    spriteVersusGroup(spriteA: Phaser.Sprite, groupB: Phaser.Group) {
        if (spriteA.exists) {
            for (let spriteB of groupB.children) {
                if (spriteB instanceof Phaser.Sprite) {
                    this.spriteVersusSprite(spriteA, spriteB);
                }
            }
        }
    }

    spriteVersusSprite(spriteA: Phaser.Sprite, spriteB: Phaser.Sprite) {
        if (this.checkCollision(spriteA, spriteB)) {
            this.onCollide(spriteA, spriteB);
        }
    }

    checkCollision(spriteA: Phaser.Sprite, spriteB: Phaser.Sprite) {
        return spriteA.exists && spriteB.exists && spriteA.overlap(spriteB);
    }

    onCollide(a: Phaser.Sprite, b: Phaser.Sprite){
        console.log('prout');
    }
}