/// <reference path=".config/sa.d.ts" />

import { whilePlayerDefined } from "./missions/___utils___/utils";

import { TimerUtil } from "./missions/___utils___/components/Timer";

import { chilliadRaceINIT } from "./random-events/chilliad-race/init";
import { pedConflictINIT } from "./random-events/peds-conflict/init";
import { policeChaseINIT } from "./random-events/police-chase/init";

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

const Main = () => {
    const TIMER = new TimerUtil();

    while (true) {
        wait(0);
        if (Pad.TestCheat('RM')) PLAYER_ACTOR.setCoordinates(1247.49, -1396.88, 13.0156);

        if (!ONMISSION) {
            if (TIMER.isTimePassed_5sec(true)) {
                pedConflictINIT();
                policeChaseINIT();
                chilliadRaceINIT();
            }
        }
    }
};

whilePlayerDefined(PLAYER_CHAR);
Main();