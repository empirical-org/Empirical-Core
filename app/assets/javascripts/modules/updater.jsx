'use strict';
EC.modules.updaterGenerator = function (component) {
  var _setter = new EC.modules.setter();
  this.updater = function (path) {
    return function (value) {
      component.setState(_setter.setOrExtend(component.state, path, value))
    }
  }
}