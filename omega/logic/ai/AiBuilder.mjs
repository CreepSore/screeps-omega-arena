import { ConstructionSite, Creep, StructureContainer } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import CreepUtils from "../../utils/CreepUtils.mjs";
import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from "game/constants";

export default class AiBuilder {
    /** @type {Creep} */
    _creep = null;

    /**
     * @param {Creep} creep
     * @memberof AiBuilder
     */
    constructor(creep) {
        this._creep = creep;
    }

    tick() {
        if(this.fetchEnergy()) {
            return;
        }

        if(this.build()) {
            return;
        }

        console.log("BUILDER " + this._creep.id + " IDLING!!!");
    }

    /**
     * @returns {boolean} Returns true if the action is in progress.
     */
    fetchEnergy() {
        if(this._creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) {
            return false;
        }

        const target = getObjectsByPrototype(StructureContainer)
            .filter(t => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            .sort((a, b) => a.getRangeTo(this._creep) - b.getRangeTo(this._creep))[0];

        if(!target) {
            return false;
        }

        if(this._creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this._creep.moveTo(target);
        }

        return true;
    }

    /**
     * @returns {boolean} Returns true if the action is in progress.
     */
    build() {
        if(this._creep.store[RESOURCE_ENERGY] === 0) {
            return false;
        }

        const target = this._creep.findClosestByPath(getObjectsByPrototype(ConstructionSite));

        if(!target) {
            return false;
        }

        if(this._creep.build(target) === ERR_NOT_IN_RANGE) {
            this._creep.moveTo(target);
        }

        return true;
    }

    static tickAll() {
        const creeps = CreepUtils.getBuilders();

        for(const creep of creeps) {
            new AiBuilder(creep).tick();
        }
    }
}
