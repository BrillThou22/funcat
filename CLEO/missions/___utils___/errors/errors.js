export const ERROR_INIT = (ERROR = ERRORS.DEF) => {
  log(ERROR);
  throw new Error(ERROR);
};

export const ERRORS = {
  DEF: "Unexpected error",
  TIMER: {
    TIMER_GET_DEF: "TIMER::isTimePassed(def) bad request!",
  },
  UTILS: {
    getRandNumExtended: "UTILS::getRandNumExtended() bad request!",
  },
};
