'use strict';
EC.Server = function (component) {

  // PRIVATE
  var resourceUpdater = function (resource) {
    return function (data) {
      component.updateState(resource, data[resource]);
    }
  };

  // PUBLIC
  this.getStateFromServer = function (resource, url, callback) {
    var url = (url ? url :  ['/', resource].join(''));
    var callback = (callback ? callback : resourceUpdater)
    $.get(url, {}, callback(resource), 'json');
  };
}