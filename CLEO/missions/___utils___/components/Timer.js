/// <reference path="../../../.config/sa.d.ts" />

import { ERRORS, ERROR_INIT } from "../errors/errors";

export class TimerUtil {
  TIMER = 0;
  EXPRESSION = {
    SEC_1: 1000,
    SEC_5: 5000,
    SEC_10: 10000,
    SEC_15: 15000,
    SEC_30: 30000,
    SEC_60: 60000,
  };

  constructor() {
    this.TIMER = Clock.GetGameTimer();
  }

  update() {
    this.TIMER = Clock.GetGameTimer();
  }

  isTimePassed(def, isNeedUpdate = false) {
    if (!def) return ERROR_INIT(ERRORS.TIMER.TIMER_GET_DEF);

    const localDef = Clock.GetGameTimer() - this.TIMER;

    if (localDef >= def) {
      if (isNeedUpdate) this.update();
      return true;
    }
    return false;
  }

  isTimePassed_1sec(isNeedUpdate = false) {
    const def = Clock.GetGameTimer() - this.TIMER;

    if (def >= this.EXPRESSION.SEC_1) {
      if (isNeedUpdate) this.update();
      return true;
    }

    return false;
  }

  isTimePassed_5sec(isNeedUpdate = false) {
    const def = Clock.GetGameTimer() - this.TIMER;

    if (def >= this.EXPRESSION.SEC_5) {
      if (isNeedUpdate) this.update();
      return true;
    }

    return false;
  }

  isTimePassed_10sec(isNeedUpdate = false) {
    const def = Clock.GetGameTimer() - this.TIMER;

    if (def >= this.EXPRESSION.SEC_10) {
      if (isNeedUpdate) this.update();
      return true;
    }

    return false;
  }

  isTimePassed_15sec(isNeedUpdate = false) {
    const def = Clock.GetGameTimer() - this.TIMER;

    if (def >= this.EXPRESSION.SEC_15) {
      if (isNeedUpdate) this.update();
      return true;
    }

    return false;
  }

  isTimePassed_30sec(isNeedUpdate = false) {
    const def = Clock.GetGameTimer() - this.TIMER;

    if (def >= this.EXPRESSION.SEC_30) {
      if (isNeedUpdate) this.update();
      return true;
    }

    return false;
  }

  isTimePassed_60sec(isNeedUpdate = false) {
    const def = Clock.GetGameTimer() - this.TIMER;

    if (def >= this.EXPRESSION.SEC_60) {
      if (isNeedUpdate) this.update();
      return true;
    }

    return false;
  }
}
