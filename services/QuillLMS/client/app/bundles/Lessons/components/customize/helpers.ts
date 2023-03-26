import CustomizeExit from './slides/exit';
import CustomizeFillInTheBlanks from './slides/fillInTheBlanks';
import CustomizeFillInTheList from './slides/fillInTheList';
import CustomizeModel from './slides/model';
import CustomizeMultistep from './slides/multistep';
import CustomizeSingleAnswer from './slides/singleAnswer';
import CustomizeStatic from './slides/static';
import CustomizeUnsupported from './slides/unsupportedType';

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

export function formatDateTime(dateNumber) {
  const datetime = new Date(dateNumber)
  const month = formatMonth(datetime.getMonth())
  const date = formatDate(datetime.getDate())
  const time = formatTime(datetime)
  return `${month} ${date} at ${time}`
}

function formatMonth(monthNumber) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[monthNumber]
}

function formatDate(date) {
  let numS = String(date);
  const numL = numS.length - 1;
  if (date >= 11 && date <= 19) {
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
  minutes = minutes < 10 ? `0${minutes}` : minutes
  return `${hour}:${minutes} ${amOrPm}`
}
