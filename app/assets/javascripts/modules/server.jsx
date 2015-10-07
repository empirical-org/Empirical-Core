'use strict';
EC.Server = function (resourceNameSingular, resourceNamePlural) {


  var ajaxDataProcessor = new EC.AjaxDataProcessor();

  var saveCallback = function (data) {
    console.log('saveSuccess');
  }

  // PUBLIC
  this.getStateFromServer = function (resource, url, callback) {
    var url = (url ? url :  ['/', resource].join(''));
    $.get(url, {}, callback(resource), 'json');
  };

  var urlPrefix = null;
  this.setUrlPrefix = function (prefix) {
    urlPrefix = prefix;
  }

  var _indexCallbackGenerator = function (updater) {
    return function (data) {
      var gold = data[resourceNamePlural];
      updater(gold)
    }
  }

  this.getModels = function (updater) {
    var url = [urlPrefix, '/', resourceNamePlural].join('');
    $.get(url, {}, _indexCallbackGenerator(updater), 'json');
  }



  var saveHelper = function (data, url, callback) {
    var callback = (callback ? callback : saveCallback);
    //$.post(url, data, callback)
    var hash = {
      url: url,
      type: 'POST',
      success: callback
    };
    extrasAndAjax(hash, data)
  }

  var updateHelper = function (data, url, callback) {
    var hash = {
      url: url,
      type: 'PUT',
      suceess: callback
    };
    extrasAndAjax(hash, data)
  }

  var extrasAndAjax = function (hash, data) {
    var extras = ajaxDataProcessor.requestObjectExtras(data)
    var newHash = _.extend(hash, extras)
    $.ajax(newHash);
  }

  var constructData = function (data) {
    var hash = {}
    hash[resourceNameSingular] = data
    return hash;
  }

  this.save = function (data, callback) {
    var data = constructData(data)
    var url = ['/', resourceNamePlural].join('');
    saveHelper(data, url, callback);
  }

  this.cmsSave = function (data, callback) {
    var sendData = constructData(data)
    if (!data.id) {
      var url = ['/cms/', resourceNamePlural].join('');
      saveHelper(sendData, url, callback);
    } else {
      var url = ['/cms/', resourceNamePlural, '/', data.id].join('');
      updateHelper(sendData, url, callback);
    }
  }

  var destroyHelper = function (url, callback) {
    var callback = (callback ? callback : saveCallback);
    $.ajax({url: url, type: 'DELETE', success: callback})
  }

  this.cmsDestroy = function (id, callback) {
    var url = ['/cms/', resourceNamePlural, '/', id].join('');
    destroyHelper(url, callback)
  }

}