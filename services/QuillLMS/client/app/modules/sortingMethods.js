import _ from 'underscore'
import moment from 'moment'

export function sortByLastName(fullName1, fullName2){
  const lastName1 = _.last(fullName1.split(' '))
  const lastName2 = _.last(fullName2.split(' '))
  return sort(lastName1, lastName2);
}

export function sortList(list1, list2) {
  return sort(list1.sort()[0], list2.sort()[0])
}

export function sortFromSQLTimeStamp(timeStamp1, timeStamp2) {
  const epoch1 = timeStamp1 ? moment(timeStamp1).unix() : 0;
  const epoch2 = timeStamp2 ? moment(timeStamp2).unix() : 0;
  return sort(epoch1, epoch2)
}

export function sortByStandardLevel(standardLevel1, standardLevel2) {
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

export function sort(param1, param2) {
  if (param1 < param2) {
    return -1;
  } else if (param1 > param2) {
    return 1;
  } else {
    return 0
  }
}
