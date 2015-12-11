'use strict';
// FIXME: make a test for this
EC.modules.setter = function () {

  //http://stackoverflow.com/questions/14843815/recursive-deep-extend-assign-in-underscore-js
  var _deepFunction = function(mergeArrays) {
    var f = function(a, b) {
      var result;
      if (_.isArray(a) && _.isArray(b)) {
        if (mergeArrays) {
          result = a.concat(b)
        } else {
          result = b
        }
      } else if (_.isObject(a) && _.isObject(b)) {
          result = _.extend(a, b, f)
      } else {
        result = b;
      }
      return result;
    };
    return f
  }


  this.setOrExtend = function (object, path, value, mergeArrays) {
    var pathArr, len, keysExceptLastKey, lastKey, _deep;
    _deep = _deepFunction(mergeArrays)

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