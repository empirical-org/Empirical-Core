'use strict'

 import React from 'react'
 import _ from 'lodash'

 export default function () {

  var _replace = function (obj, oldField, newField, newValue) {
    var newObject = {}
    newObject[newField] = newValue;
    var newObject = _.chain(newObject).merge(obj).omit(oldField).value();
    console.log(newObject)
    return newObject
  }

  var _getValue = function (object, oldField) {
    var oldVal, newVal;
    oldVal = object[oldField]
    if (oldVal instanceof Array) {
      newVal = oldVal.map((el) => el.id)
    } else {
      newVal = oldVal.id;
    }
    return newVal;
  }

  var _normalizeField = function (object, fieldData) {
    var fieldName = fieldData.name;
    var fieldIdName = fieldData.idName;
    var value = _getValue(object, fieldName)
    var newObject = _replace(object, fieldName, fieldIdName, value)
    return newObject
  }


  // PUBLIC
  this.process = function (object, fieldDatas) {
    return _.reduce(fieldDatas, _normalizeField, object);
  }

}
