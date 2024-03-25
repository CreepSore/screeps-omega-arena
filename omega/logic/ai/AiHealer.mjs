import { Creep } from "game/prototypes";
import { getObjectById, getObjectsByPrototype } from "game/utils";
import CreepUtils from "../../utils/CreepUtils.mjs";
import { ERR_NOT_IN_RANGE, ERR_NO_BODYPART } from "game/constants";
import Commander from "../../utils/Commander.mjs";

export default class AiHealer {
    /** @type {Creep} */
    _creep = null;

    /**
     * @param {Creep} creep
     */
    constructor(creep) {
        this._creep = creep;
    }

    tick() {
        const target = CreepUtils.getMyCreeps()
            .filter(c => c.id !== this._creep.id && c.hits < c.hitsMax)
            .sort((a, b) => a.getRangeTo(this._creep) - b.getRangeTo(this._creep))[0];

        if(!target) {
            if(!this._creep.healTarget) {
                this._creep.healTarget = Commander.getCommander();
            }

            if(this._creep.healTarget) {
                const followTarget = this._creep.healTarget;
                if(!followTarget) {
                    delete this._creep.healTarget;
                    return;
                }

                if(this._creep.getRangeTo(followTarget) > 2) {
                    this._creep.moveTo(followTarget, {ignore: [...CreepUtils.getMyCreeps()]});
                }

                return;
            }

            return;
        }

        // @ts-ignore
        this._creep.healTarget = target.id;

        const healStatus = this._creep.heal(target);
        if(healStatus === ERR_NOT_IN_RANGE) {
            this._creep.moveTo(target);
        }
    }

    static tickAll() {
        const creeps = CreepUtils.getHealers();

        for(const creep of creeps) {
            new AiHealer(creep).tick();
        }
    }
}
