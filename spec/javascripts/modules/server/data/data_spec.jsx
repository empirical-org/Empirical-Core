'use strict';

describe('EC.modules.Data', function () {

  // would be nice to eventually test its use of FileProcessor as well, but as of now we cant create FormData objects

  beforeEach(function () {

    this.module = new EC.modules.Data();
    this.normalizer = new EC.modules.Normalizer();
    this.resourceNameSingular = 'activity'

    this.obj = {
      name: 'cool',
      author: {name: 'great', id: 3},
      category: {name: 'cat1', id: 4},
      irrelevant: 'great'
    }

    var fieldsToNormalize = [
      {name: 'author', idName: 'author_id'},
      {name: 'category', idName: 'category_id'}
    ]

    var savingKeys = ['name', 'author_id', 'category_id']

    this.options = {
      fieldsToNormalize: fieldsToNormalize,
      savingKeys: savingKeys
    }
    var result1 = this.normalizer.process(this.obj, this.options.fieldsToNormalize)
    var result2 = _.pick(result1, savingKeys)

    this.expected = {}
    this.expected[this.resourceNameSingular] = result2

  });

  it('exists', function () {
    expect(this.module).to.be.ok()
  });

  it('works', function () {
    var actual = this.module.process(this.resourceNameSingular, this.options)(this.obj)
    expect(actual).to.eql(this.expected);
  });

})
