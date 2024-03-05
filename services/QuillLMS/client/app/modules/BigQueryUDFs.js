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

  function findLastIndex(array, offset, fn) {
    const reversedArray = [...array.slice(offset+1)].reverse()
    const reversedIdx = reversedArray.findIndex(fn)
    if (reversedIdx === -1) return -1
    return array.length - 1 - reversedIdx
  }

  function allArraysEqualLength(...arrayLengths) {
    const firstArrayLength = arrayLengths.pop()

    return arrayLengths.every(x => x === firstArrayLength)
  }

  function getSkillScore(zipped, errorMessageArray, skillGroupName, preOrPost) {
    if (preOrPost === 'pre') {
      const row = zipped.filter(x => x.activityId === PRE_DIAGNOSTIC_ACTIVITY_ID).find(
        x => x.skillGroupName === skillGroupName
      )
      if (!row) {
        errorMessageArray.push(`Could not find row with skillGroupName ${skillGroupName}`)
        return 0
      }
      return row.score
    }
    else {
      const row = zipped.filter(x => x.activityId === POST_DIAGNOSTIC_ACTIVITY_ID).find(
        x => x.skillGroupName === skillGroupName
      )
      if (!row) {
        errorMessageArray.push(`Could not find row with skillGroupName ${skillGroupName}`)
        return 0
      }
      return row.score
    }
  }

  //source: https://docs.google.com/spreadsheets/d/1JFey0UpMkmPzkQtZKsr_FdXRXnNEDFXZe52H7dUMg9E/edit#gid=0
  const skillGroupsByActivity = {
    1161: [
      { id: 167, name: 'Sentences with To Be' },
      { id: 168, name: 'Sentences With Have' },
      { id: 169, name: 'Sentences With Want' },
      { id: 170, name: 'Listing Adjectives and Nouns' },
      { id: 171, name: 'Writing Questions' }
    ],
    1568: [
      { id: 172, name: 'Subject-Verb Agreement' },
      { id: 173, name: 'Possessive Nouns and Pronouns' },
      { id: 174, name: 'Prepositions' },
      { id: 175, name: 'Future Tense' },
      { id: 176, name: 'Articles' },
      { id: 177, name: 'Writing Questions' }
    ],
    1590: [
      { id: 178, name: 'Regular Past Tense' },
      { id: 179, name: 'Irregular Past Tense' },
      { id: 180, name: 'Progressive Tense' },
      { id: 181, name: 'Phrasal Verbs' },
      { id: 182, name: 'ELL-Specific Skills' }
    ],
    1663: [
      { id: 123, name: 'Capitalization' },
      { id: 124, name: 'Plural and Possessive Nouns' },
      { id: 125, name: 'Adjectives and Adverbs' },
      { id: 126, name: 'Prepositional Phrases' },
      { id: 128, name: 'Compound Subjects, Objects, and Predicates' },
      { id: 216, name: 'Subject-Verb Agreement' }
    ],
    1668: [
      { id: 129, name: 'Compound Subjects, Objects, and Predicates' },
      { id: 130, name: 'Compound Sentences' },
      { id: 131, name: 'Complex Sentences' },
      { id: 132, name: 'Conjunctive Adverbs' },
      { id: 133, name: 'Parallel Structure' },
      { id: 134, name: 'Capitalization' },
      { id: 135, name: 'Subject-Verb Agreement' },
      { id: 136, name: 'Nouns, Pronouns, and Verbs' }
    ],
    1678: [
      { id: 137, name: 'Compound-Complex Sentences' },
      { id: 138, name: 'Appositive Phrases' },
      { id: 139, name: 'Relative Clauses' },
      { id: 140, name: 'Participial Phrases' },
      { id: 141, name: 'Parallel Structure' },
      { id: 142, name: 'Advanced Combining' }
    ]
  }

  let errorMessageArray = []

  const defaultReturnValue = {
    errorMessage: "Default error message"
  }

  if (!allArraysEqualLength(scores.length, activityIds.length, completedAts.length, skillGroupNames.length)) {
    return JSON.stringify({
      ...defaultReturnValue,
      ...{ errorMessage: `Unequal input lengths: ${scores.length} ${activityIds.length} ${completedAts.length} ${skillGroupNames.length}` }
    })
  }

  const zipped = zipAndSort(scores, activityIds, completedAts, skillGroupNames)

  const prePostDiagnosticActivityIdPairs = {
    1161: 1774, // ELL Starter
    1568: 1814, // ELL Intermediate
    1590: 1818, // ELL Advanced
    1663: 1664, // Starter
    1668: 1669, // Intermediate
    1678: 1680  // Advanced
  }

  const recommendedActivityCounts = {
    1161: 5,  // ELL Starter
    1568: 6,  // ELL Intermediate
    1590: 5,  // ELL Advanced
    1663: 10, // Starter
    1668: 11, // Intermediate
    1678: 9   // Advanced
  }

  const canonicalPreTestIdx = zipped.findIndex(
    elem => Object.keys(prePostDiagnosticActivityIdPairs).map(x => parseInt(x)).includes(elem.activityId)
  )

  if (canonicalPreTestIdx  === -1) {
    return JSON.stringify({
      ...defaultReturnValue,
      ...{ errorMessage: `Bad index(es): canonicalPreTestIdx: ${canonicalPreTestIdx}` }
    })
  }

  const canonicalPreTest = zipped[canonicalPreTestIdx]
  const PRE_DIAGNOSTIC_ACTIVITY_ID = canonicalPreTest.activityId


  // Once the pre diagnostic activity is known, we want to only look for its post diagnostic sibling
  const canonicalPostTestIdx = findLastIndex(
    zipped,
    canonicalPreTestIdx+1,
    elem => elem.activityId === prePostDiagnosticActivityIdPairs[PRE_DIAGNOSTIC_ACTIVITY_ID]
  )

  if (canonicalPostTestIdx === -1) {
    return JSON.stringify({
      ...defaultReturnValue,
      ...{ errorMessage: `Bad index(es): canonicalPostTestIdx: ${canonicalPostTestIdx}` }
    })
  }

  const canonicalPostTest = zipped[canonicalPostTestIdx]
  const POST_DIAGNOSTIC_ACTIVITY_ID = canonicalPostTest.activityId

  if ((!canonicalPreTest?.completedAt) ||
      (!canonicalPostTest?.completedAt) ||
      (canonicalPreTest.completedAt >= canonicalPostTest.completedAt)) {
    return JSON.stringify({
      ...defaultReturnValue,
      ...{ errorMessage: `Nonexistent or incorrect activity sequencing: canonicalPreTest?.completedAt: ${canonicalPreTest?.completedAt} canonicalPostTest?.completedAt: ${canonicalPostTest?.completedAt}`}
    })
  }

  const skillScores = skillGroupsByActivity[PRE_DIAGNOSTIC_ACTIVITY_ID].reduce(
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
      recommendedActivityCount: recommendedActivityCounts[PRE_DIAGNOSTIC_ACTIVITY_ID],
      errorMessage: errorMessageArray.join(' '),
      numAssignedRecommendedCompleted,
      ...skillScores
    }
  )
}

// params: numAssignedRecommendedCompleted STRING, recommendedActivityCount STRING
export function tierUDF(numAssignedRecommendedCompleted, recommendedActivityCount) {
  const completedCount = parseInt(numAssignedRecommendedCompleted)
  const activityCount = parseInt(recommendedActivityCount)

  if (isNaN(completedCount) ||
      isNaN(activityCount) ||
      activityCount < 1 ||
      completedCount < 0
  ) {
    return "-1"
  }
  const percentage = completedCount / activityCount * 100

  if (percentage === 0 ) { return "0%" }
  if (percentage === 100 ) { return "100%" }

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
    "91-99%":   { from: 91, to: 100}
  }

  for (const [tierName, value] of Object.entries(tiers)) {
    if (percentage >= value.from && percentage < value.to) {
      return tierName
    }
  }

}


