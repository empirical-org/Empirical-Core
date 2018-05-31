'use strict';

describe('EC.modules.Server', function () {
  beforeEach(function () {
    this.urlPrefix = '/cms'
    this.resourceNameSingular = 'activity'
    this.resourceNamePlural = 'activities'

    this.module = new EC.modules.Server(this.resourceNameSingular, this.resourceNamePlural, this.urlPrefix);
    this.saver = new EC.modules.Saver()

    this.options = {
      callback: function () {},
      fieldsToNormalize: [
        {name: 'author', idName: 'author_id'},
        {name: 'category', idName: 'category_id'}
      ],
      ajax: _.identity // a stub
    }

    this.data = {
      id: 9,
      name: 'great',
      description: 'nice',
      author: {name: 'jon', id: 2},
      category: {name: 'cat1', id: 4}
    }

    this.save = function () {
      var actual = this.module.save(this.data, this.options)
      return actual
    }

    var optionsWithUrl = _.extend({}, this.options, {urlPrefix: this.urlPrefix})
    this.expected = this.saver.process(this.data, this.resourceNameSingular, this.resourceNamePlural, optionsWithUrl);

    this.actual = this.save()
  });

  it('exists', function () {
    expect(this.module).to.be.ok()
  });

  it('works', function () {
    expect(this.actual).to.eql(this.expected)
  })
});