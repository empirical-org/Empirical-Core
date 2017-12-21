import _ from 'underscore'
import moment from 'moment'

export function sortByLastName(fullName1, fullName2){
  const lastName1 = _.last(fullName1.split(' '))
  const lastName2 = _.last(fullName2.split(' '))
  return sort(lastName1, lastName2);
}

export function sortFromSQLTimeStamp(timeStamp1, timeStamp2) {
  const epoch1 = timeStamp1 ? moment(timeStamp1).unix() : 0;
  const epoch2 = timeStamp2 ? moment(timeStamp2).unix() : 0;
  return sort(epoch1, epoch2)
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
