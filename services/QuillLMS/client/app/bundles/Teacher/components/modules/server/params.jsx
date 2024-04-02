'use strict'

import $ from 'jquery'
import _ from 'underscore'

export default  function () {

  // data -> params
  this.process = function (id, resourceNamePlural, options) {
    return _.compose(
      _paramAdder(_dataType),
      _paramAdder(_callbackParam, options.callback),
      _paramAdder(_urlParam, id, resourceNamePlural, options.urlPrefix),
      _paramAdder(_typeParam, id),
      _paramAdder2(_paramsForFormOrNot),
      _dataIntoParam
    )
  }

  var _dataIntoParam = function (data) {
    data.authenticity_token = _authenticity_token()
    return {data: data}
  }

  var _paramAdder = function (fn) {
    let hash = fn.apply(null, _.rest(arguments));
    return function (params) {
      let result = _.extend({}, params, hash)
      return result
    }
  }

  var _paramAdder2 = function (fn) {
    return function (params) {
      let hash = fn.apply(null, [params]);
      return _.extend({}, params, hash)
    }
  }

  let _defaultCallback = function (data) {}
  var _callbackParam = function (callback) {
    var callback = (callback? callback : _defaultCallback)
    return {success: callback}
  }

  var _dataType = function () {
    return {dataType: 'json'}
  }

  var _urlParam = function (id, resourceNamePlural, urlPrefix) {
    let suffix = id ? ('/' + id) : null;
    let url = [urlPrefix, '/', resourceNamePlural, suffix].join('');
    return {url: url}
  }

  var _typeParam = function (id) {
    let type = id ? 'PUT' : 'POST'
    return {type: type}
  }

  var _authenticity_token = function() {
    return $('meta[name=csrf-token]').attr('content');
  }


  var _paramsForFormOrNot = function (params) {
    let extras
    let dataObj = params.data // data is of the form {resourceNameSingular: hash | FormData}
    if (dataObj instanceof FormData) {
      extras = {processData: false, contentType: false}
    } else {
      extras = {contentType: 'application/json',
        data: JSON.stringify(params.data)
      }
    }
    return extras;
  }
}
