import { Creep } from "game/prototypes";
import CreepUtils from "../../utils/CreepUtils.mjs";
import { ATTACK, ERR_NOT_IN_RANGE, RANGED_ATTACK_DISTANCE_RATE } from "game/constants";
import LimitManager from "../../utils/LimitManager.mjs";
import Commander from "../../utils/Commander.mjs";
import { Visual } from "game/visual";
import { getObjectById } from "game/utils";
import HitboxUtils from "../../utils/HitboxUtils.mjs";

/**
 * @typedef {"melee" | "ranged" | "unknown"} FighterType
 */

export default class AiFighter {
    static test = [];

    /** @type {Creep} */
    _creep = null;
    /** @type {FighterType} */
    _type = "unknown";

    /**
     * @param {Creep} creep
     * @param {FighterType} type
     */
    constructor(creep, type) {
        this._creep = creep;
        this._type = type;
    }

    tick() {
        if(!this._creep.isCommander) {
            this._creep.commanderVisual = null;
        }
        else {
            if(!this._creep.commanderVisual) {
                this._creep.commanderVisual = new Visual(10, true);
            }

            this._creep.commanderVisual
                .clear()
                .text("C", {
                    x: this._creep.x,
                    y: this._creep.y,
                }, {
                    font: 0.75,
                    opacity: 0.7,
                    color: "#ff0000",
                    strokeWidth: 0.3,
                });

            this.checkBeginPush();
        }

        if(this._creep.isPushing) {
            // We call this here too to update the healer following target
            Commander.broadcastPushStatus(true);
            this.handlePush();
            return;
        }

        this.pushHandleSyncedAttack();

        if(this.attackPushTarget()) {
            return;
        }

        const spawnPos = CreepUtils.getMainSpawn();
        const targetPos = {
            x: spawnPos.x + (this._creep.isCommander ? 6 : 4),
            y: spawnPos.y,
        }

        this._creep.moveTo(targetPos);
    }

    checkBeginPush() {
        if(
            CreepUtils.getFighters().length === LimitManager.getTotalFighterLimit()
            && CreepUtils.getHealers().length === LimitManager.getHealerLimit()
        ) {
            Commander.broadcastPushStatus(true);
        }
    }

    handlePush() {
        const enemySpawn = CreepUtils.getEnemySpawns()[0];
        if(this._creep.isCommander && this._creep.getRangeTo(enemySpawn) < 10) {
            if(this.pushHandleSpawnAttack()) {
                return;
            }
        }

        this.pushHandleSyncedAttack();

        if(this.attackPushTarget()) {
            return;
        }

        if(this._creep.isCommander) {
            return this.handleCommanderActions();
        }

        if(this.handleNonCommanderActions()) {
            return;
        }
    }

    handleCommanderActions() {
        const isInUpperHalf = this._creep.y < 50;
        const targetHitbox = isInUpperHalf
            ? HitboxUtils.getUpperHitbox()
            : HitboxUtils.getLowerHitbox();

        if(CreepUtils.getEnemyCreeps().filter(c => HitboxUtils.isTouchingHitbox(c, targetHitbox)).length > 3) {
            if(this._creep.x > 25) {
                Commander.broadcastPushDefense(true);
            }
        }
        else
        {
            Commander.broadcastPushDefense(false);
        }

        if(this._creep.pushDefense) {
            return;
        }

        if(this.waitForMinions()) {
            return;
        }

        if(this.pushHandleSpawnAttack()) {
            return;
        }

        console.log("COMMANDER IS IDLING!!!");
        return;
    }

    handleNonCommanderActions() {
        const commander = Commander.getCommander();

        if(this._creep.getRangeTo(commander) <= Commander.getMinDistanceToCommander()) {
            return true;
        }

        const moveTo = commander.previousPositions[commander.previousPositions.length - 1];
        if(moveTo) {
            this._creep.moveTo(moveTo, {ignore: [commander]});
        }

        return true;
    }

