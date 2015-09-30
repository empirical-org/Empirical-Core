'use strict';
EC.Server = function (component) {

  // PRIVATE
  var resourceUpdater = function (resource) {
    return function (data) {
      component.updateState(resource, data[resource]);
    }
  };

  // PUBLIC
  this.getStateFromServer = function (resource, url) {
    var url = (url ? url :  ['/', resource].join(''));
    $.get(url, {}, resourceUpdater(resource), 'json');
  };
}