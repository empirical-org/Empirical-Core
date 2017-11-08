import * as IntF from '../classroomLessons/interfaces';
import * as CLIntF from '../../interfaces/ClassroomLessons';
import CustomizeStatic from './slides/static';
import CustomizeModel from './slides/model';
import CustomizeSingleAnswer from './slides/singleAnswer';
import CustomizeFillInTheBlanks from './slides/fillInTheBlanks';
import CustomizeFillInTheList from './slides/fillInTheList';
import CustomizeExit from './slides/exit';
import CustomizeUnsupported from './slides/unsupportedType';
import CustomizeMultistep from './slides/multistep';

export function getComponent(type: string) {
  switch (type) {
    case 'CL-ST':
      return CustomizeStatic
    case 'CL-MD':
      return CustomizeModel
    case 'CL-SA':
      return CustomizeSingleAnswer
    case 'CL-FB':
      return CustomizeFillInTheBlanks
    case 'CL-FL':
      return CustomizeFillInTheList
    case 'CL-EX':
      return CustomizeExit
    case 'CL-MS':
      return CustomizeMultistep
    default:
      return CustomizeUnsupported
  }
}

export function formatDate(dateNumber) {
  const date = new Date(dateNumber)
  const month = formatMonth(date.getMonth())
  const day = formatDay(date.getDay())
  const time = formatTime(date)
  return `${month} ${day} at ${time}`
}

function formatMonth(monthNumber) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[monthNumber]
}

function formatDay(day) {
  let numS = String(day);
  const numL = numS.length - 1;
  if (day >= 11 && day <= 19) {
    numS += 'th';
  } else if (numS[numL] === '1') {
    numS += 'st';
  } else if (numS[numL] === '2') {
    numS += 'nd';
  } else if (numS[numL] === '3') {
    numS += 'rd';
  } else {
    numS += 'th';
  }
  return numS;
}

function formatTime(date) {
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let amOrPm
  if (hour === 0) {
    hour = 12
    amOrPm = 'am'
  } else if (hour < 12) {
    amOrPm = 'am'
  } else if (hour === 12) {
    amOrPm = 'pm'
  } else {
    hour = hour - 12
    amOrPm = 'pm'
  }
  return `${hour}:${minutes} ${amOrPm}`
}
