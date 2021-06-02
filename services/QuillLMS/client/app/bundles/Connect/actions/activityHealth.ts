const C = require('../constants').default;

const setFlag = (flag) => {
  return (dispatch) => {
    dispatch({ type: C.SET_ACTIVITY_HEALTH_FLAG, flag, })
  };
}

export default {
  setFlag
};
