'use strict';
export default function (getModelState, setModelState, fnl) {

  this.stateItemToggler = function (key) {
    return function (item, boolean) {
      let x = fnl.toggle(getModelState(key), item);
      setModelState(key, x);
    }
  };

  this.selector = function (key) {
    return function (value) {
      setModelState(key, value);
    }
  };
}
