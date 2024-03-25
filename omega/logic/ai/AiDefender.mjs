import { Creep } from "game/prototypes";
import CreepUtils from "../../utils/CreepUtils.mjs";
import { ATTACK, ERR_NOT_IN_RANGE } from "game/constants";
import Commander from "../../utils/Commander.mjs";

export default class AiDefender {
    /** @type {Creep} */
    _creep = null;

    /**
     * @param {Creep} creep
     */
    constructor(creep) {
        this._creep = creep;
    }

    tick() {
        if(this.attackClosestTarget()) {
            return;
        }

        this.moveToIdlePosition();
    }

    moveToIdlePosition() {
        const mySpawn = CreepUtils.getMainSpawn();

        const idlePosition = Number(this._creep.id) % 2 === 0
            ? {x: mySpawn.x, y: mySpawn.y + 10}
            : {x: mySpawn.x, y: mySpawn.y - 10};

        this._creep.moveTo(idlePosition);

        return true;
    }

    attackClosestTarget() {
        const target = this._creep.findClosestByPath(
            CreepUtils.getEnemyCreeps()
                .filter(ec => ec.findPathTo(this._creep).length < 10)
        );

        if(!target) {
            return false;
        }

        const attackResult = this._creep.body.some(b => b.type === ATTACK)
            ? this._creep.attack(target)
            : this._creep.rangedAttack(target);

        if(attackResult === ERR_NOT_IN_RANGE) {
            this._creep.moveTo(target);
        }

        return true;
    }

    static tickAll() {
        const creeps = CreepUtils.getDefenders();

        for(const creep of creeps) {
            new AiDefender(creep).tick();
        }
    }
}
