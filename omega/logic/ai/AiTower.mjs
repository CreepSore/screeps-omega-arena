import { StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import CreepUtils from "../../utils/CreepUtils.mjs";
import { TOWER_RANGE } from "game/constants";

export default class AiTower {
    static test = [];

    /** @type {StructureTower} */
    _tower = null;

    /**
     * @param {StructureTower} tower
     */
    constructor(tower) {
        this._tower = tower;
    }

    tick() {
        const target = CreepUtils.getEnemyCreepsSortedByRange(this._tower)
            .filter(c => this._tower.getRangeTo(c) <= TOWER_RANGE)[0];

        if(!target) {
            return;
        }

        const attackStatus = this._tower.attack(target);
    }

    static tickAll() {
        const towers = getObjectsByPrototype(StructureTower).filter(t => t.my);

        for(const tower of towers) {
            new AiTower(tower).tick();
        }
    }
}
