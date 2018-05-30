'use strict'

 import React from 'react'

 export default  function () {

  this.updateCreateUnit = function (state, hash) {
    var newCU = _.extend({}, state.createUnit, hash)
    state.createUnit = newCU;
    return state
  }

  this.updateCreateUnitModel = function (state, hash) {
    var newCUM = _.extend({}, state.createUnit.model, hash);
    state.createUnit.model = newCUM;
    return state;
  }
}
