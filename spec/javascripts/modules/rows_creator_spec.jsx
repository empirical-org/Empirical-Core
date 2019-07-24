'use strict';

describe('EC.RowsCreator', function () {
  beforeEach(function () {
    var colFn = function (n) {return n*2};
    var rowFn = function (arr) {return {row: arr}};
    var numCols = 3
    this.module = new EC.modules.RowsCreator(colFn, rowFn, numCols);
  });

  it('exists', function () {
    expect(this.module).to.be.ok()
  });

  it('creates appropriate rows', function () {
    var dataArr = [1,2,3,4];
    var rows = this.module.create(dataArr);
    var expected = [
      {row: [2,4,6]},
      {row: [8]}
    ];
    expect(rows).to.eql(expected);
  });
})