'use strict';
EC.IndicatorGenerator = function (component, fnl) {

  this.stateItemToggler = function (key) {
    return function (item, boolean) {
      var x = fnl.toggle(component.state.selected[key], item);
      component.updateSelectedState(key, x);
    }
  };

  this.selector = function (key) {
    return function (value) {
      component.updateSelectedState(key, value);
    }
  };
}