'use strict'

 import React from 'react'
 import _ from 'underscore'
 import FileProcessor from './file_processor'
 import Normalizer from './normalizer'

 export default function () {

  var _modules = {
    fileProcessor: new FileProcessor(),
    normalizer: new Normalizer()
  }

  var _constructData = function (resourceNameSingular) {
    return function (data) {
      var hash = {}
      hash[resourceNameSingular] = data
      return hash;
    }
  }

  var _normalizer = function (fieldDatas) {
    return function (data) {
      return _modules.normalizer.process(data, fieldDatas);
    }
  }

  var _partsPicker = function (savingKeys) {
    return function (data) {
      var result;
      if (savingKeys && savingKeys.length) {
        result = _.pick(data, savingKeys);
      } else {
        result = data;
      }
      return result;
    }
  }

  this.process = function (resourceNameSingular, options) {
    return _.compose(
        _modules.fileProcessor.process,
        _constructData(resourceNameSingular),
        _partsPicker(options.savingKeys),
        _normalizer(options.fieldsToNormalize)
    );
  }
}
