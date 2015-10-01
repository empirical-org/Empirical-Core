'use strict';
EC.OptionLoader = function (component, server) {

  var optionTypesObjArr;

  var optionTypes;

  var results = {};

  var updateState = function () {
    console.log('initialOptions', initialOptions)
    console.log('results', results)
    console.log('total', total)
    var total = _.extend(initialOptions, results);
    component.updateState('options', total);
  }

  var updater = function (optionType) {
    return function (data) {
      results[optionType] = data[optionType];
      if (_.keys(results).length == optionTypes.length) {
        updateState();
      }
    }
  }

  var retrieve = function (optionType) {
    server.getStateFromServer(optionType, null, updater);
  }

  this.get = function () {
    optionTypesObjArr = _.filter(component.modelOptions, _.property('fromServer'));
    optionTypes = _.map(optionTypesObjArr, _.property('name'));
    _.each(optionTypes, retrieve)
  }

  var initialOptions;
  var initialOptionsMaker = function () {
    console.log('modelOptions', component.modelOptions);
    initialOptions = _.reduce(component.modelOptions, function (hash, ele) {
      hash[ele.name] = ele.value;
      return hash
    }, {});
    return initialOptions;
  }


  this.initialOptions = function () {
    return initialOptionsMaker();
  }
}