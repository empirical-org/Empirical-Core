import _ from 'underscore'
import moment from 'moment'

export function sortByLastName(fullName1, fullName2){
  const lastName1 = _.last(fullName1.split(' '))
  const lastName2 = _.last(fullName2.split(' '))
  return sort(lastName1, lastName2);
}

export function sortTableByLastName(row1, row2, key) {
  const lastName1 = _.last(row1.original[key].split(' '))
  const lastName2 = _.last(row2.original[key].split(' '))
  return sort(lastName1, lastName2);
}

export function sortList(list1, list2) {
  return sort(list1.sort()[0], list2.sort()[0])
}

export function sortTableByList(row1, row2, key) {
  return sort(row1.original[key].sort()[0], row2.original[key].sort()[0])
}


export function sortFromSQLTimeStamp(timeStamp1, timeStamp2) {
  const epoch1 = timeStamp1 ? moment(timeStamp1).unix() : 0;
  const epoch2 = timeStamp2 ? moment(timeStamp2).unix() : 0;
  return sort(epoch1, epoch2)
}

export function sortTableFromSQLTimeStamp(row1, row2, key) {
  const timeStamp1 = row1.original[key]
  const timeStamp2 = row2.original[key]
  const epoch1 = timeStamp1 ? moment(timeStamp1).unix() : 0;
  const epoch2 = timeStamp2 ? moment(timeStamp2).unix() : 0;
  return sort(epoch1, epoch2)
}

export function sortTableByStandardLevel(row1, row2) {
  const standardLevel1 = row1.original.standard_level
  const standardLevel2 = row2.original.standard_level
  const numberedStandard1 = getStandardLevelNumber(standardLevel1)
  const numberedStandard2 = getStandardLevelNumber(standardLevel2)
  if (sort(numberedStandard1, numberedStandard2) === 0) {
    return sort(standardLevel1, standardLevel2)
  } else {
    return sort(numberedStandard1, numberedStandard2)
  }
}

function getStandardLevelNumber(standardLevel) {
  const standard = standardLevel.includes('CCSS Grade ') ? standardLevel.split('CCSS Grade ')[1] : standardLevel
  const firstTwoChars = standard.substr(0, 2)
  const firstChar = standard.substr(0, 1)
  if (Number(firstTwoChars)) {
    return Number(firstTwoChars)
  } else if (Number(firstChar)) {
    return Number(firstChar)
  } else {
    return 13
  }
}

export function tableSort(row1, row2, key) {
  if (row1.original[key] < row2.original[key]) {
    return -1;
  } else if (row1.original[key] > row2.original[key]) {
    return 1;
  } else {
    return 0
  }
}


export function sort(param1, param2) {
  if (param1 < param2) {
    return -1;
  } else if (param1 > param2) {
    return 1;
  } else {
    return 0
  }
}
