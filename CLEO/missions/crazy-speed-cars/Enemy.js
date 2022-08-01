/// <reference path="../../.config/sa.d.ts" />

import { AccHack } from "../___utils___/acc-hack";
import { getRandomFloatNumber, modelActionWithCallback } from "../___utils___/utils";

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

export class Enemy {
  CAR = Car.prototype;
  DRIVER = Char.prototype;

  constructor() {
    this.CAR = null;
    this.DRIVER = null;
  }

  isDefined(callback = () => {}) {
    if (!this.CAR || !this.DRIVER) {
      callback();
      return true;
    }
  }

  isDead(callback = () => {}) {
    if (Car.IsDead(this.CAR) || Char.IsDead(this.DRIVER)) {
      callback();
      return true;
    }
  }

  add() {
    let globX = 0.0;
    let globY = 0.0;
    let globZ = 0.0;
    let globAngle = 0.0;

    let attemps = 0;

    while (true) {
      wait(0);
      let locX = getRandomFloatNumber(-100.0, 100.0);
      let locY = getRandomFloatNumber(-100.0, 100.0);

      const { x, y, z } = PLAYER_ACTOR.getOffsetInWorldCoords(0.0, 0.0, 0.0);

      locX += x;
      locY += y;

      const { nodeX, nodeY, nodeZ, angle } = Path.GetClosestCarNodeWithHeading(
        locX,
        locY,
        z
      );

      if (!PLAYER_ACTOR.locateAnyMeans2D(nodeX, nodeY, 50.0, 50.0, 0)) {
        globX = nodeX + getRandomFloatNumber(-3.0, 3.0);
        globY = nodeY + getRandomFloatNumber(-3.0, 3.0);
        globZ = nodeZ;
        globAngle = angle;

        break;
      }

      attemps += 1;

      if (attemps > 5) break;
    }

    modelActionWithCallback(415, () => {
      this.CAR = Car.Create(415, globX, globY, globZ);
      this.DRIVER = Char.CreateRandomAsDriver(this.CAR);
    });

    this.CAR.setHeading(globAngle);

    StuckCarCheck.Add(this.CAR, 10.0, 2000);

    this.CAR.setForwardSpeed(30.0);

    modelActionWithCallback(415, () => {
      const { x, y, z } = PLAYER_ACTOR.getOffsetInWorldCoords(0.0, 0.0, -20.0);
      const C = Car.Create(415, x, y, z);
      Task.CarMission(this.DRIVER, this.CAR, C, 3, 1000.0, 16);
      C.delete();
      C.markAsNoLongerNeeded();
    });

    this.CAR.setHealth(800);
  }

  check() {
    if (PLAYER_ACTOR.locateAnyMeansCar2D(this.CAR, 10.0, 10.0, 0)) {
      this.CAR.setStrong(false);
    } else {
      this.CAR.setStrong(true);
    }

    if (
      StuckCarCheck.IsCarStuck(this.CAR) &&
      !PLAYER_ACTOR.locateAnyMeansCar2D(this.CAR, 25.0, 25.0, 0)
    ) {
      const { x, y, z } = this.CAR.getOffsetInWorldCoords(0.0, 50.0, 0.0);
      const { nodeX, nodeY, nodeZ, angle } = Path.GetClosestCarNodeWithHeading(
        x,
        y,
        z
      );

      this.CAR.setCoordinates(nodeX, nodeY, nodeZ);
      this.CAR.setHeading(angle);
      this.CAR.setForwardSpeed(30.0);

      modelActionWithCallback(415, () => {
        const { x, y, z } = PLAYER_ACTOR.getOffsetInWorldCoords(
          0.0,
          0.0,
          -20.0
        );
        const C = Car.Create(415, x, y, z);
        Task.CarMission(this.DRIVER, this.CAR, C, 3, 1000.0, 16);
        C.delete();
        C.markAsNoLongerNeeded();
      });
    }

    if (!PLAYER_ACTOR.locateAnyMeansCar2D(this.CAR, 120.0, 120.0, 0)) {
      this.destroy(true);
    } else {
      AccHack(this.CAR, { isBot: true });
    }
  }

  destroy(isNeedDelete = false) {
    if (isNeedDelete) {
      this.CAR.delete();
      this.DRIVER.delete();
    }

    this.CAR.markAsNoLongerNeeded();
    this.DRIVER.markAsNoLongerNeeded();
  }
}
