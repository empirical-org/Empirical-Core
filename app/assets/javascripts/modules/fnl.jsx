'use strict';
// functional utilities
// dependency : lodash.js

EC.modules.fnl = function () {

  this.toggle = function (array, item) {
    var newArray, alreadyThere;
    alreadyThere = _.contains(array, item)
    if (alreadyThere) {
      newArray = _.reject(array, function (ele) {return ele == item});
    } else {
      newArray = _.chain(array).push(item).value();
    }
    return newArray;
  };

  this.toggleById = function (array, item) {
    var newArray, alreadyThere;
    extant = _.find(array, function (ele) { return ele.id === item.id })
    alreadyThere = (extant != undefined)
    if (alreadyThere) {
      newArray = _.reject(array, function (ele) {return ele == item})
    } else {
      newArray = _.chain(array).push(item).value()
    }
    return newArray;
  }
};