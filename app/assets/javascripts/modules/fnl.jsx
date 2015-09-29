'use strict';
// functional utilities
// dependency : lodash.js

EC.fnl = function () {

  this.toggle = function (array, item, true_or_false) {
    var newArray;
    if (true_or_false) {
      newArray = _.chain(array).push(item).value();
    } else {
      newArray = _.reject(array, item);
    }
    return newArray;
  };
};