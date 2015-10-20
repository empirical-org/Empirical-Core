'use strict';

describe('EC.modules.FileProcessor', function () {
  beforeEach(function () {
    this.module = new EC.modules.FileProcessor();
    this.data = {
      name: 'cool',
      author: {name: 'great', id: 3},
    }
  });

  it('exists', function () {
    expect(this.module).to.be.ok()
  });

  it('works for data not containing files', function () {
    var actual = this.module.process(this.data)
    var expected = this.data;
    expect(actual).to.eql(expected);
  });

})