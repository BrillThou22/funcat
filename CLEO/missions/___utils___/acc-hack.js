/// <reference path="../../.config/sa.d.ts" />
// http://gtamodding.ru/wiki/Адреса_Памяти_(SA)

/**
 * Данный компонент отвечает за имитацию "раскочегаренного" двигателя авто.
 * Плюсом является возможность тонкой настройки.
 * Минусом - сложность формулы для некоторых.
 */

const botDef = { stopping: 0.001, vel1: 0.02, vel2: 0.04, isBot: false };
const botSpeedDef = { v1: 25.0, v2: 45.0 };

export const AccHack = (CAR = Car.prototype, botSet = botDef, vel = 0.02) => {
  if (!Car.DoesExist(CAR)) return null;
  if (CAR.isInAirProper()) return null;

  if (!botSet.vel1) botSet.vel1 = botDef.vel1;
  if (!botSet.vel2) botSet.vel2 = botDef.vel2;

  /* Настройка для ботов */

  if (botSet.isBot) {
    vel = botDef.stopping;

    const speed = CAR.getSpeed();

    if (speed > botSpeedDef.v1) {
      vel = botSet.vel1;
      CAR.setTraction(1.5);
    } else {
      CAR.setTraction(3.5);
    }

    if (speed > botSpeedDef.v2) {
      vel = botSet.vel2;
      CAR.setTraction(2.5);
    }
  }

  let vP_1 = Memory.GetVehiclePointer(CAR);
  let vP_2 = Memory.GetVehiclePointer(CAR);

  vP_1 += 0x49c;
  vP_2 += 0x4a0;

  const isGasPedalPressed = Memory.Read(vP_1, 4, false);
  const isTormozPedalPressed = Memory.Read(vP_2, 4, false);

  if (isGasPedalPressed > 0) {
    const angle = CAR.getHeading();
    let y = 0.0; // Ускорение по Y
    let x = 0.0; // Ускорение по X

    // Считаем по оси Y (относительно мира)

    if (angle <= 180.0) {
      y = vel - vel * (angle / 90 / 100) * 100;
    } else {
      y = vel - vel * ((angle - 180) / 90 / 100) * 100;
      y *= -1;
    }

    // Считаем по оси X (относительно мира)

    if (angle <= 90.0) {
      x = vel * (angle / 90.0 / 100) * 100;
    }

    if (angle > 90.0 && angle <= 270.0) {
      x = vel * 2 - vel * (angle / 90.0 / 100) * 100
    }

    if (angle > 270) {
      x = vel * 4 - vel * (angle / 90.0 / 100) * 100
      x *= -1;
    }

    x *= -1;

    CAR.applyForce(x, y, 0.0025, 0.0, 0.0, 0.0);
  }

  /* Реализовываем быстрое торможение (очень помогает боту, кстати) */

  if (isTormozPedalPressed && isGasPedalPressed >= 0 && CAR.isInAirProper()) {
    const speed = CAR.getSpeed();
    if (speed > 30.0) CAR.setForwardSpeed(speed / 1.01);
  }
};
