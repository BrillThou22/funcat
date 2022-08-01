/// <reference path="../../.config/sa.d.ts" />

import { TimerUtil } from "../___utils___/components/Timer";
import { CyCe } from "../___utils___/constants/crazy-chase";
import { M_SETTINGS } from "../___utils___/constants/mission-settings";
import {
  setMissionEnd,
  setMissionStart,
  modelActWithCall,
  getRandomIntNumber,
  getRandomFloatNumber,
  getRandNumExtended,
} from "../___utils___/utils";

import { HelicopterEnemy } from "./classes/Helicopter";
import { Bonus } from "./classes/Bonus";
import { Enemy } from "./classes/Enemy";
import { RUS } from "./replics";

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

const GXT = RUS.GXT;

const SCORE_ADD = {
  ENEMY_DEAD: "ENEMY_DEAD",
  HELICOPTER_DEAD: "HELICOPTER_DEAD",
};

const getRandomWeaponId = () => getRandNumExtended(26, 35, [34, 33]);
const missionFailedCheck = (P_CAR, DRIVER) => Car.IsDead(P_CAR) || Char.IsDead(PLAYER_ACTOR) || Char.IsDead(DRIVER);
const getHpAlpha = (hp) => Math.floor(255 - (hp * 255) / 100);

export class CrazyChaseClass {
  HELI = new HelicopterEnemy();
  ENEMIES = [new Enemy()];
  BONUS = new Bonus();
  TIMER = new TimerUtil();
  SCORE = 0;

