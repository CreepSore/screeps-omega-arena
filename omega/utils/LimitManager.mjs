export default class LimitManager {
    static getCollectorLimit() {
        return 2;
    }

    static getMeleeFighterLimit() {
        return 0;
    }

    static getRangedFighterLimit() {
        return 8;
    }

    static getHealerLimit() {
        return 2;
    }

    static getMinerLimit() {
        return 0;
    }

    static getBuilderLimit() {
        return 0;
    }

    static getDefenderLimit() {
        return 8;
    }

    static getTotalFighterLimit() {
        return this.getRangedFighterLimit() + this.getMeleeFighterLimit();
    }
}
