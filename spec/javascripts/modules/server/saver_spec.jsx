'use strict';

describe('EC.modules.Saver', function () {
  beforeEach(function () {
    this.module = new EC.modules.Saver();
    this.normalizer = new EC.modules.Normalizer();

    this.resourceNameSingular = 'activity'
    this.resourceNamePlural = 'activities'

    this.options = {
      callback: function () {},
      urlPrefix: '/cms',
      fieldsToNormalize: [
        {name: 'author', idName: 'author_id'},
        {name: 'category', idName: 'category_id'}
      ]
    }

    this.data = {
      id: 9,
      name: 'great',
      description: 'nice',
      author: {name: 'jon', id: 2},
      category: {name: 'cat1', id: 4}
    }

    this.process = function () {
      var actual = this.module.process(this.data, this.resourceNameSingular, this.resourceNamePlural, this.options)
      return actual
    }


    this.expected = {
      data: {activity: this.normalizer.process(this.data, this.options.fieldsToNormalize)},
      url: '/cms/activities/9',
      type: 'PUT',
      success: this.options.callback
    }

    this.actual = this.process()
  });

  it('exists', function () {
    expect(this.module).to.be.ok()
  });

  it('works', function () {
    expect(this.actual).to.eql(this.expected)
  })
});