  run() {
    const MODS = { BOB_CAT: 422 };

    setMissionStart(() => {
      World.SetCarDensityMultiplier(1.0);
      PLAYER_CHAR.setControl(false);
      Hud.DisplayRadar(0);
    });

    /* INIT */

    const P_CAR = Car.prototype;

    modelActWithCall(MODS.BOB_CAT, () => {
      P_CAR = Car.Create(MODS.BOB_CAT, -2766.15, 2329.683, 71.7076);
    });

    const DRIVER = Char.CreateRandomAsDriver(P_CAR);
    DRIVER.setCanBeKnockedOffBike(P_CAR);

    P_CAR.setProofs(false, true, true, false, false);
    P_CAR.setHeading(205.0);
    P_CAR.changeColor(0, 0);
    P_CAR.setTraction(3.0);
    P_CAR.setHealth(2000);
    P_CAR.setHeavy(1);

    PLAYER_ACTOR.attachToBike(P_CAR, 0.0, -1.5, 0.75, 1, 360.0, 70.0, 0);
    PLAYER_ACTOR.setHeading(9.92232);

    let sX, sY;

    let locId = getRandomIntNumber(0, 4);

    if (locId === 0) {
      sX = getRandomFloatNumber(-2803.0, -1792.0);
      sY = getRandomFloatNumber(1350.0, 1430.0);
    }

    if (locId === 1) {
      sX = getRandomFloatNumber(-2803.0, -1992.0);
      sY = getRandomFloatNumber(2570.0, 2675.0);
    }

    if (locId === 2) {
      sX = -1223.82;
      sY = 1000.15;
    }

    if (locId === 3) {
      sX = 1649.23;
      sY = 854.953;
    }

    P_CAR.setCoordinates(sX, sY, -100.0);
    Streaming.RequestCollision(sX, sY);

    wait(2000);

    const sXYZ = Path.GetClosestCarNodeWithHeading(sX, sY, 5.0);

    P_CAR.setCoordinates(sXYZ.nodeX, sXYZ.nodeY, sXYZ.nodeZ);
    P_CAR.setHeading(sXYZ.angle);

    Camera.RestoreJumpcut();
    Camera.SetBehindPlayer();

    let wId = getRandomWeaponId();

    modelActWithCall(Weapon.GetModel(wId), () => { PLAYER_ACTOR.giveWeapon(wId, 9999); });

    Camera.DoFade(M_SETTINGS.CAMERA_FADE.DEF, 1);

    PLAYER_CHAR.setControl(true);

    Hud.Display(1);

    P_CAR.wanderRandomly();
    P_CAR.setDrivingStyle(3);
    P_CAR.setForwardSpeed(35.0);
    P_CAR.setCruiseSpeed(30.0);
    P_CAR.setRandomRouteSeed(100);
    P_CAR.setCanBurstTires(false);

    StuckCarCheck.AddWithWarp(P_CAR, 7.5, 1600, true, false, false, -1);

    PLAYER_CHAR.setFastReload(true);
    PLAYER_ACTOR.setHealth(250);
    PLAYER_ACTOR.addArmor(100);

    Text.AddLabel(GXT.MAIN.SCORE.K, GXT.MAIN.SCORE.T);
    Text.AddLabel(GXT.MAIN.CARHP.K, GXT.MAIN.CARHP.T);
    Text.AddLabel(GXT.MAIN.HD.K, GXT.MAIN.HD.T);
    Text.AddLabel(GXT.MAIN.CD.K, GXT.MAIN.CD.T);
    Text.AddLabel(GXT.СTRL.TAB.K, GXT.СTRL.TAB.T);

    this.TIMER.update();

    /* WORK */

    while (true) {
      wait(0);

      PLAYER_ACTOR.setAnimSpeed("SAWNOFF_RELOAD", 10.0);
      PLAYER_ACTOR.setAnimSpeed("COLT45_CROUCHRELOAD", 10.0);

      Text.UseCommands(true);
      Text.ClearHelp();

      const CarHp = P_CAR.getHealth() / (2000 / 100);
      const scoreColor = getHpAlpha(this.SCORE);

      Text.SetFont(2);
      Text.SetColor(255, 255, 255, 255);
      Text.SetDropshadow(1, 0, 0, 0, 255);
      Text.DisplayWithNumber(5.0, 7.0, GXT.MAIN.SCORE.K, this.SCORE);

      Text.SetFont(2);
      Text.SetColor(0, 0, 255, 255 - scoreColor);
      Text.SetDropshadow(0, 0, 0, 0, 255);
      Text.DisplayWithNumber(5.0, 7.0, GXT.MAIN.SCORE.K, this.SCORE);

      const hpColor = getHpAlpha(CarHp);

      Text.SetColor(255, 255, 255, 255);
      Text.SetDropshadow(1, 0, 0, 0, 255);
      Text.DisplayWithNumber(5.0, 17.0, GXT.MAIN.CARHP.K, CarHp);

      Text.SetColor(255, 0, 0, hpColor);
      Text.SetDropshadow(0, 0, 0, 0, 255);
      Text.DisplayWithNumber(5.0, 17.0, GXT.MAIN.CARHP.K, CarHp);

      /* TIMER-WORK */

      if (this.TIMER.isTimePassed_15sec()) {
        if (!this.BONUS.BONUS.HSRocket && !this.BONUS.BONUS.Minigun && !this.BONUS.BONUS.Rpg7) {
          this.TIMER.update();
          let wId = getRandomWeaponId();
          modelActWithCall(Weapon.GetModel(wId), () => { PLAYER_ACTOR.giveWeapon(wId, 9999); });
        }
      }

      /* SCORE-CHECKS */

      if (this.SCORE >= 100) {
        Text.PrintBig("M_PASS", 2500, 4);
        PLAYER_CHAR.addScore(10000);
        wait(2500);
        break;
      }

      if (missionFailedCheck(P_CAR, DRIVER)) {
        Text.PrintBig("M_FAIL", 2500, 1);
        wait(2500);
        break;
      }

      /* IS-CAR-STUCK */

      if (StuckCarCheck.IsCarStuck(P_CAR) || P_CAR.isUpsidedown()) {
        const { x, y, z } = P_CAR.getOffsetInWorldCoords(0.0, 100.0, 0.0);
        const XYZ = Path.GetClosestCarNodeWithHeading(x, y, z);
        const { nodeX, nodeY, nodeZ } = XYZ;
        const angle = P_CAR.getHeading();

        P_CAR.setCoordinates(nodeX, nodeY, nodeZ + 3.0);
        P_CAR.setHeading(angle);

        P_CAR.setForwardSpeed(30.0);
        P_CAR.setCruiseSpeed(70.0);
      }

      /* CHECK-ENEMIES */

      for (let i = 0; i < 5; i++) {
        if (!this.ENEMIES[i]) {
          this.ENEMIES.push(new Enemy());
          this.ENEMIES[i].add(P_CAR);
        }

        if (!this.ENEMIES[i].isDefined()) this.ENEMIES[i].add(P_CAR);

        if (this.ENEMIES[i].isDead()) {
          if (this.ENEMIES[i].CAR.hasBeenDamagedByChar(PLAYER_ACTOR)) {
            this.addScore(SCORE_ADD.ENEMY_DEAD);
            Text.PrintNow(GXT.MAIN.CD.K, 1500, 1);

            const armor = PLAYER_ACTOR.getArmor();
            PLAYER_ACTOR.addArmor(armor + 15);

            const hp = P_CAR.getHealth();
            if (hp <= 1850) P_CAR.setHealth(hp + 150);
            else P_CAR.setHealth(2000);
          }

          this.ENEMIES[i].destroy();
          this.ENEMIES[i].add(P_CAR);
        } else this.ENEMIES[i].check(P_CAR);
      }

      /* HELI-CHECKS */

      if (!this.HELI.isDefined()) this.HELI.add(P_CAR);
      else {
        if (this.HELI.isDead()) {
          this.HELI.destroy(true);
          this.HELI.add(P_CAR);

          this.addScore(SCORE_ADD.HELICOPTER_DEAD);
          Text.PrintNow(GXT.MAIN.HD.K, 1500, 1);

          const armor = PLAYER_ACTOR.getArmor();
          PLAYER_ACTOR.addArmor(armor + 15);

          const hp = P_CAR.getHealth();
          if (hp <= 1800) P_CAR.setHealth(hp + 200);

        } else this.HELI.check(P_CAR);

      }

      /* BONUSES-CHECK */

      this.BONUS.check(this.SCORE, P_CAR);
    }

    Text.UseCommands(false);

    setMissionEnd(() => {
      Text.RemoveLabel(GXT.MAIN.SCORE.K, GXT.MAIN.SCORE.T);
      Text.RemoveLabel(GXT.MAIN.CARHP.K, GXT.MAIN.CARHP.T);
      Text.RemoveLabel(GXT.MAIN.HD.K, GXT.MAIN.HD.T);
      Text.RemoveLabel(GXT.MAIN.CD.K, GXT.MAIN.CD.T);
      Text.RemoveLabel(GXT.СTRL.TAB.K, GXT.СTRL.TAB.T);

      PLAYER_ACTOR.detachFromCar();
      PLAYER_CHAR.setFastReload(false);
      PLAYER_ACTOR.setAnimSpeed("SAWNOFF_RELOAD", 1.0);
      PLAYER_ACTOR.setCoordinates(CyCe.x + 7.5, CyCe.y, CyCe.z);
      World.ClearArea(CyCe.x + 7.5, CyCe.y, CyCe.z, 300.0, true);
      Streaming.RequestCollision(CyCe.x, CyCe.y);

      Hud.DisplayRadar(1);
      Clock.SetTimeScale(1.0);

      for (let i = 0; i < 5; i++) {
        if (!this.ENEMIES[i].isDefined()) this.ENEMIES[i].destroy(false);
      }

      this.HELI.destroy();
      this.BONUS.remove();
      P_CAR.markAsNoLongerNeeded();
      DRIVER.markAsNoLongerNeeded();

      this.SCORE = 0;
      this.ENEMIES = [];
      this.BONUS.remove();
    });
  }

  check(SPHERE) {
    if (native("TEST_CHEAT", "PZ")) PLAYER_ACTOR.setCoordinates(CyCe.x + 7.5, CyCe.y, CyCe.z);
    const R = M_SETTINGS.RADIUS;
    return PLAYER_ACTOR.locateAnyMeans2D(CyCe.x, CyCe.y, R, R, SPHERE);
  }

  addScore(cause) {
    if (cause === SCORE_ADD.ENEMY_DEAD) this.SCORE += 1;
    if (cause === SCORE_ADD.HELICOPTER_DEAD) this.SCORE += 5;
  }
}
