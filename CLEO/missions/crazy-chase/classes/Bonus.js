/// <reference path="../../../.config/sa.d.ts" />

import { getRandomIntNumber, modelActWithCall } from "../../___utils___/utils";

import { TimerUtil } from "../../___utils___/components/Timer";
import { RUS } from "../replics";

const HS_ROCKET = 36;
const MINIGUN = 38;
const RPG = 35;

const MP5 = 29;

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

export class Bonus {
  BONUS = { Rpg7: false, SlowMo: false, FixCar: false, Minigun: false, HSRocket: false, };
  SM = { value: 100.0, isActivated: false, isButtonPressed: false, };
  TIMER = new TimerUtil();
  TIMER_2 = new TimerUtil();
  isEnabled = false;
  scoreStep = -1;

  addRPG7() {
    this.BONUS.Rpg7 = true;
    modelActWithCall(Weapon.GetModel(RPG), () => { PLAYER_ACTOR.giveWeapon(RPG, 3) });
    Sound.AddOneOffSound(0.0, 0.0, 0.0, 1054);
    Text.PrintBigString("~Y~BONUS~W~: RPG-7.", 1000, 5);
  }

  addSlowMo() {
    this.BONUS.SlowMo = true;
    Sound.AddOneOffSound(0.0, 0.0, 0.0, 1054);
    Text.PrintBigString("~Y~BONUS~W~: Slow Motion.", 1000, 5);
  }

  addFixCar(P_CAR = Car.prototype) {
    P_CAR.fix();
    P_CAR.setHealth(2000);
    this.BONUS.FixCar = false; // (!)
    this.isEnabled = false;
    Sound.AddOneOffSound(0.0, 0.0, 0.0, 1054);
    Text.PrintBigString("~Y~BONUS~W~: Your car fixed.", 1000, 5);
  }

  addMinigun() {
    this.BONUS.Minigun = true;
    modelActWithCall(Weapon.GetModel(MINIGUN), () => { PLAYER_ACTOR.giveWeapon(MINIGUN, 115) });
    Sound.AddOneOffSound(0.0, 0.0, 0.0, 1054);
    Text.PrintBigString("~Y~BONUS~W~: Minigun.", 1000, 5);
  }

  addHSRocket() {
    this.BONUS.HSRocket = true;
    modelActWithCall(Weapon.GetModel(HS_ROCKET), () => { PLAYER_ACTOR.giveWeapon(HS_ROCKET, 3) });
    Sound.AddOneOffSound(0.0, 0.0, 0.0, 1054);
    Text.PrintBigString("~Y~BONUS~W~: HOMING MISSILE.", 1000, 5);
  }

  addMain(P_CAR) {
    const BonusId = getRandomIntNumber(0, 5);

    if (BonusId === 0) this.addRPG7();
    if (BonusId === 1) this.addSlowMo();
    if (BonusId === 2) this.addFixCar(P_CAR);
    if (BonusId === 3) this.addMinigun();
    if (BonusId === 4) this.addHSRocket();

    this.TIMER.update();
    this.isEnabled = true;
  }

  checkScore(SCORE) {
    let step = 20;

    for (let i = 0; i < 10; i++) {
      if (SCORE >= step && SCORE < step + 20) {
        if (this.scoreStep !== i) {
          this.scoreStep = i;
          return true;
        }
      }

      if (step > 150) return false;
      else step += 20;
    }
  }

  check(SCORE = 0, P_CAR) {
    if (this.checkScore(SCORE) && !this.isEnabled) this.addMain(P_CAR);

    if (this.isEnabled) {
      const callback = () => {
        PLAYER_ACTOR.giveWeapon(MP5, 9999);
        this.destroy();
      };

      /* Если закончилась, значит бонус исчерпан - даём МП5, вызываем дестрой */

      if (this.BONUS.Rpg7 && PLAYER_ACTOR.getAmmoInWeapon(RPG) <= 0) modelActWithCall(Weapon.GetModel(MP5), callback);
      if (this.BONUS.Minigun && PLAYER_ACTOR.getAmmoInWeapon(MINIGUN) <= 0) modelActWithCall(Weapon.GetModel(MP5), callback);
      if (this.BONUS.HSRocket && PLAYER_ACTOR.getAmmoInWeapon(HS_ROCKET) <= 0) modelActWithCall(Weapon.GetModel(MP5), callback);

      /* Проверка Слоу-Мо */

      if (this.BONUS.SlowMo) {
        if (Pad.IsKeyPressed(9)) this.SM.isButtonPressed = true;
        else {
          if (this.SM.isButtonPressed) {
            this.TIMER_2.update();
            this.SM.isButtonPressed = false;
            this.SM.isActivated = !this.SM.isActivated;

            if (!this.SM.isActivated) Clock.SetTimeScale(1.0);
          }
        }

        if (this.SM.isActivated) {
          Clock.SetTimeScale(0.3);

          if (this.TIMER_2.isTimePassed(10)) {
            this.SM.value -= 0.5;
            this.TIMER_2.update();
          }
        } else {
          Text.SetFont(2);
          Text.SetScale(0.3, 1.0);
          Text.SetColor(255, 255, 255, 255);
          Text.SetDropshadow(1, 0, 0, 0, 255);
          Text.Display(307.0, 20.0, RUS.GXT.СTRL.TAB);
        }

        if (this.SM.value <= 0.0) {
          Clock.SetTimeScale(1.0);
          this.destroy();
        }

        Hud.DrawRect(320.0, 13.5, 102.0, 7.5, 0, 0, 0, 255);
        Hud.DrawRect(320.0 - (100.0 - this.SM.value) / 2, 13.5, this.SM.value, 5.0, 255, 255, 255, 255);
      }
    }
  }

  destroy() {
    this.BONUS = { Rpg7: false, SlowMo: false, FixCar: false, Minigun: false, HSRocket: false, };
    this.TIMER.update();
    this.isEnabled = false;
  }

  remove() {
    this.BONUS = { Rpg7: false, SlowMo: false, FixCar: false, Minigun: false, HSRocket: false, };
    this.SM = { value: 100.0, isActivated: false, isButtonPressed: false, };
    this.TIMER = new TimerUtil();
    this.TIMER_2 = new TimerUtil();
    this.isEnabled = false;
    this.scoreStep = -1;
  }
}
