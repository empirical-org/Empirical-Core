'use strict';
// functional utilities
// dependency : lodash.js

EC.fnl = function () {

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
};