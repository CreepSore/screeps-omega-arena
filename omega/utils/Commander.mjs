import { Creep, GameObject } from "game/prototypes";
import CreepUtils from "./CreepUtils.mjs";
import { HEAL, MOVE, TOUGH } from "game/constants";

export default class Commander {
    /**
     * @static
     * @param {GameObject} target
     * @memberof Commander
     */
    static broadcastAttackTarget(target) {
        for(const creep of CreepUtils.getFighters()) {
            creep.pushTarget = target;
        }
    }

    static broadcastPushStatus(status) {
        for(const creep of CreepUtils.getFighters()) {
            creep.isPushing = status;
        }

        for(const creep of CreepUtils.getHealers()) {
            creep.healTarget = this.getCommander();
        }
    }

    static broadcastPushDefense(status) {
        for(const creep of [...CreepUtils.getFighters(), ...CreepUtils.getHealers()]) {
            creep.pushDefense = status;
        }
    }

    static ensureCommander() {
        const commanders = CreepUtils.getCommanders();

        if(commanders.length > 0) {
            return;
        }

        const enemySpawns = CreepUtils.getEnemySpawns();

        const newCommander = CreepUtils.getFighters()
            .sort((a, b) => a.getRangeTo(enemySpawns[0]) - b.getRangeTo(enemySpawns[0]))[0];

        if(newCommander) {
            newCommander.isCommander = true;
        }
    }

    static getCommander() {
        this.ensureCommander();

        return CreepUtils.getCommanders()[0];
    }

    static detectAttack() {
        for(const creep of CreepUtils.getFighters()) {
            if(creep.hits < creep.hitsMax) {
                return true;
            }
        }

        return false;
    }

    static getLongestPathToCommander() {
        const commander = this.getCommander();
        if(!commander) {
            return -1;
        }

        const maxPath = Math.max(...[
            ...CreepUtils.getFighters(),
            ...CreepUtils.getHealers(),
        ].map(c => c.findPathTo(commander).length));

        return maxPath;
    }

    /**
     * @param {Creep} creep
     */
    static isDangerousCreep(creep) {
        if(creep.body.some(b => b.type === TOUGH)) return true;
        if(creep.body.some(b => b.type === HEAL)) return true;
        if(creep.body.some(b => b.type >= MOVE)) return true;

        return false;
    }

    static getMaxPathDistanceToCommander() {
        if(this.detectAttack()) return 15;
        if(this.getCommander()?.pushDefense === true) return 15;

        return 30;
    }

    static getMaxDistanceToMinions() {
        if(this.detectAttack()) return 6;
        if(this.getCommander()?.pushDefense === true) return 6;

        return 8;
    }

    static getMinDistanceToCommander() {
        if(this.detectAttack()) return 1;
        if(this.getCommander()?.pushDefense === true) return 1;

        return 2;
    }
}