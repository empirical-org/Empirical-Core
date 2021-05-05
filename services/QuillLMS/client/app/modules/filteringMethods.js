import * as React from 'react';

export function selectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export function filterNumbers(filter, row) {
  let value = filter.value
  if (value.includes("-")) {
    let splitStr = filter.value.split("-")
    if (!isNaN(parseFloat(splitStr[0])) && !isNaN(parseFloat(splitStr[1]))) {
      return row[filter.id] >= splitStr[0] && row[filter.id] <= splitStr[1];
    } else {
      return true;
    }
  } else if (value.includes(">")) {
    let splitStr = filter.value.split(">")
    if (!isNaN(parseFloat(splitStr[1]))) {
      return row[filter.id] > splitStr[1]
    } else {
      return true;
    }
  } else if (value.includes("<")) {
    let splitStr = filter.value.split("<")
    if (!isNaN(parseFloat(splitStr[1]))) {
      return row[filter.id] < splitStr[1]
    } else {
      return true;
    }
  } else {
    return true;
  }
}
