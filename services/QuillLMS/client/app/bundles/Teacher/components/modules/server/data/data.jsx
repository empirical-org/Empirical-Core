'use strict'

import _ from 'underscore'
import FileProcessor from './file_processor'
import Normalizer from './normalizer'

export default function () {

  let _modules = {
    fileProcessor: new FileProcessor(),
    normalizer: new Normalizer()
  }

  let _constructData = function (resourceNameSingular) {
    return function (data) {
      let hash = {}
      hash[resourceNameSingular] = data
      return hash;
    }
  }

  let _normalizer = function (fieldDatas) {
    return function (data) {
      return _modules.normalizer.process(data, fieldDatas);
    }
  }

  let _partsPicker = function (savingKeys) {
    return function (data) {
      let result;
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
