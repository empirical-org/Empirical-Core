export function filterNumbers(rows, idArray, filterValue) {
  const id = idArray[0]
  return rows.filter(row => {
    let value = filterValue
    if (value.includes("-")) {
      let splitStr = filterValue.split("-")
      if (!isNaN(parseFloat(splitStr[0])) && !isNaN(parseFloat(splitStr[1]))) {
        return row.original[id] >= splitStr[0] && row.original[id] <= splitStr[1];
      }
    } else if (value.includes(">")) {
      let splitStr = filterValue.split(">")
      if (!isNaN(parseFloat(splitStr[1]))) {
        return row.original[id] > splitStr[1]
      }
    } else if (value.includes("<")) {
      let splitStr = filterValue.split("<")
      if (!isNaN(parseFloat(splitStr[1]))) {
        return row.original[id] < splitStr[1]
      }
    }
    return true
  })
}
