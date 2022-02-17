'use strict';
import _ from 'underscore'

export default function (modelOptions, setStateByKey, server) {

  let optionTypesObjArr;

  let results = {};

  let updateState = function () {
    let total = {...initialOptions, ...results}
    setStateByKey('options', total);
  }

  let updater = function (optionType) {
    return function (data) {
      results[optionType] = data[optionType];
      if (Object.keys(results).length == optionTypesObjArr.length) {
        updateState();
      }
    }
  }

  let retrieve = function (optionTypeObj) {
    let optionType = optionTypeObj.name;
    let url = (optionTypeObj.cmsController ? ['/cms/', optionType].join('') : null)
    server.getStateFromServer(optionType, url, updater);
  }

  this.get = function () {
    optionTypesObjArr = _.filter(modelOptions, _.property('fromServer'));
    _.each(optionTypesObjArr, retrieve)
  }

  let initialOptions;
  let initialOptionsMaker = function () {
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
