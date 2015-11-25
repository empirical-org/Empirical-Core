'use strict';
// FIXME: make a test for this
EC.modules.setter = function () {
  this.setOrExtend = function (object, path, value) {
    var pathArr = path.split('.');
    var len = pathArr.length;
    var keysExceptLastKey = _.take(pathArr, len -1);
    var lastKey = pathArr[len - 1]

    var nestedItem = _.reduce(keysExceptLastKey, function (acc, ele) {
      if (! acc[ele]) acc[ele] = {}
      return acc[ele]
    }, object)

    if (value instanceof Object) {
      nestedItem[lastKey] = _.extend({}, nestedItem[lastKey], value);
    } else {
      nestedItem[lastKey] = value;
    }
    return object;
  }
}