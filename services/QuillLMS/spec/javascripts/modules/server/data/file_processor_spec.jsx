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
/*
  FIXME: figure out how to instantiate File objects in this test environment (not possible last time I tried)
  it('works for data containing files that are not recursive objects', function () {
    var file = new File([],[])
    var dataWFile = {
      name: 'great',
      picture: file
    };
    var actual = this.module.process(dataWFile);

    var f = new FormData()
    f.append('name', dataWFile.name)
    f.append('picture', dataWFile.picture)

    var expected = f
    expect(actual).to.eql(expected);
  });
*/
})