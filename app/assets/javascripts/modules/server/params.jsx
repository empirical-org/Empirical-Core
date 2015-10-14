EC.modules.Params = function () {

  // data -> params
  this.process = function (id, resourceNamePlural, options) {
    return _.compose(
      _callbackParam(options.callback),
      _urlParam(id, resourceNamePlural, options.urlPrefix),
      _typeParam(id),
      _paramsForForm,
      _dataIntoParam
    )
  }

  var _dataIntoParam = function (data) {return {data: data}}



  var _paramAdder = function (fn) {
    var hash = _.apply(fn, _.rest(arguments));
    return function (params) {
      return _.extend({}, params, hash)
    }
  }

  var _defaultCallback = function (data) {console.log('ajax success');}
  var _callbackParam = function (callback) {
    var callback = (callback? callback : _saveCallback)
    return {callback: callback}
  }

  var _urlParam = function (id, resourceNamePlural, urlPrefix) {
    var suffix = id ? ('/' + id) : null;
    var url = [urlPrefix, '/', resourceNamePlural, suffix].join('');
    return {url: url}
  }

  var _typeParam = function (id) {
    var type = id ? 'PUT' : 'POST'
    return {type: type}
  }

  var _paramsForForm = function (params) {
    var extras
    var dataObj = data(_.keys(params.data)[0])
    if (dataObj instanceof FormData) {
      extras = {processData: false, contentType: false}
    } else {
      extras = {}
    }
    return extras;
  }
}