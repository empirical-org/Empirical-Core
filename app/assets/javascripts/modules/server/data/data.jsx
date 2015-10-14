EC.modules.Data = function () {

  var _modules = {
    fileProcessor: new EC.modules.FileProcessor(),
    normalizer: new EC.modules.Normal()
  }

  var _constructData = function (resourceNameSingular) {
    return function (data) {
      var hash = {}
      hash[resourceNameSingular] = data
      return hash;
    }
  }

  var _normalizer = function (fieldDatas) {
    return function (data) {
      this.modules.normalizer(data, fieldDatas);
    }
  }

  this.process = function (resourceNameSingular, fieldsToNormalize) {
    return _.compose(
        _modules.fileProcessor.process,
        _constructData(resourceNameSingular),
        _normalizer(fieldsToNormalize)
    );
  }
}