/// <reference path=".config/sa.d.ts" />

import { CrazyChaseClass } from "./missions/crazy-chase/_index";
import { CrazySpeedCarsClass } from "./missions/crazy-speed-cars/_index";

import { CyCe } from "./missions/___utils___/constants/crazy-chase";
import { CrSpC } from "./missions/___utils___/constants/crazy-speed-cars";
import { M_SETTINGS } from "./missions/___utils___/constants/mission-settings";
import { whilePlayerDefined } from "./missions/___utils___/utils";

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

const SPHERES = {
  CrazyChase: Sphere.Create(CyCe.x, CyCe.y, CyCe.z, M_SETTINGS.RADIUS),
  CrazySpeedCars: Sphere.Create(CrSpC.x, CrSpC.y, CrSpC.z, M_SETTINGS.RADIUS),
};

const Main = () => {
  const CrazyChase = new CrazyChaseClass();
  const crazySpeedCars = new CrazySpeedCarsClass();

  while (true) {
    wait(0);

    if (CrazyChase.check(SPHERES.CrazyChase) && !PLAYER_ACTOR.isInAnyCar()) {
      SPHERES.CrazyChase.remove();
      CrazyChase.run();
      SPHERES.CrazyChase = Sphere.Create(CyCe.x, CyCe.y, CyCe.z, M_SETTINGS.RADIUS);
    }

    if (
      crazySpeedCars.check(SPHERES.CrazyChase) &&
      !PLAYER_ACTOR.isInAnyCar()
    ) {
      showTextBox("~R~WARNING~W~: It's in develop!");
      wait(2000);

      SPHERES.CrazySpeedCars.remove();
      crazySpeedCars.run();
      SPHERES.CrazySpeedCars = Sphere.Create(CrSpC.x, CrSpC.y, CrSpC.z, M_SETTINGS.RADIUS);
    }
  }
};

whilePlayerDefined(PLAYER_CHAR);
Main();
