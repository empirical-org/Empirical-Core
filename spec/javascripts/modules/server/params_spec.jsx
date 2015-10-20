'use strict';

describe('EC.modules.Params', function () {
  beforeEach(function () {
    this.module = new EC.modules.Params();
    this.id = 1
    this.resourceNamePlural = 'activities'
    this.options = {
      callback: function () {},
      urlPrefix: '/cms'
    }

    this.data = {
      name: 'great',
      description: 'nice'
    }

    this.process = function () {
      var actual = this.module.process(this.id, this.resourceNamePlural, this.options)(this.data)
      return actual
    }
  });

  it('exists', function () {
    expect(this.module).to.be.ok()
  });

});


/*
  this.process = function (id, resourceNamePlural, options) {
    return _.compose(
      _callbackParam(options.callback),
      _urlParam(id, resourceNamePlural, options.urlPrefix),
      _typeParam(id),
      _paramsForForm,
      _dataIntoParam
    )
  }
*/
