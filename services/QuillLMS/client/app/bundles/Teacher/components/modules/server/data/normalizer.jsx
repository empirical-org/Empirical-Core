'use strict'

import _ from 'lodash'

export default function () {

  let _replace = function (obj, oldField, newField, newValue) {
    var newObject = {}
    newObject[newField] = newValue;
    var newObject = _.chain(newObject).merge(obj).omit(oldField).value();
    return newObject
  }

  let _getValue = function (object, oldField) {
    let oldVal, newVal;
    oldVal = object[oldField]
    if (oldVal instanceof Array) {
      newVal = oldVal.map((el) => el.id)
    } else {
      newVal = oldVal.id;
    }
    return newVal;
  }

  let _normalizeField = function (object, fieldData) {
    let fieldName = fieldData.name;
    let fieldIdName = fieldData.idName;
    let value = _getValue(object, fieldName)
    let newObject = _replace(object, fieldName, fieldIdName, value)
    return newObject
  }


  // PUBLIC
  this.process = function (object, fieldDatas) {
    return _.reduce(fieldDatas, _normalizeField, object);
  }

}
