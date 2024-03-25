import { Creep, StructureContainer, StructureSpawn, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import CreepUtils from "../../utils/CreepUtils.mjs";
import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from "game/constants";

export default class AiCollector {
    /** @type {Creep} */
    _creep = null;

    /**
     * @param {Creep} creep
     * @memberof AiCollector
     */
    constructor(creep) {
        this._creep = creep;
    }

    tick() {
        if(this.fetchEnergy()) {
            return;
        }

        if(this.loadSpawn()) {
            return;
        }

        console.log("COLLECTOR " + this._creep.id + " IDLING!!!");
    }

    /**
     * @returns {boolean} Returns true if the action is in progress.
     */
    fetchEnergy() {
        if(this._creep.store[RESOURCE_ENERGY] !== 0) {
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
    loadTower() {
        if(this._creep.store[RESOURCE_ENERGY] === 0) {
            return false;
        }

        const target = getObjectsByPrototype(StructureTower)
            .filter(t => t.my && t.store[RESOURCE_ENERGY] / t.store.getCapacity(RESOURCE_ENERGY) < 0.75)
            .sort((a, b) => (a.store[RESOURCE_ENERGY] / a.store.getCapacity(RESOURCE_ENERGY)) - (b.store[RESOURCE_ENERGY] / b.store.getCapacity(RESOURCE_ENERGY)))[0];

        if(!target) {
            return false;
        }

        if(this._creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this._creep.moveTo(target);
        }

        return true;
    }

    loadSpawn() {
        if(this._creep.store[RESOURCE_ENERGY] === 0) {
            return false;
        }

        const target = getObjectsByPrototype(StructureSpawn)
            .filter(t => t.my)
            .sort((a, b) => (a.store[RESOURCE_ENERGY] / a.store.getCapacity(RESOURCE_ENERGY)) - (b.store[RESOURCE_ENERGY] / b.store.getCapacity(RESOURCE_ENERGY)))[0];

        if(!target) {
            return false;
        }

        if(this._creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this._creep.moveTo(target);
        }

        return true;
    }

    static tickAll() {
        const creeps = CreepUtils.getCollectors();

        for(const creep of creeps) {
            new AiCollector(creep).tick();
        }
    }
}
