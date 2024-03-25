import Commander from "../utils/Commander.mjs";
import CreepUtils from "../utils/CreepUtils.mjs";
import LimitManager from "../utils/LimitManager.mjs";

export default class SpawnLogic {
    static ensureCreeps() {
        if(!CreepUtils.getMainSpawn()) {
            return;
        }

        if(Commander.getCommander()?.isPushing === true) {
            if(this.ensureDefenders()) {
                return;
            }
        }

        if(this.ensureMiners()) {
            return;
        }

        if(this.ensureCollectors()) {
            return;
        }

        if(this.ensureBuilders()) {
            return;
        }

        if(this.ensureFighters()) {
            return;
        }

        if(this.ensureHealers()) {
            return;
        }

        if(this.ensureDefenders()) {
            return;
        }
    }

    /**
     * @static
     * @return {boolean} Returns true if a spawn has been requested
     * @memberof SpawnLogic
     */
    static ensureBuilders() {
        if(CreepUtils.getBuilders().length < LimitManager.getBuilderLimit()) {
            const spawnResult = CreepUtils.getMainSpawn()?.spawnCreep?.(CreepUtils.builderBody);
            if(spawnResult.object) {
                console.log("Spawned builder");
                spawnResult.object.job = "builder";
            }
            return true;
        }

        return false;
    }

    /**
     * @static
     * @return {boolean} Returns true if a spawn has been requested
     * @memberof SpawnLogic
     */
    static ensureMiners() {
        if(CreepUtils.getMiners().length < LimitManager.getMinerLimit()) {
            const spawnResult = CreepUtils.getMainSpawn()?.spawnCreep?.(CreepUtils.minerBody);
            if(spawnResult.object) {
                console.log("Spawned miner");
                spawnResult.object.job = "miner";
            }
            return true;
        }

        return false;
    }

    /**
     * @static
     * @return {boolean} Returns true if a spawn has been requested
     * @memberof SpawnLogic
     */
    static ensureHealers() {
        if(CreepUtils.getHealers().length < LimitManager.getHealerLimit()) {
            const spawnResult = CreepUtils.getMainSpawn()?.spawnCreep?.(CreepUtils.healerBody);
            if(spawnResult.object) {
                spawnResult.object.job = "healer";
            }
            return true;
        }

        return false;
    }

    /**
     * @static
     * @return {boolean} Returns true if a spawn has been requested
     * @memberof SpawnLogic
     */
    static ensureCollectors() {
        if(CreepUtils.getCollectors().length < LimitManager.getCollectorLimit()) {
            const spawnResult = CreepUtils.getMainSpawn()?.spawnCreep?.(CreepUtils.collectorBody);
            if(spawnResult.object) {
                console.log("Spawned collector");
                spawnResult.object.job = "collector";
            }
            return true;
        }

        return false;
    }

    /**
     * @static
     * @return {boolean} Returns true if a spawn has been requested
     * @memberof SpawnLogic
     */
    static ensureFighters() {
        // We spawn ranged fighters first so they end up at the top of the formation
        if(this.ensureRangedFighters()) {
            return true;
        }

        if(this.ensureMeleeFighters()) {
            return true;
        }

        return false;
    }

    /**
     * @static
     * @return {boolean} Returns true if a spawn has been requested
     * @memberof SpawnLogic
     */
    static ensureMeleeFighters() {
        if(CreepUtils.getMeleeFighters().length < LimitManager.getMeleeFighterLimit()) {
            const spawnResult = CreepUtils.getMainSpawn()?.spawnCreep?.(CreepUtils.meleeFighterBody);
            if(spawnResult.object) {
                console.log("Spawned Melee Fighter");
                spawnResult.object.job = "melee_fighter";
            }
            return true;
        }

        return false;
    }

    /**
     * @static
     * @return {boolean} Returns true if a spawn has been requested
     * @memberof SpawnLogic
     */
    static ensureRangedFighters() {
        if(CreepUtils.getRangedFighters().length < LimitManager.getRangedFighterLimit()) {
            const spawnResult = CreepUtils.getMainSpawn()?.spawnCreep?.(CreepUtils.rangedFighterBody);
            if(spawnResult.object) {
                console.log("Spawned Ranged Fighter");
                spawnResult.object.job = "ranged_fighter";
            }
            return true;
        }

        return false;
    }

    static ensureDefenders() {
        if(CreepUtils.getDefenders().length < LimitManager.getDefenderLimit()) {
            const spawnResult = CreepUtils.getMainSpawn()?.spawnCreep?.(CreepUtils.defenderBody);
            if(spawnResult.object) {
                console.log("Spawned Defender");
                spawnResult.object.job = "defender";
            }
            return true;
        }

        return false;
    }
}
