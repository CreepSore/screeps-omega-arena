import CreepUtils from "./CreepUtils.mjs";

/**
 * @typedef {{from: import("game/prototypes").Position, to: import("game/prototypes").Position}} Hitbox
 */

export default class HitboxUtils {
    /**
     * @param {import("game/prototypes").Position} position
     * @param {Hitbox} hitbox
     */
    static isTouchingHitbox(position, hitbox) {
        return position.x >= hitbox.from.x
            && position.x <= hitbox.to.x
            && position.y >= hitbox.from.y
            && position.y <= hitbox.to.y;
    }

    /**
     * @returns {Hitbox}
     */
    static getMiddleHitbox() {
        return {
            from: {
                x: 45,
                y: 0,
            },
            to: {
                x: 45,
                y: 99
            }
        }
    }

    static getUpperHitbox() {
        return {
            from: {
                x: 0,
                y: 0,
            },
            to: {
                x: 99,
                y: 30,
            },
        }
    }

    static getLowerHitbox() {
        return {
            from: {
                x: 0,
                y: 31,
            },
            to: {
                x: 99,
                y: 99,
            },
        }
    }
}
