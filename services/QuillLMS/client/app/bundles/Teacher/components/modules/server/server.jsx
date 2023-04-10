'use strict'

import $ from 'jquery';
import _ from 'lodash';
import Saver from './saver';


export default  function (resourceNameSingular, resourceNamePlural, urlPrefix) {

  let _urlPrefix = urlPrefix;

  let _modules = {
    saver: new Saver()
  }

  let _saveCallback = function () {}

  let _destroyHelper = function (url, callback) {
    var callback = (callback ? callback : _saveCallback);
    $.ajax({url: url, type: 'DELETE', success: callback})
  }

  let _indexCallbackGenerator = function (updater) {
    return function (data) {
      let gold = data[resourceNamePlural];
      updater(gold)
    }
  }



  // // PUBLIC


  // SAVE
  this.save = function (data, options) {
    var options = _.merge({}, options, {urlPrefix: _urlPrefix});
    let hash = _modules.saver.process(data, resourceNameSingular, resourceNamePlural, options);
    let ajax = options.ajax ? options.ajax : $.ajax // so we can stub out in tests
    return ajax(hash); // return for tests purposes
  }

  // GET
  this.getStateFromServer = function (resource, url, callback) {
    var url = (url ? url :  ['/', resource].join(''));
    $.get(url, {}, callback(resource), 'json');
  };
  this.getModels = function (updater) {
    let url = [_urlPrefix, '/', resourceNamePlural].join('');
    $.get(url, {}, _indexCallbackGenerator(updater), 'json');
  }

  // DESTROY
  this.cmsDestroy = function (id, callback) {
    let url = ['/cms/', resourceNamePlural, '/', id].join('');
    _destroyHelper(url, callback)
  }

}
