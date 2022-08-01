/// <reference path="../../.config/sa.d.ts" />

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

export class Player {
  PLANE = Plane.prototype;

  constructor() {
    this.PLANE = null;
  }

  
}
