/// <reference path="../../../.config/sa.d.ts" />

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

export class HelicopterEnemy {
  HELI = Heli.prototype;
  DRIVER = Char.prototype;
  SHOOTERS = [Char.prototype];

  constructor() {
    this.HELI = null;
    this.DRIVER = null;
    this.SHOOTERS = [null, null, null, null];
  }

  add(P_CAR) {
    const XYZ = P_CAR.getOffsetInWorldCoords(0.0, 150.0, 60.0);

    Streaming.RequestModel(447); // SPARROW
    Streaming.RequestModel(353); // MP5
    Streaming.RequestModel(117); // TRIADA
    Streaming.LoadAllModelsNow();

    this.HELI = Heli.Create(447, XYZ.x, XYZ.y, XYZ.z);
    this.DRIVER = Char.CreateInsideCar(this.HELI, 20, 117);

    this.DRIVER.setProofs(true, true, true, true, true);

    this.HELI.setProofs(false, true, false, false, false);
    this.HELI.setHeading(P_CAR.getHeading());
    this.HELI.setHealth(600);
    this.HELI.setForwardSpeed(100.0);
    this.HELI.setCruiseSpeed(200.0);

    for (let i = 0; i < 4; i++) {
      this.SHOOTERS[i] = Char.Create(22, 117, XYZ.x, XYZ.y, XYZ.z);
    }

    this.SHOOTERS[0].attachToCar(this.HELI, 1.25, 1.65, 0.5, 1, 360.0, 29);
    this.SHOOTERS[1].attachToCar(this.HELI, 1.25, -0.15, 0.5, 1, 360.0, 29);
    this.SHOOTERS[2].attachToCar(this.HELI, -1.25, 1.65, 0.5, 1, 360.0, 29);
    this.SHOOTERS[3].attachToCar(this.HELI, -1.25, -0.15, 0.5, 1, 360.0, 29);

    Streaming.MarkModelAsNoLongerNeeded(447); // SPARROW
    Streaming.MarkModelAsNoLongerNeeded(353); // MP5
    Streaming.MarkModelAsNoLongerNeeded(117); // TRIADA

    for (let i = 0; i < 4; i++) {
      this.SHOOTERS[i].setAccuracy(70);
      this.SHOOTERS[i].setProofs(false, true, true, false, false);
      this.SHOOTERS[i].setRelationship(4, 0);
      this.SHOOTERS[i].setRelationship(4, 1);
      this.SHOOTERS[i].setStayInSamePlace(true);
    }

    Game.SetRelationship(4, 22, 0);
    Game.SetRelationship(4, 22, 1);
    Game.SetRelationship(1, 22, 20);
  }

  isDead() {
    const isDead =
      Char.IsDead(this.DRIVER) ||
      Heli.IsDead(this.HELI) ||
      this.HELI.getHealth() < 250;
    return isDead;
  }

  isDefined() {
    if (this.DRIVER && this.HELI) {
      return Heli.DoesExist(this.HELI) && Char.DoesExist(this.DRIVER);
    }

    return false;
  }

  check(P_CAR) {
    if (!PLAYER_ACTOR.locateAnyMeansCar2D(this.HELI, 250.0, 250.0, false)) {
      this.destroy(false);
      this.add(P_CAR);
    } else {
      const { x, y, z } = PLAYER_ACTOR.getCoordinates();
      native("HELI_GOTO_COORDS", this.HELI, x, y, z, 2.0, 20.0);

      if (
        this.HELI.getSpeed() < 20.0 &&
        !PLAYER_ACTOR.locateAnyMeansCar2D(this.HELI, 40.0, 40.0, false)
      ) {
        this.HELI.setForwardSpeed(35.0);
      }
    }
  }

  destroy(withExplode = false) {
    if (withExplode) this.HELI.explode();

    for (let i = 0; i < 4; i++) this.SHOOTERS[i].markAsNoLongerNeeded();

    this.HELI.markAsNoLongerNeeded();
    this.DRIVER.markAsNoLongerNeeded();
  }
}
