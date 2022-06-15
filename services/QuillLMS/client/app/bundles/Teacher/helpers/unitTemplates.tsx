
const ALL_FLAGS = 'All Flags';
const ALL_DIAGNOSTICS = 'All Diagnostics';
const ARCHIVED_FLAG = 'Archived';
const NOT_ARCHIVED_FLAG = 'Not Archived';

export function sortUnitTemplates (list) {
  return list.sort((bp1, bp2) => {
    // Group archived activities at the bottom of the list (they automatically get a higher order number
    // than any unarchived activity)
    if (bp1.flag.toLowerCase() === ARCHIVED_FLAG && bp2.flag.toLowerCase() !== ARCHIVED_FLAG) {
      return 1
    } else if (bp2.flag.toLowerCase() === ARCHIVED_FLAG && bp1.flag.toLowerCase() !== ARCHIVED_FLAG) {
      return -1
    }
    return bp1.order_number - bp2.order_number
  })
}

export function orderedUnitTemplates({
  diagnostic,
  fetchedData,
  flag,
  searchByActivityPack,
  searchInput
}) {
  let filteredData = fetchedData
  if (flag === NOT_ARCHIVED_FLAG) {
    filteredData = fetchedData.filter(data => data.flag !== ARCHIVED_FLAG.toLowerCase())
  } else if (flag !== ALL_FLAGS) {
    filteredData = fetchedData.filter(data => data.flag === flag.toLowerCase())
  }

  if (searchInput !== '' && searchByActivityPack) {
    filteredData = filteredData.filter(activity => {
      const { name } = activity;
      return name.toLowerCase().includes(searchInput.toLowerCase());
    })
  }

  if (searchInput !== '' && !searchByActivityPack) {
    filteredData = filteredData.filter(value => {
      return (
        value.activities && value.activities.map(x => x.name || '').some(y => y.toLowerCase().includes(searchInput.toLowerCase()))
      );
    })
  }

  if (diagnostic !== ALL_DIAGNOSTICS) {
    filteredData = filteredData.filter(value => {
      return (
        value.diagnostic_names && value.diagnostic_names.some(y => y.toLowerCase().includes(diagnostic.toLowerCase()))
      );
    })
  }

  return sortUnitTemplates(filteredData)
}
