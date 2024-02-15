
// BigQuery does not currently accept DATETIMEs as arguments for JS UDFs
// So we cast DATETIMES to STRINGS before calling this function
export function extractDiagnosticMetadataFromActivityArray(activity_ids_array, completed_at_array, scores_array) {
  function zipAndSort(activity_ids_array, completed_at_array, scores_array) {

    const zipped = completed_at_array.map(
      (elem, i) => ({completed_at: elem, score: scores_array[i], activity_id: activity_ids_array[i]})
    )
    return zipped.sort((a,b) => (new Date(a.completed_at) - new Date(b.completed_at)))
  }

  function findLastIndex(array, fn) {
    const reversedArray = [...array].reverse()
    const reversedIdx = reversedArray.findIndex(fn)
    if (reversedIdx === -1) return -1
    return array.length - 1 - reversedIdx
  }

  const zipped = zipAndSort(activity_ids_array, completed_at_array, scores_array)
  const diagnosticPreActivityIds = "1678 1568 1161 1668 1590 1663".split(' ').map(x => parseInt(x))
  const diagnosticPostActivityIds = "1664 1669 1680".split(' ').map(x => parseInt(x))

  // We currently define 'canonical' tests as those which maximally span a stuent's
  // activities, chronologically
  const canonicalPreTestIdx = zipped.findIndex( elem => diagnosticPreActivityIds.includes(elem.activity_id) )
  const canonicalPostTestIdx = findLastIndex(zipped, elem => diagnosticPostActivityIds.includes(elem.activity_id) )

  const defaultReturnValue = { preTestScore: -1, numRecsCompleted: 0, postTestScore: -1 }

  if ((canonicalPreTestIdx  == -1) ||
      (canonicalPostTestIdx == -1)) {
    return defaultReturnValue
  }

  const canonicalPreTest = zipped[canonicalPreTestIdx]
  const canonicalPostTest = zipped[canonicalPostTestIdx]

  if ((!canonicalPreTest?.completed_at) ||
      (!canonicalPostTest?.completed_at) ||
      (canonicalPreTest.completed_at >= canonicalPostTest.completed_at)) {
    return defaultReturnValue
  }

  const numAssignedRecommendedCompleted = zipped.slice(canonicalPreTestIdx, canonicalPostTestIdx).length - 1

  return {
    preTestScore: canonicalPreTest.score,
    numAssignedRecommendedCompleted,
    postTestScore: canonicalPostTest.score
  }
}
