/// <reference path="../../.config/sa.d.ts" />

// import { setMissionEnd, setMissionStart } from "../utils";
import { CrSpC } from "../___utils___/constants/crazy-speed-cars";
import { M_SETTINGS } from "../___utils___/constants/mission-settings";
import { setMissionEnd, setMissionStart } from "../___utils___/utils";
import { Enemy } from "./Enemy.js";

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

export class CrazySpeedCarsClass {
  ENEMIES = [new Enemy()];

  main() {
    while (true) {
      wait(0);

      PLAYER_ACTOR.setAnimSpeed("SPRINT_CIVI", 1.3);

      /* ENEMIES */

      for (let i = 0; i < 10; i++) {
        if (!this.ENEMIES[i]) {
          this.ENEMIES.push(new Enemy());
        }

        this.ENEMIES[i].isDefined(() => {
          this.ENEMIES[i].add();
        });

        this.ENEMIES[i].isDead(() => {
          this.ENEMIES[i].destroy();
          this.ENEMIES[i].add();
        });

        this.ENEMIES[i].check();
      }
    }
  }

  run() {
    /* INIT */

    setMissionStart(() => {
      Camera.DoFade(M_SETTINGS.CAMERA_FADE.DEF, 1);
      wait(M_SETTINGS.CAMERA_FADE.DEF);

      World.SetLaRiots(true);
      World.SetCarDensityMultiplier(2.0);
      PLAYER_ACTOR.setProofs(true, true, true, false, false);
      Memory.Write(0xb7cee4, 1, 1, false);
      Memory.Write(0x969140, 1, 1, false);
      Memory.Write(0x96916c, 1, 1, false);
    });

    /* WORK */

    this.main();

    /* END */

    setMissionEnd(() => {
      for (let i = 0; i < this.CARS.length; i++) {
        this.CARS[i].delete();
        this.DRIVERS[i].delete();
      }
    });
  }

  check(SPHERE) {
    if (native("TEST_CHEAT", "PX"))
      PLAYER_ACTOR.setCoordinates(CrSpC.x + 7.5, CrSpC.y, CrSpC.z);
    const R = M_SETTINGS.RADIUS;
    return PLAYER_ACTOR.locateAnyMeans2D(CrSpC.x, CrSpC.y, R, R, SPHERE);
  }
}
