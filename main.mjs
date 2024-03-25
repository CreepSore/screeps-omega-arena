import { } from "game/constants";

import SpawnLogic from "./omega/logic/SpawnLogic.mjs";
import AiCollector from "./omega/logic/ai/AiCollector.mjs";
import AiFighter from "./omega/logic/ai/AiFighter.mjs";
import AiHealer from "./omega/logic/ai/AiHealer.mjs";
import AiTower from "./omega/logic/ai/AiTower.mjs";
import AiMiner from "./omega/logic/ai/AiMiner.mjs";
import AiBuilder from "./omega/logic/ai/AiBuilder.mjs";
import Commander from "./omega/utils/Commander.mjs";
import CreepUtils from "./omega/utils/CreepUtils.mjs";
import AiDefender from "./omega/logic/ai/AiDefender.mjs";

export function loop() {
    SpawnLogic.ensureCreeps();
    Commander.ensureCommander();

    for(const creep of CreepUtils.getMyCreeps()) {
        creep.previousPositions ??= [];
        creep.previousPositions.push({x: creep.x, y: creep.y});
    }

    AiCollector.tickAll();
    AiFighter.tickAll();
    AiHealer.tickAll();
    AiTower.tickAll();
    AiMiner.tickAll();
    AiBuilder.tickAll();
    AiDefender.tickAll();
}
