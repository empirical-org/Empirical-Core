'use strict';
EC.IndicatorGenerator = function (component, fnl) {

  this.stateItemToggler = function (key) {
    return function (item, boolean) {
      var x = fnl.toggle(component.state.model[key], item);
      component.updateModelState(key, x);
    }
  };

  this.selector = function (key) {
    return function (value) {
      component.updateModelState(key, value);
    }
  };
}