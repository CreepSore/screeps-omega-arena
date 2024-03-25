export default class LimitManager {
    static getCollectorLimit() {
        return 3;
    }

    static getMeleeFighterLimit() {
        return 6;
    }

    static getRangedFighterLimit() {
        return 4;
    }

    static getHealerLimit() {
        return 4;
    }

    static getMinerLimit() {
        return 0;
    }

    static getBuilderLimit() {
        return 0;
    }

    static getCommanderLimit() {
        return 1;
    }

    static getDefenderLimit() {
        return 8;
    }

    static getTotalFighterLimit() {
        return this.getRangedFighterLimit() + this.getMeleeFighterLimit();
    }
}
