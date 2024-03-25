import { Creep, Resource, Source, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import CreepUtils from "../../utils/CreepUtils.mjs";
import { ERR_FULL, ERR_NOT_IN_RANGE, ERR_NO_BODYPART, RESOURCES_ALL, RESOURCE_ENERGY } from "game/constants";

export default class AiMiner {
    static test = [];

    /** @type {Creep} */
    _creep = null;
    /** @type {import("game/prototypes").ResourceType} */
    _resourceType;

    /**
     * @param {Creep} creep
     */
    constructor(creep, resourceType) {
        this._creep = creep;
        this._resourceType = resourceType;
    }

    tick() {
        if(this.deposit()) {
            return;
        }

        if(this.mine()) {
            return;
        }

        if(this.deposit(true)) {
            return;
        }

        console.log("MINER " + this._creep.id + " IDLING!!!");
    }

    deposit(force = false) {
        if(!force && this._creep.store.getFreeCapacity(this._resourceType) !== 0) {
            return false;
        }

        const target = this.getDepositTarget();

        if(!target) {
            return false;
        }

        if(this._creep.transfer(target, this._resourceType) === ERR_NOT_IN_RANGE) {
            this._creep.moveTo(target);
        }

        return true;
    }

    mine() {
        if(this._creep.store.getFreeCapacity(this._resourceType) === 0) {
            return false;
        }

        const target = this._creep.findClosestByPath(
            getObjectsByPrototype(Source)
        );

        if(!target) {
            return false;
        }

        const harvestStatus = this._creep.harvest(target);

        if(harvestStatus === ERR_NOT_IN_RANGE) {
            this._creep.moveTo(target);
        }

        return true;
    }

    getDepositTarget() {
        return this._creep.findClosestByPath(
            getObjectsByPrototype(StructureSpawn)
                .filter(s => s.my)
        );
    }

    static tickAll() {
        const creeps = CreepUtils.getMiners();

        for(const creep of creeps) {
            new AiMiner(creep, RESOURCE_ENERGY).tick();
        }
    }
}
