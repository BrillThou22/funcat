/// <reference path="../../../.config/sa.d.ts" />

import {
  getRandomFloatNumber,
  getRandomIntNumber,
} from "../../___utils___/utils";

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

const getEnemyFromGroup = (group) => {
  const gr1 = [596, 597, 598, 599, 470, 490];
  const gr2 = [467, 466, 451, 412, 402];
  const gr3 = [521, 522, 523, 461, 463];
  const gr4 = [502, 494, 434, 504, 411];
  const gr5 = [422];

  if (group === 0) return { pedId: getRandomIntNumber(280, 289), carId: gr1[getRandomIntNumber(0, gr1.length)], };
  if (group === 1) return { pedId: getRandomIntNumber(102, 105), carId: gr2[getRandomIntNumber(0, gr2.length)], };
  if (group === 2) return { pedId: getRandomIntNumber(280, 289), carId: gr3[getRandomIntNumber(0, gr3.length)], };
  if (group === 3) return { pedId: getRandomIntNumber(108, 117), carId: gr4[getRandomIntNumber(0, gr4.length)], };
  if (group === 4) {
    let rand = getRandomIntNumber(0, 4);

    if (rand === 0) rand = 178;
    if (rand === 1) rand = 244;
    if (rand === 2) rand = 246;
    if (rand === 3) rand = 256;

    return {
      pedId: rand,
      carId: gr5[0],
    };
  }

  return { pedId: getRandomIntNumber(280, 289), carId: gr1[getRandomIntNumber(0, gr1.length)], };
};

export class Enemy {
  SPEC_PSG = Char.prototype; // Шлюха в кузове, танцующая.
  PASSANGER = Char.prototype;
  DRIVER = Char.prototype;

  CAR = Car.prototype;

  constructor() {
    this.PASSANGER = null;
    this.SPEC_PSG = null;
    this.DRIVER = null;
    this.CAR = null;
  }

  isDead() {
    if (Char.IsDead(this.DRIVER) || this.CAR.getHealth() < 200 || !this.DRIVER.isInCar(this.CAR)) return true;
    return false;
  }

  isDefined() {
    if (this.DRIVER && this.CAR) return Car.DoesExist(this.CAR) && Char.DoesExist(this.DRIVER);
    return false;
  }

  add(P_CAR) {
    let x = getRandomFloatNumber(-50.0, 50.0);

    const c1 = P_CAR.getOffsetInWorldCoords(x, -50.0, 1.0);
    const XYZ = Path.GetClosestCarNodeWithHeading(c1.x, c1.y, c1.z);

    XYZ.nodeX += getRandomFloatNumber(-5.5, 5.5);
    XYZ.nodeY += getRandomFloatNumber(-5.5, 5.5);

    let group = getEnemyFromGroup(getRandomIntNumber(0, 5));

    Streaming.RequestModel(372); // WEAPON_TEC9
    Streaming.RequestModel(group.pedId);
    Streaming.RequestModel(group.carId);
    Streaming.RequestAnimation("STRIP");
    Streaming.LoadAllModelsNow();

    this.CAR = Car.Create(group.carId, XYZ.nodeX, XYZ.nodeY, XYZ.nodeZ);
    this.DRIVER = Char.CreateInsideCar(this.CAR, 20, group.pedId);
    this.PASSANGER = Char.CreateAsPassenger(this.CAR, 20, group.pedId, 0);

    const { pedId } = group;

    if (pedId === 178 || pedId === 244 || pedId === 246 || pedId === 256) {
      this.SPEC_PSG = Char.Create(20, pedId, XYZ.nodeX, XYZ.nodeY, XYZ.nodeZ);

      this.SPEC_PSG.attachToBike(this.CAR, 0.0, -1.5, 0.75, 1, 360.0, 70.0, 0);

      let anim = getRandomIntNumber(0, 3);

      if (anim === 0) anim = "STR_A2B";
      if (anim === 1) anim = "STR_B2A";
      if (anim === 2) anim = "STR_B2C";

      Task.PlayAnimNonInterruptable(this.SPEC_PSG, "STR_A2B", "STRIP", 10.0, true, true, true, true, -1);

      this.CAR.changeColor(0, 0);
    }

    this.PASSANGER.giveWeapon(32, 1000);

    Task.DriveBy(this.PASSANGER, PLAYER_ACTOR, P_CAR, 0.0, 0.0, 0.0, 360.0, 4, 1, 360);

    Streaming.MarkModelAsNoLongerNeeded(group.pedId);
    Streaming.MarkModelAsNoLongerNeeded(group.carId);
    Streaming.MarkModelAsNoLongerNeeded(372);

    this.CAR.switchSiren(true);
    this.CAR.setHeading(P_CAR.getHeading());
    this.CAR.setProofs(false, true, false, true, false);

    this.DRIVER.setCanBeKnockedOffBike(this.CAR);
    this.DRIVER.setProofs(true, true, true, true, true);

    this.PASSANGER.setAccuracy(60);
    this.PASSANGER.setProofs(true, true, true, true, true);
    this.PASSANGER.setCanBeKnockedOffBike(this.CAR);

    StuckCarCheck.AddWithWarp(this.CAR, 15.0, 2000, true, false, false, -1);

    this.CAR.wanderRandomly();
    this.CAR.setDrivingStyle(2);
    this.CAR.setTraction(2.4);

    this.CAR.setHealth(650);
    this.CAR.setForwardSpeed(50.0);
    this.CAR.setCruiseSpeed(150.0);
  }

  check(P_CAR = Car.prototype) {
    if (PLAYER_ACTOR.locateAnyMeansCar2D(this.CAR, 70.0, 70.0, false)) {
      if (StuckCarCheck.IsCarStuck(this.CAR)) {
        this.remove();
        this.add(P_CAR);
      }

      const { x, y, z } = P_CAR.getOffsetInWorldCoords(5.0, 2.0, 0.0);
      this.CAR.gotoCoordinates(x, y, z);
    } else {
      this.destroy(false);
      this.add(P_CAR);
    }
  }

  destroy(withExplode = true) {
    if (withExplode) this.CAR.explode();

    this.DRIVER.delete();
    this.PASSANGER.delete();

    if (Char.DoesExist(this.SPEC_PSG)) {
      this.SPEC_PSG.delete();
      this.SPEC_PSG.markAsNoLongerNeeded();
    }

    this.CAR.markAsNoLongerNeeded();
    this.DRIVER.markAsNoLongerNeeded();
    this.PASSANGER.markAsNoLongerNeeded();
  }

  remove() {
    if (Char.DoesExist(this.SPEC_PSG)) this.SPEC_PSG.markAsNoLongerNeeded();

    this.CAR.markAsNoLongerNeeded();
    this.DRIVER.markAsNoLongerNeeded();
    this.PASSANGER.markAsNoLongerNeeded();
  }
}
