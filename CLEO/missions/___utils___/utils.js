/// <reference path="../../.config/sa.d.ts" />

import { M_SETTINGS } from "./constants/mission-settings";
import { ERRORS, ERROR_INIT } from "./errors/errors";

const PLAYER_CHAR = new Player();
const PLAYER_ACTOR = PLAYER_CHAR.getChar();

export const getRandomIntNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
export const getRandomFloatNumber = (min, max) => Math.random() * (max - min) + min;

export const getRandNumExtended = (min = 0, max = 0, exceptions = []) => {
  if (min >= max) ERROR_INIT(ERRORS.UTILS.getRandNumExtended);

  if (max - min === 2) {
    if (exceptions.indexOf(min) > -1 && exceptions.indexOf(max - 1) > -1)
      ERROR_INIT(ERRORS.UTILS.getRandNumExtended);
  }

  let attemps = 0;

  while (true) {
    wait(0);
    let ID = getRandomIntNumber(min, max);
    if (exceptions.indexOf(ID) === -1) return ID;
  }
};

export const getRandCarModel = () => {
  let attemps = 0;
  while (true) {
    wait(0);
    const modelId = getRandomIntNumber(400, 606);
    if (Streaming.IsThisModelACar(modelId)) return modelId;
    else {
      attemps += 1;
      if (attemps > 5) return 415;
    }
  }
};

export const whilePlayerDefined = (PLAYER_CHAR) => {
  while (true) {
    wait(0);
    if (PLAYER_CHAR.isPlaying()) break;
  }
};

export const setMissionStart = (callback = () => { }) => {
  Camera.DoFade(M_SETTINGS.CAMERA_FADE.DEF, 0);
  wait(M_SETTINGS.CAMERA_FADE.DEF);

  ONMISSION = true;

  Game.SetMaxWantedLevel(0);

  PLAYER_CHAR.alterWantedLevel(0);
  PLAYER_ACTOR.setWantedByPolice(0);

  World.SetCarDensityMultiplier(0.0);

  callback();
};

export const setMissionEnd = (callback = () => { }) => {
  Camera.DoFade(M_SETTINGS.CAMERA_FADE.DEF, 0);
  wait(M_SETTINGS.CAMERA_FADE.DEF);

  Game.SetMaxWantedLevel(6);
  World.SetCarDensityMultiplier(1.0);
  PLAYER_ACTOR.setWantedByPolice(1);

  ONMISSION = false;

  callback();

  Camera.DoFade(M_SETTINGS.CAMERA_FADE.DEF, 1);
  wait(M_SETTINGS.CAMERA_FADE.DEF);
};

export const modelActWithCall = (model, callback) => {
  Streaming.RequestModel(model);
  Streaming.LoadAllModelsNow();
  callback();
  Streaming.MarkModelAsNoLongerNeeded(model);
};
