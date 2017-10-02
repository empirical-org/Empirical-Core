'use strict'


 export default  function (columnFn, rowFn, numCols) {

  var columnFn = columnFn;
  var rowFn = rowFn;
  var numCols = numCols;

  let rowIndex = 0

  var _createSingleRow = function (singleRowData) {
    rowIndex += 1
    var cols = _.map(singleRowData, columnFn, this);
    return rowFn(cols, rowIndex);
  };

  this.create = function (dataArr) {
    var arrOfDataArrs = _.chunk(dataArr, numCols);
    return _.map(arrOfDataArrs, _createSingleRow, this);
  };

}
