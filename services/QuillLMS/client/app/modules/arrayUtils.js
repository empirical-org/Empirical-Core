
// BigQuery does not currently accept DATETIMEs as arguments for JS UDFs
// So we cast DATETIMES to STRINGS before calling this function

// (scores Array<FLOAT64>, conceptNames Array<STRING>, activityIds Array<INTEGER>, completedAts Array<STRING>)
export function studentwiseAggregateUDF(scores, conceptNames, activityIds, completedAts) {
  function zipAndSort(scores, conceptNames, activityIds, completedAts) {
    const zipped = completedAts.map(
      (elem, i) => ({
        completedAt: elem,
        score: scores[i],
        activityId: activityIds[i],
        conceptName: conceptNames[i]

      })
    )
    return zipped.sort((a,b) => (new Date(a.completedAt) - new Date(b.completedAt)))
  }

  function findLastIndex(array, fn) {
    const reversedArray = [...array].reverse()
    const reversedIdx = reversedArray.findIndex(fn)
    if (reversedIdx === -1) return -1
    return array.length - 1 - reversedIdx
  }

  function allArraysEqualLength(scoresLength, conceptNamesLength, activityIdsLength, completedAtsLength) {
    return [scoresLength, conceptNamesLength, activityIdsLength].every(x => x == completedAtsLength)
  }

  if (!allArraysEqualLength(scores.length, conceptNames.length, activityIds.length, completedAts.length)) {
    errorMessage = `Unequal input lengths: ${scores.length} ${conceptNames.length} ${activityIds.length} ${completedAts.length}`
  }

  const zipped = zipAndSort(scores, conceptNames, activityIds, completedAts)
  const diagnosticPreActivityIds = "1678 1568 1161 1668 1590 1663".split(' ').map(x => parseInt(x))
  const diagnosticPostActivityIds = "1664 1669 1680 1774 1814 1818".split(' ').map(x => parseInt(x))
  const conceptAllowList = ['Pronouns'] // TODO
  let errorMessage = undefined

  // We currently define 'canonical' tests as those which maximally span a student's
  // activities, chronologically
  const canonicalPreTestIdx = zipped.findIndex( elem => diagnosticPreActivityIds.includes(parseInt(elem.activityId)) )
  const canonicalPostTestIdx = findLastIndex(zipped, elem => diagnosticPostActivityIds.includes(parseInt(elem.activityId)) )

  const defaultReturnValue = { errorMessage: "Something happened", Pronouns: 0, spannedActivityCount: 0 }

  if ((canonicalPreTestIdx  == -1) ||
      (canonicalPostTestIdx == -1)) {
    return {
      ...defaultReturnValue,
      ...{ errorMessage: `Bad index(es): canonicalPreTestIdx: ${canonicalPreTestIdx} canonicalPostTestIdx: ${canonicalPostTestIdx}` }
    }
  }

  const canonicalPreTest = zipped[canonicalPreTestIdx]
  const canonicalPostTest = zipped[canonicalPostTestIdx]

  if ((!canonicalPreTest?.completedAt) ||
      (!canonicalPostTest?.completedAt) ||
      (canonicalPreTest.completedAt >= canonicalPostTest.completedAt)) {
    return {
      ...defaultReturnValue,
      ...{ errorMessage: `Nonexistent or incorrect sequencing: canonicalPreTest?.completedAt: ${canonicalPreTest?.completedAt} canonicalPostTest?.completedAt: ${canonicalPostTest?.completedAt}`}
    }
  }

  const numAssignedRecommendedCompleted = zipped.slice(canonicalPreTestIdx, canonicalPostTestIdx).length - 1

  // need to account for accum
  // const skillScoreAssoc = conceptAllowList.reduce(
  //   (accum, currentValue) => ({[currentValue]: zipped.find(elem => elem.conceptName == currentValue)?.score}),
  //   {}
  // )

  return {
    errorMessage,
    spannedActivityCount: numAssignedRecommendedCompleted,
    ...skillScoreAssoc
  }
}