    waitForMinions() {
        const longestDistance = Math.max(...[
            ...CreepUtils.getFighters(),
            ...CreepUtils.getHealers(),
        ].map(c => c.getRangeTo(this._creep)));

        const longestPath = Commander.getLongestPathToCommander();

        if(
            longestDistance < Commander.getMaxDistanceToMinions()
            || longestPath > Commander.getMaxPathDistanceToCommander()
        ) {
            return false;
        }

        return true;
    }

    pushHandleSyncedAttack() {
        if(this._creep.pushTarget?.exists === true) {
            return;
        }

        const inRange = CreepUtils.getEnemyCreepsSortedByRange(this._creep)
            .filter(ec => (Commander.detectAttack() || Commander.isDangerousCreep(ec)) && CreepUtils.getAverageDistance(CreepUtils.getFighters(), ec) < 9)
            .sort((a, b) => CreepUtils.getAverageDistance(CreepUtils.getFighters(), a) - CreepUtils.getAverageDistance(CreepUtils.getFighters(), b))[0];

        if(!inRange) {
            return;
        }

        Commander.broadcastAttackTarget(inRange);

        return true;
    }

    pushHandleSpawnAttack() {
        const enemySpawns = CreepUtils.getEnemySpawns();
        const target = this._creep.findClosestByPath(enemySpawns);

        if(!target) {
            return false;
        }

        if(!this._creep.pushTarget && this._creep.getRangeTo(target) < 5) {
            Commander.broadcastAttackTarget(target);
        }

        const attackStatus = this._type === "melee"
            ? this._creep.attack(target)
            : this._creep.rangedAttack(target);

        if(attackStatus === ERR_NOT_IN_RANGE) {
            this._creep.moveTo(target);
        }

        return true;
    }

    attackPushTarget() {
        if(!this._creep.pushTarget) {
            return false;
        }

        // @ts-ignore
        const resolvedTarget = getObjectById(this._creep.pushTarget.id);

        if(!resolvedTarget || !resolvedTarget.exists) {
            Commander.broadcastAttackTarget(null);
            return false;
        }

        if(this._type === "melee") {
            const meleeAttackStatus = this._creep.attack(resolvedTarget);
            if(meleeAttackStatus === ERR_NOT_IN_RANGE) {
                this._creep.moveTo(resolvedTarget);
            }
        }
        else if(this._type === "ranged") {
            const rangedAttackStatus = this._creep.rangedAttack(resolvedTarget);
            if(rangedAttackStatus === ERR_NOT_IN_RANGE) {
                this._creep.moveTo(resolvedTarget);
            }
        }

        return true;
    }

    attackNearest() {
        const target = CreepUtils.getEnemyCreepsSortedByRange(this._creep, true)
            .sort((a, b) => {
                const aHasAttack = a.body.some(b => b.type === ATTACK) ? 1 : 0;
                const bHasAttack = b.body.some(b => b.type === ATTACK) ? 1 : 0;
                return bHasAttack - aHasAttack;
            })
            [0];

        if(!target) {
            console.log("FIGHTER " + this._creep.id + " IDLING!!!");
            return;
        }

        if(this._type === "melee") {
            const meleeAttackStatus = this._creep.attack(target);
            if(meleeAttackStatus === ERR_NOT_IN_RANGE) {
                this._creep.moveTo(target);
            }
        }
        else if(this._type === "ranged") {
            const rangedAttackStatus = this._creep.rangedAttack(target);
            if(rangedAttackStatus === ERR_NOT_IN_RANGE) {
                this._creep.moveTo(target);
            }
        }
    }

    static tickAll() {
        const creeps = CreepUtils.getFighters().sort((a, b) => Number(b.isCommander === true) - Number(a.isCommander === true));

        for(const creep of creeps) {
            /** @type {FighterType} */
            let type = "unknown";
            if(CreepUtils.creepIsMeleeFighter(creep)) {
                type = "melee";
            }
            else if(CreepUtils.creepIsRangedFighter(creep)) {
                type = "ranged";
            }

            new AiFighter(creep, type).tick();
        }
    }
}
