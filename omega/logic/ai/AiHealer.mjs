import { Creep } from "game/prototypes";
import { getObjectById, getObjectsByPrototype } from "game/utils";
import CreepUtils from "../../utils/CreepUtils.mjs";
import { ERR_NOT_IN_RANGE, ERR_NO_BODYPART, HEAL, RANGED_ATTACK_DISTANCE_RATE } from "game/constants";
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
            .filter(c => c.id !== this._creep.id && c.hits < c.hitsMax && c.getRangeTo(this._creep) <= RANGED_ATTACK_DISTANCE_RATE)
            .sort((a, b) => CreepUtils.healthPercentage(a) - CreepUtils.healthPercentage(b))[0];

        if(!target) {
            if(!this._creep.healTarget) {
                this._creep.healTarget = Commander.getCommander();
            }

            if(this._creep.healTarget) {
                const followTarget = this._creep.healTarget;

                if(this._creep.getRangeTo(followTarget) > 3) {
                    this._creep.moveTo(followTarget, {ignore: [...CreepUtils.getMyCreeps()]});
                }

                return;
            }

            return;
        }

        // @ts-ignore
        this._creep.healTarget = target.id;

        const healStatus = target.getRangeTo(this._creep) === 1
            ? this._creep.heal(target)
            : this._creep.rangedHeal(target);

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
