import { ATTACK, CARRY, HEAL, MOVE, RANGED_ATTACK, WORK } from "game/constants";
import { Creep, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

export default class CreepUtils {
    static commanderBody = [RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE];
    static meleeFighterBody = [ATTACK, MOVE, ATTACK, MOVE];
    static rangedFighterBody = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE];
    static collectorBody = [CARRY, CARRY, MOVE];
    static minerBody = [WORK, CARRY, MOVE];
    static builderBody = [WORK, CARRY, MOVE];
    static healerBody = [HEAL, HEAL, MOVE];
    static defenderBody = [RANGED_ATTACK, RANGED_ATTACK];

    /**
     * @param {string[]} body
     * @param {string[]} expected
     */
    static checkBody(body, expected) {
        if(body.length !== expected.length) return false;

        const sortedIs = body.sort((/** @type {string}*/ a, /** @type {string}*/ b) => a.localeCompare(b));
        const sortedExpected = body.sort((/** @type {string}*/ a, /** @type {string}*/ b) => a.localeCompare(b));

        for(let i = 0; i < sortedIs.length; i++) {
            if(sortedIs[i] !== sortedExpected[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * @static
     * @param {Creep} creep
     * @memberof CreepUtils
     */
    static creepIsCollector(creep) {
        return creep.job === "collector";
    }

    /**
     * @static
     * @param {Creep} creep
     * @memberof CreepUtils
     */
    static creepIsRangedFighter(creep) {
        return creep.job === "ranged_fighter";
    }

    /**
     * @static
     * @param {Creep} creep
     * @memberof CreepUtils
     */
    static creepIsMeleeFighter(creep) {
        return creep.job === "melee_fighter";
    }

    /**
     * @static
     * @param {Creep} creep
     * @memberof CreepUtils
     */
    static creepIsHealer(creep) {
        return creep.job === "healer";
    }

    /**
     * @static
     * @param {Creep} creep
     * @memberof CreepUtils
     */
    static creepIsMiner(creep) {
        return creep.job === "miner";
    }

    /**
     * @static
     * @param {Creep} creep
     * @memberof CreepUtils
     */
    static creepIsBuilder(creep) {
        return creep.job === "builder";
    }

    /**
     * @static
     * @param {Creep} creep
     * @memberof CreepUtils
     */
    static creepIsCommander(creep) {
        return creep.isCommander;
    }

    /**
     * @static
     * @param {Creep} creep
     * @memberof CreepUtils
     */
    static creepIsDefender(creep) {
        return creep.job === "defender";
    }

    /**
     * @static
     * @param {Creep} creep
     * @memberof CreepUtils
     */
    static creepIsFighter(creep) {
        return this.creepIsMeleeFighter(creep) || this.creepIsRangedFighter(creep);
    }

    static getCommanders() {
        return getObjectsByPrototype(Creep)
            .filter(c => c.my && !c.spawning && c.exists && CreepUtils.creepIsCommander(c));
    }

    static getCollectors() {
        return getObjectsByPrototype(Creep)
            .filter(c => c.my && !c.spawning && c.exists && CreepUtils.creepIsCollector(c));
    }

    static getHealers() {
        return getObjectsByPrototype(Creep)
            .filter(c => c.my && !c.spawning && c.exists && CreepUtils.creepIsHealer(c));
    }

    static getBuilders() {
        return getObjectsByPrototype(Creep)
            .filter(c => c.my && !c.spawning && c.exists && CreepUtils.creepIsBuilder(c));
    }

    static getMiners() {
        return getObjectsByPrototype(Creep)
            .filter(c => c.my && !c.spawning && c.exists && CreepUtils.creepIsMiner(c));
    }

    static getFighters() {
        return getObjectsByPrototype(Creep)
            .filter(c => c.my && !c.spawning && c.exists && CreepUtils.creepIsFighter(c));
    }

    static getMeleeFighters() {
        return getObjectsByPrototype(Creep)
            .filter(c => c.my && !c.spawning && c.exists && CreepUtils.creepIsMeleeFighter(c));
    }

    static getRangedFighters() {
        return getObjectsByPrototype(Creep)
            .filter(c => c.my && !c.spawning && c.exists && CreepUtils.creepIsRangedFighter(c));
    }

    static getDefenders() {
        return getObjectsByPrototype(Creep)
            .filter(c => c.my && !c.spawning && c.exists && CreepUtils.creepIsDefender(c))
    }

    static getMyCreeps() {
        return getObjectsByPrototype(Creep).filter(c => c.my && !c.spawning && c.exists);
    }

    static getEnemyCreeps() {
        return getObjectsByPrototype(Creep).filter(c => !c.my && !c.spawning && c.exists);
    }

    /**
     * @param {import("game/prototypes").Position} pos
     * @param {boolean} ascending
     */
    static getEnemyCreepsSortedByRange(pos, ascending = true) {
        return this.getEnemyCreeps()
            .sort((a, b) => ascending
                ? a.getRangeTo(pos) - b.getRangeTo(pos)
                : b.getRangeTo(pos) - a.getRangeTo(pos)
            );
    }

    /**
     * @param {boolean} ascending
     */
    static getEnemyCreepsSortedByTicksToDecay(ascending = true) {
        return this.getEnemyCreeps()
            .sort((a, b) => ascending
                ? a.ticksToDecay - b.ticksToDecay
                : b.ticksToDecay - a.ticksToDecay
            );
    }

    /**
     * @param {{hits?: number, hitsMax?: number}} gameObject
     * @returns {number}
     */
    static healthPercentage(gameObject) {
        if(gameObject.hits === undefined || gameObject.hits === null) return 1;
        if(gameObject.hitsMax === undefined || gameObject.hitsMax === null) return 1;

        return gameObject.hits / gameObject.hitsMax;
    }

    static getEnemySpawns() {
        return getObjectsByPrototype(StructureSpawn).filter(s => !s.my);
    }

    static getMainSpawn() {
        return getObjectsByPrototype(StructureSpawn).find(s => s.my);
    }

    /**
     * @param {import("game/prototypes").GameObject[]} from
     * @param {import("game/prototypes").Position} to
     */
    static getAverageDistance(from, to) {
        return from.map(f => f.getRangeTo(to)).reduce((a, b) => a + b, 0) / from.length;
    }

    static getNextId() {
        const lastId = Math.max(...CreepUtils.getMyCreeps().map(c => c.myId).filter(Boolean));
        const nextId = isNaN(lastId) || lastId === -Infinity || lastId === Infinity ? 1 : lastId + 1;

        return nextId;
    }
}
