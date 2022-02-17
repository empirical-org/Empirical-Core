'use strict'

import _ from 'underscore'
import setter from './setter'

export default function (component) {
  this.updater = function (path) {
    return function (value) {
      let x = setter(component.state, path, value)
      component.setState(x)
    }
  }
}
