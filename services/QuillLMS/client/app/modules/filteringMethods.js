import { matchSorter } from 'match-sorter';

export function filterWords(filter, row, value) {
  return matchSorter(row, filter.value, { keys: [value] })
}

export function filterNumbers(filter, row) {
  let value = filter.value
  if (value.includes("-")) {
    let splitStr = filter.value.split("-")
    if (!isNaN(parseFloat(splitStr[0])) && !isNaN(parseFloat(splitStr[1]))) {
      return row[filter.id] >= splitStr[0] && row[filter.id] <= splitStr[1];
    }
  } else if (value.includes(">")) {
    let splitStr = filter.value.split(">")
    if (!isNaN(parseFloat(splitStr[1]))) {
      return row[filter.id] > splitStr[1]
    }
  } else if (value.includes("<")) {
    let splitStr = filter.value.split("<")
    if (!isNaN(parseFloat(splitStr[1]))) {
      return row[filter.id] < splitStr[1]
    }
  }
  return true
}
