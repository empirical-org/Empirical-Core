'use strict'
// setter has drastically changed as per slack conversation between ryan and donald
// this will affect anything that was set up to use setter before 6/16/2016

import _ from 'underscore';

//http://stackoverflow.com/questions/14843815/recursive-deep-extend-assign-in-underscore-js
let _deepFunction = function(mergeArrays) {
  var f = function(a, b) {
    let result;
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

export default function (object, path, value, mergeArrays) {
  let pathArr, len, keysExceptLastKey, lastKey, _deep;
  _deep = _deepFunction(mergeArrays)

  if (!path) {
    object = _.extend({}, object, value, _deep);
  } else {
    pathArr = path.split('.');
    len = pathArr.length;
    keysExceptLastKey = _.take(pathArr, len -1);
    lastKey = pathArr[len - 1]

    let nestedItem = _.reduce(keysExceptLastKey, function (acc, ele) {
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
