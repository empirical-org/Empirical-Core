'use strict';
// FIXME: make a test for this
EC.modules.setter = function () {

  //http://stackoverflow.com/questions/14843815/recursive-deep-extend-assign-in-underscore-js
  var _deep = function(a, b) {
    return _.isObject(a) && _.isObject(b) && (!_.isArray(b)) ? _.extend(a, b, _deep) : b;
  };

  this.setOrExtend = function (object, path, value) {
    var pathArr, len, keysExceptLastKey, lastKey;

    if (!path) {
      object = _.extend({}, object, value, _deep);
    } else {
      pathArr = path.split('.');
      len = pathArr.length;
      keysExceptLastKey = _.take(pathArr, len -1);
      lastKey = pathArr[len - 1]

      var nestedItem = _.reduce(keysExceptLastKey, function (acc, ele) {
        if (! acc[ele]) acc[ele] = {}
        return acc[ele]
      }, object)

      if ((value instanceof Object) && (nestedItem[lastKey] instanceof Object)){
        nestedItem[lastKey] = _.extend({}, nestedItem[lastKey], value, _deep);
      } else {
        nestedItem[lastKey] = value;
      }


    }

    return object;
  }
}