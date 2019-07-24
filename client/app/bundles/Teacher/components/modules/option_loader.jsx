'use strict';
import _ from 'underscore'

export default function (modelOptions, setStateByKey, server) {

  var optionTypesObjArr;

  var results = {};

  var updateState = function () {
    var total = {...initialOptions, ...results}
    setStateByKey('options', total);
  }

  var updater = function (optionType) {
    return function (data) {
      results[optionType] = data[optionType];
      if (Object.keys(results).length == optionTypesObjArr.length) {
        updateState();
      }
    }
  }

  var retrieve = function (optionTypeObj) {
    var optionType = optionTypeObj.name;
    var url = (optionTypeObj.cmsController ? ['/cms/', optionType].join('') : null)
    server.getStateFromServer(optionType, url, updater);
  }

  this.get = function () {
    optionTypesObjArr = _.filter(modelOptions, _.property('fromServer'));
    _.each(optionTypesObjArr, retrieve)
  }

  var initialOptions;
  var initialOptionsMaker = function () {
    initialOptions = _.reduce(modelOptions, function (hash, ele) {
      hash[ele.name] = ele.value;
      return hash
    }, {});
    return initialOptions;
  }


  this.initialOptions = function () {
    return initialOptionsMaker();
  }
}
