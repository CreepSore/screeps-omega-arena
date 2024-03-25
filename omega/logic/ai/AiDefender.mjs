import { Creep } from "game/prototypes";
import CreepUtils from "../../utils/CreepUtils.mjs";
import { ATTACK, ERR_NOT_IN_RANGE, MOVE, RANGED_ATTACK } from "game/constants";
import Commander from "../../utils/Commander.mjs";
import LimitManager from "../../utils/LimitManager.mjs";

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
        const commander = Commander.getCommander();
        if(!commander) {
            return false;
        }

        const isInUpperHalf = commander.y < 50;

        const mySpawn = CreepUtils.getMainSpawn();

        const xOffset = -(LimitManager.getDefenderLimit() / 2) + 1 + this._creep.jobId;

        const idlePosition = isInUpperHalf
            ? {x: mySpawn.x + xOffset, y: mySpawn.y + 6}
            : {x: mySpawn.x + xOffset, y: mySpawn.y - 6};

        this._creep.moveTo(idlePosition);

        return true;
    }

    attackClosestTarget() {
        const mySpawn = CreepUtils.getMainSpawn();

        const target = CreepUtils.getEnemyCreeps()
            .filter(ec =>
                ec.getRangeTo(mySpawn) <= ec.body.filter(b => b.type === MOVE).length + this._creep.getRangeTo(mySpawn) + (ec.body.some(b => b.type === RANGED_ATTACK) ? 5 : 1)
                || (ec.getRangeTo(this._creep) < 15 && ec.findPathTo(this._creep).length < 15)
            )
            .sort((a, b) => a.hits - b.hits)[0];

        if(!target) {
            return false;
        }

        const attackResult = this._creep.body.some(b => b.type === ATTACK)
            ? this._creep.attack(target)
            : this._creep.rangedAttack(target);

        console.log(attackResult);

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
