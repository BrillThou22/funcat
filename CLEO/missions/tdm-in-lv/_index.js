/// <reference path="../../.config/sa.d.ts" />

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

export class TDMInLv {
  check() {
    if (native("TEST_CHEAT", "PZ"))
      PLAYER_ACTOR.setCoordinates(CyCe.x + 7.5, CyCe.y, CyCe.z);
    const R = M_SETTINGS.RADIUS;
    return PLAYER_ACTOR.locateAnyMeans2D(CyCe.x, CyCe.y, R, R, undefined);
  }
}
