import { Creep, GameObject } from "game/prototypes";
import CreepUtils from "./CreepUtils.mjs";

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

    static ensureCommander() {
        const commanders = CreepUtils.getCommanders();

        if(commanders.length > 0) {
            return;
        }

        const enemySpawns = CreepUtils.getEnemySpawns();

        const newCommander = CreepUtils.getMeleeFighters()
            .sort((a, b) => a.getRangeTo(enemySpawns[0]) - b.getRangeTo(enemySpawns[0]))[0];

        if(newCommander) {
            newCommander.isCommander = true;
        }
    }

    static getCommander() {
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

    static getMaxPathDistanceToCommander() {
        return 20;
    }

    static getMaxDistanceToMinions() {
        return 15;
    }

    static getMinDistanceToCommander() {
        return 3;
    }
}