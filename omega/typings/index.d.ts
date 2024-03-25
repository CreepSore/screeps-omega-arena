import { Visual } from "game/visual";

declare type CreepJob =
    "melee_fighter"
    | "ranged_fighter"
    | "commander"
    | "defender"
    | "healer"
    | "collector"
    | "miner"
    | "builder";

declare module "game/prototypes" {
    declare interface Creep {
        job?: CreepJob;
        myId: number;
        jobId?: number;
        healTarget?: GameObject;
        isPushing?: boolean;
        pushTarget?: GameObject;
        isCommander?: boolean;
        commanderVisual?: Visual;
        previousPositions?: Position[];
        pushDefense?: boolean;
    }
}