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

    this.expected = {
      data: this.data,
      url: this.options.urlPrefix + '/' + this.resourceNamePlural + '/' + this.id,
      type: 'PUT',
      success: this.options.callback
    }

    this.actual = this.process()
  });

  it('exists', function () {
    expect(this.module).to.be.ok()
  });

  it('handles data', function () {
    expect(this.actual.data).to.eql(this.expected.data)
  })

  it('handles type', function () {
    expect(this.actual.type).to.eql(this.expected.type)
  })

  it('handles url', function () {
    expect(this.actual.url).to.eql(this.expected.url)
  })

  it('handles callback', function () {
    expect(this.actual.success).to.eql(this.expected.success)
  })
});

