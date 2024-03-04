// BigQuery does not currently accept DATETIMEs as arguments for JS UDFs
// So we cast DATETIMES to STRINGS before calling this function
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
    return JSON.stringify({
      ...defaultReturnValue,
      ...{ errorMessage: `Unequal input lengths: ${scores.length} ${activityIds.length} ${completedAts.length} ${skillGroupNames.length}` }
    })
  }

  const zipped = zipAndSort(scores, activityIds, completedAts, skillGroupNames)
  const PRE_DIAGNOSTIC_ACTIVITY_ID = 1663
  const POST_DIAGNOSTIC_ACTIVITY_ID = 1664
  const canonicalPreTestIdx = zipped.findIndex( elem => elem.activityId == PRE_DIAGNOSTIC_ACTIVITY_ID )
  const canonicalPostTestIdx = findLastIndex( zipped, elem => elem.activityId == POST_DIAGNOSTIC_ACTIVITY_ID )

  if ((canonicalPreTestIdx  == -1) ||
      (canonicalPostTestIdx == -1)) {
    return JSON.stringify({
      ...defaultReturnValue,
      ...{ errorMessage: `Bad index(es): canonicalPreTestIdx: ${canonicalPreTestIdx} canonicalPostTestIdx: ${canonicalPostTestIdx}` }
    })
  }

  const canonicalPreTest = zipped[canonicalPreTestIdx]
  const canonicalPostTest = zipped[canonicalPostTestIdx]

  if ((!canonicalPreTest?.completedAt) ||
      (!canonicalPostTest?.completedAt) ||
      (canonicalPreTest.completedAt >= canonicalPostTest.completedAt)) {
    return JSON.stringify({
      ...defaultReturnValue,
      ...{ errorMessage: `Nonexistent or incorrect sequencing: canonicalPreTest?.completedAt: ${canonicalPreTest?.completedAt} canonicalPostTest?.completedAt: ${canonicalPostTest?.completedAt}`}
    })
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

  const numAssignedRecommendedCompleted = zipped.slice(canonicalPreTestIdx, canonicalPostTestIdx).length - 1

  return JSON.stringify(
    {
      errorMessage: errorMessageArray.join(' '),
      numAssignedRecommendedCompleted,
      ...skillScores
    }
  )
}

export function percentToTier(percentage) {
  const theNumber = percentage * 100
  if (percentage == 0 ) { return "0%" }
  if (percentage ==  100 ) { return "100%" }

  const tiers = {
    "1-10%":    { from: 0, to: 11},
    "11-20%":   { from: 11, to: 21},
    "21-30%":   { from: 21, to: 31},
    "31-40%":   { from: 31, to: 41},
    "41-50%":   { from: 41, to: 51},
    "51-60%":   { from: 51, to: 61},
    "61-70%":   { from: 61, to: 71},
    "71-80%":   { from: 71, to: 81},
    "81-90%":   { from: 81, to: 91},
    "91-99%":   { from: 91, to: 100},
  }

  for (const [tierName, value] of Object.entries(tiers)) {
    if (theNumber >= value.from && theNumber < value.to) {
      return tierName
    }
  }

}