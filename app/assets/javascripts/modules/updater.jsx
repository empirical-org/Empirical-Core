'use strict';
EC.modules.updaterGenerator = function (component) {
  var _setter = new EC.modules.setter();
  this.updater = function (path) {
    return function (value) {
      console.log('component.state', component.state)
      console.log('value', value)
      var x = _setter.setOrExtend(component.state, path, value)
      console.log('after - ', x)
      component.setState(x)
    }
  }
}