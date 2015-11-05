EC.modules.Saver = function () {

  var _modules = {
    data:   new EC.modules.Data(),
    params: new EC.modules.Params()
  }

  // data, options -> ajaxParams
  this.process = function (data, resourceNameSingular, resourceNamePlural, options) {
    return _.compose(
      _modules.params.process(data.id, resourceNamePlural, options),
      _modules.data.process(resourceNameSingular, options)
    )(data)
  }
}