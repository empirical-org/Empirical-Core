'use strict';

describe('EC.modules.Normalizer', function () {
  beforeEach(function () {
    this.module = new EC.modules.Normalizer();
    this.obj = {
      name: 'cool',
      author: {name: 'great', id: 3},
      category: {name: 'cat1', id: 4}
    }
    this.fieldDatas = [
      {name: 'author', idName: 'author_id'},
      {name: 'category', idName: 'category_id'}
    ]
    this.expected = {
      name: 'cool',
      author_id: 3,
      category_id: 4
    }
  });

  it('exists', function () {
    expect(this.module).to.be.ok()
  });

  it('works for non-arrays', function () {
    var actual = this.module.process(this.obj, this.fieldDatas)
    expect(actual).to.eql(this.expected);
  });

  it('works for non-arrays together with arrays', function () {
    var obj = _.extend({}, this.obj, {activities: [{id: 4, name: 'activity1'},
                                                       {id: 5, name: 'activity2'}]});
    var fieldDatas = this.fieldDatas.concat([{name: 'activities', idName: 'activity_ids'}])
    var expected = _.extend({}, this.expected, {activity_ids: [4,5]});
    var actual = this.module.process(obj, fieldDatas)
    expect(actual).to.eql(expected);
  })
})