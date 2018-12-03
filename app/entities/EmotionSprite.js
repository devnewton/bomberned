"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmotionSprite extends Phaser.Sprite {
    constructor(game, key, emotion) {
        super(game, game.world.centerX, game.world.centerY, 'emotions');
        this.health = 3;
        const anim = key + "." + emotion;
        game.addSpriteAnimation(this, anim, emotion === 'sad' ? 10 : 4);
        this.play(anim, 4, true);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);
    }
    static preload(game) {
        game.load.atlasXML('emotions', 'sprites/opengameart/emotions.png', 'sprites/opengameart/emotions.xml');
    }
}
exports.EmotionSprite = EmotionSprite;
//# sourceMappingURL=EmotionSprite.js.map