/* eslint-env browser*/
const C = require('../constants').default;

export function clearDisplayMessageAndError() {
  return { type: C.CLEAR_DISPLAY_MESSAGE_AND_ERROR  };
}
