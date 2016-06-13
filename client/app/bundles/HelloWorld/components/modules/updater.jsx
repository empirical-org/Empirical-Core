'use strict'

  import _ from 'underscore'
  import setter from './setter'

  export default

  function (component) {
  var _setter = new setter();
  this.updater = function (path) {
    return function (value) {
      var x = _setter.setOrExtend(component.state, path, value)
      component.setState(x)
    }
  }
}
