'use strict'

 import React from 'react'
 import _ from 'lodash'
 import Saver from './saver'


 export default  function (resourceNameSingular, resourceNamePlural, urlPrefix) {

  var _urlPrefix = urlPrefix;

  var _modules = {
    saver: new Saver()
  }

  var _saveCallback = function () {console.log('save success')}

  var _destroyHelper = function (url, callback) {
    var callback = (callback ? callback : _saveCallback);
    $.ajax({url: url, type: 'DELETE', success: callback})
  }

  var _indexCallbackGenerator = function (updater) {
    return function (data) {
      var gold = data[resourceNamePlural];
      updater(gold)
    }
  }



  // // PUBLIC


  // SAVE
  this.save = function (data, options) {
    var options = _.merge({}, options, {urlPrefix: _urlPrefix});
    var hash = _modules.saver.process(data, resourceNameSingular, resourceNamePlural, options);
    var ajax = options.ajax ? options.ajax : $.ajax // so we can stub out in tests
    return ajax(hash); // return for tests purposes
  }

  // GET
  this.getStateFromServer = function (resource, url, callback) {
    var url = (url ? url :  ['/', resource].join(''));
    $.get(url, {}, callback(resource), 'json');
  };
  this.getModels = function (updater) {
    var url = [_urlPrefix, '/', resourceNamePlural].join('');
    $.get(url, {}, _indexCallbackGenerator(updater), 'json');
  }

  // DESTROY
  this.cmsDestroy = function (id, callback) {
    var url = ['/cms/', resourceNamePlural, '/', id].join('');
    _destroyHelper(url, callback)
  }

}
