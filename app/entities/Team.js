"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CollisionResolver_1 = require("../utils/CollisionResolver");
class Team extends Phaser.Group {
    constructor(game) {
        super(game);
    }
}
exports.Team = Team;
class TeamCollisionResolver extends CollisionResolver_1.CollisionResolver {
    constructor(game) {
        super(game);
    }
    onCollide(sa, sb) {
    }
}
exports.TeamCollisionResolver = TeamCollisionResolver;
//# sourceMappingURL=Team.js.map