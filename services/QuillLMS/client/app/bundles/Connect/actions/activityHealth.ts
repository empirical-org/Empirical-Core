const C = require('../constants').default;

const setFlag = (flag) => {
  console.log("setting flag")
  console.log(flag)
  return (dispatch) => {
    dispatch({ type: C.SET_ACTIVITY_HEALTH_FLAG, flag, })
  };
}

export default {
  setFlag
};
