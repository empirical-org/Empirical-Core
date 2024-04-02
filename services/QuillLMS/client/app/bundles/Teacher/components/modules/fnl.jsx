'use strict'

import _ from 'underscore';

export default  function () {

  this.toggle = function (array, item) {
    let newArray, alreadyThere;
    alreadyThere = _.contains(array, item)
    if (alreadyThere) {
      newArray = _.reject(array, function (ele) {return ele == item});
    } else {
      newArray = _.chain(array).push(item).value();
    }
    return newArray;
  };

  this.toggleById = function (array, item) {
    let newArray, alreadyThere, existing;
    existing = _.find(array, function (ele) { return ele.id === item.id })
    alreadyThere = (existing != undefined)
    if (alreadyThere) {
      newArray = _.reject(array, function (ele) {return ele == item})
    } else {
      newArray = _.chain(array).push(item).value()
    }
    return newArray;
  }
}