export function studentwiseSkillGroupUDF(scores, activityIds, completedAts, skillGroupNames) {
  function boolToInt(bool) { return bool ? 1 : 0}

  function zipAndSort(scores, activityIds, completedAts, skillGroupNames) {
    const zipped = completedAts.map(
      (elem, i) => ({
        completedAt: elem,
        score: boolToInt(scores[i]),
        activityId: parseInt(activityIds[i]),
        skillGroupName: skillGroupNames[i]

      })
    )
    return zipped.sort((a,b) => (new Date(a.completedAt) - new Date(b.completedAt)))
  }

  function findLastIndex(array, fn) {
    const reversedArray = [...array].reverse()
    const reversedIdx = reversedArray.findIndex(fn)
    if (reversedIdx === -1) return -1
    return array.length - 1 - reversedIdx
  }

  function allArraysEqualLength(...arrayLengths) {
    const firstArrayLength = arrayLengths.pop()

    return arrayLengths.every(x => x == firstArrayLength)
  }

  function getSkillScore(zipped, errorMessageArray, skillGroupName, preOrPost) {
    if (preOrPost == 'pre') {
      const row = zipped.filter(x => x.activityId == PRE_DIAGNOSTIC_ACTIVITY_ID).find(
        x => x.skillGroupName == skillGroupName
      )
      if (!row) {
        errorMessageArray.push(`Could not find row with skillGroupName ${skillGroupName}`)
        return 0
      }
      return row.score
    }
    else {
      const row = zipped.filter(x => x.activityId == POST_DIAGNOSTIC_ACTIVITY_ID).find(
        x => x.skillGroupName == skillGroupName
      )
      if (!row) {
        errorMessageArray.push(`Could not find row with skillGroupName ${skillGroupName}`)
        return 0
      }
      return row.score
    }
  }

  const skillGroupAllowList = [
    { id: 123, name: 'Capitalization' },
    { id: 124, name: 'Plural and Possessive Nouns' },
    { id: 125, name: 'Adjectives and Adverbs' },
    { id: 126, name: 'Prepositional Phrases' },
    //{ id: 127, name: 'Capitalization' },
    { id: 128, name: 'Compound Subjects, Objects, and Predicates' },
    { id: 216, name: 'Subject-Verb Agreement' }
  ]

  let errorMessageArray = []

  const defaultReturnValue = {
    errorMessage: "Default error message",
    ...skillGroupAllowList.reduce((accum, elem) => ({[`${elem.name}_pre`]: 0, [`${elem.name}_post`]: 0}), {})
  }

  if (!allArraysEqualLength(scores.length, activityIds.length, completedAts.length, skillGroupNames.length)) {
    return {
      ...defaultReturnValue,
      ...{ errorMessage: `Unequal input lengths: ${scores.length} ${activityIds.length} ${completedAts.length} ${skillGroupNames.length}` }
    }
  }

  const zipped = zipAndSort(scores, activityIds, completedAts, skillGroupNames)
  const PRE_DIAGNOSTIC_ACTIVITY_ID = 1663
  const POST_DIAGNOSTIC_ACTIVITY_ID = 1664
  const canonicalPreTestIdx = zipped.findIndex( elem => elem.activityId == PRE_DIAGNOSTIC_ACTIVITY_ID )
  const canonicalPostTestIdx = findLastIndex( zipped, elem => elem.activityId == POST_DIAGNOSTIC_ACTIVITY_ID )

  if ((canonicalPreTestIdx  == -1) ||
      (canonicalPostTestIdx == -1)) {
    return {
      ...defaultReturnValue,
      ...{ errorMessage: `Bad index(es): canonicalPreTestIdx: ${canonicalPreTestIdx} canonicalPostTestIdx: ${canonicalPostTestIdx}` }
    }
  }

  const canonicalPreTest = zipped[canonicalPreTestIdx]
  const canonicalPostTest = zipped[canonicalPostTestIdx]

  if ((!canonicalPreTest?.completedAt) ||
      (!canonicalPostTest?.completedAt) ||
      (canonicalPreTest.completedAt >= canonicalPostTest.completedAt)) {
    return {
      ...defaultReturnValue,
      ...{ errorMessage: `Nonexistent or incorrect sequencing: canonicalPreTest?.completedAt: ${canonicalPreTest?.completedAt} canonicalPostTest?.completedAt: ${canonicalPostTest?.completedAt}`}
    }
  }

  const skillScores = skillGroupAllowList.reduce(
    (accum, currentValue) => {
      const preColumnName = `${currentValue.name}_pre`
      const postColumnName = `${currentValue.name}_post`
      return {
        [preColumnName]: getSkillScore(zipped, errorMessageArray, currentValue.name, 'pre'),
        [postColumnName]: getSkillScore(zipped, errorMessageArray, currentValue.name, 'post'),
        ...accum
      }
    },
    {}
  )

  return JSON.stringify(
    {
      errorMessage: errorMessageArray.join(' '),
      ...skillScores
    }
  )
}