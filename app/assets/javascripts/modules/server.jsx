'use strict';
EC.Server = function (component) {

  var resourceNameSingular = component.resourceNameSingular;
  var resourceNamePlural = component.resourceNamePlural;

  this.setResourceNames = function (singular, plural) {
    resourceNameSingular = singular;
    resourceNamePlural = plural;
  }

  // PRIVATE
  var resourceUpdater = function (resource) {
    return function (data) {
      component.updateState(resource, data[resource]);
    }
  };

  var saveCallback = function (data) {
    console.log('saveSuccess');
  }

  // PUBLIC
  this.getStateFromServer = function (resource, url, callback) {
    var url = (url ? url :  ['/', resource].join(''));
    var callback = (callback ? callback : resourceUpdater)
    $.get(url, {}, callback(resource), 'json');
  };



  var saveHelper = function (data, url, callback) {
    var callback = (callback ? callback : saveCallback);
    $.post(url, data, callback)
  }

  var updateHelper = function (data, url, callback) {
    $.ajax({
        url: url,
        type: 'PUT',
        data: data,
        success: callback
    });
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
    console.log('resrouces names', [resourceNameSingular, resourceNamePlural])
    console.log('resouce name on component', component.resourceNamePlural)
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