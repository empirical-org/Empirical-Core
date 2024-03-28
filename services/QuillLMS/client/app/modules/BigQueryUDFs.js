
// Note: Some functions, like this one, are copied out of their
// BigQuery UDFs for isolated testing. In the future, we can
// avoid this by developing a custom JS build process for BigQuery UDFs
export function findLastIndex(array, startIndex, fn) {
  const reversedArray = [...array.slice(startIndex)].reverse()
  const reversedIdx = reversedArray.findIndex(fn)
  if (reversedIdx === -1) return -1
  return array.length - 1 - reversedIdx
}

// example argument: true|1668|2023-10-31 13:37:19.789202|Subject-Verb Agreement
export function parseElement(e) {
  function removeCommas(str) {
    const regExp = /,/g
    return str.replace(regExp, '')
  }

  const stringAttributes = e.split('|')
  if (stringAttributes.length !== 4) {
    throw new Error(`Invalid element string: ${e}`)
  }

  return {
    score: stringAttributes[0] === "true" ? 1 : 0,
    activityId: parseInt(stringAttributes[1]),
    completedAt: stringAttributes[2],
    skillGroupName: removeCommas(stringAttributes[3])
  }
}

// BigQuery does not currently accept DATETIMEs as arguments for JS UDFs
// So we cast DATETIMES to STRINGS before calling this function
export function studentwiseSkillGroupUDF(elements) {
  function removeCommas(str) {
    const regExp = /,/g
    return str.replace(regExp, '')
  }

  function parseElement(e) {
    function removeCommas(str) {
      const regExp = /,/g
      return str.replace(regExp, '')
    }

    const stringAttributes = e.split('|')
    if (stringAttributes.length !== 4) {
      throw new Error(`Invalid element string: ${e}`)
    }

    return {
      score: stringAttributes[0] === "true" ? 1 : 0,
      activityId: parseInt(stringAttributes[1]),
      completedAt: stringAttributes[2],
      skillGroupName: removeCommas(stringAttributes[3])
    }
  }

  function findLastIndex(array, startIndex, fn) {
    const reversedArray = [...array.slice(startIndex)].reverse()
    const reversedIdx = reversedArray.findIndex(fn)
    if (reversedIdx === -1) return -1
    return array.length - 1 - reversedIdx
  }

  function getSkillScore(zipped, errorMessageArray, skillGroupName, preOrPost) {
    const activityId = preOrPost === 'pre' ? PRE_DIAGNOSTIC_ACTIVITY_ID : POST_DIAGNOSTIC_ACTIVITY_ID;
    const row = zipped.find(x => x.activityId === activityId && x.skillGroupName === skillGroupName);
    if (!row) {
      errorMessageArray.push(`Could not find row with skillGroupName ${skillGroupName}`)
      return 0
    }
    return row.score
  }

  //source: https://docs.google.com/spreadsheets/d/1JFey0UpMkmPzkQtZKsr_FdXRXnNEDFXZe52H7dUMg9E/edit#gid=0
  const skillGroupsByActivity = {
    1161: [
      { name: 'Sentences with To Be' },
      { name: 'Sentences With Have' },
      { name: 'Sentences With Want' },
      { name: 'Listing Adjectives and Nouns' },
      { name: 'Writing Questions' }
    ],
    1568: [
      { name: 'Subject-Verb Agreement' },
      { name: 'Possessive Nouns and Pronouns' },
      { name: 'Prepositions' },
      { name: 'Future Tense' },
      { name: 'Articles' },
      { name: 'Writing Questions' }
    ],
    1590: [
      { name: 'Regular Past Tense' },
      { name: 'Irregular Past Tense' },
      { name: 'Progressive Tense' },
      { name: 'Phrasal Verbs' },
      { name: 'ELL-Specific Skills' }
    ],
    1663: [
      { name: 'Commonly Confused Words', activities: [113, 111, 107, 112] },
      { name: 'Capitalization', activities: [802, 181, 804, 885, 801, 887, 886] },
      { name: 'Plural and Possessive Nouns', activities: [803, 283, 1440, 1308, 808] },
      { name: 'Adjectives and Adverbs', activities: [431, 301, 438, 775, 844, 843, 124, 713, 1407, 717, 1418, 1409] },
      { name: 'Prepositional Phrases', activities: [599, 712, 600, 846] },
      { name: 'Compound Subjects, Objects, and Predicates', activities: [435, 436, 434, 437, 837, 433] },
      { name: 'Subject-Verb Agreement', activities: [1054, 742, 2506] }
    ],
    1668: [
      { name: 'Compound Subjects, Objects, and Predicates' },
      { name: 'Compound Sentences' },
      { name: 'Complex Sentences' },
      { name: 'Conjunctive Adverbs' },
      { name: 'Parallel Structure' },
      { name: 'Capitalization' },
      { name: 'Subject-Verb Agreement' },
      { name: 'Nouns, Pronouns, and Verbs' }
    ],
    1678: [
      { name: 'Compound-Complex Sentences' },
      { name: 'Appositive Phrases' },
      { name: 'Relative Clauses' },
      { name: 'Participial Phrases' },
      { name: 'Parallel Structure' },
      { name: 'Advanced Combining' }
    ]
  }

  let errorMessageArray = []

  const defaultReturnValue = {
    errorMessage: "Default error message"
  }

  const prePostDiagnosticActivityIdPairs = {
    1161: 1774, // ELL Starter
    1568: 1814, // ELL Intermediate
    1590: 1818, // ELL Advanced
    1663: 1664, // Starter
    1668: 1669, // Intermediate
    1678: 1680  // Advanced
  }

  const zipped = elements.map(parseElement).sort((a,b) => (new Date(a.completedAt) - new Date(b.completedAt)))

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

  const interDiagnosticActivities = zipped.slice(canonicalPreTestIdx + 1, canonicalPostTestIdx)

  // the percentage of a student's completed activities, for a certain skill, over the recommended activities
  function getSkillTier (interDiagnosticActivities, skillRecommendedActivities) {
    const intersection = interDiagnosticActivities.map(x => x.activityId).filter(x => skillRecommendedActivities.includes(x))
    const percentageToInteger = [... new Set(intersection)].length / skillRecommendedActivities.length * 100

    if (percentageToInteger === 0 ) { return "0%" }
    if (percentageToInteger === 100 ) { return "100%" }

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
      if (percentageToInteger >= value.from && percentageToInteger < value.to) {
        return tierName
      }
    }

    return `${percentageToInteger}`
  }

  const skillScores = skillGroupsByActivity[PRE_DIAGNOSTIC_ACTIVITY_ID].reduce(
    (accum, currentValue) => {
      const formattedName = removeCommas(currentValue.name)
      const preColumnName = `${formattedName}_pre`
      const postColumnName = `${formattedName}_post`
      const skillTierColumnName = `${formattedName}_tier`
      return {
        [preColumnName]: getSkillScore(zipped, errorMessageArray, formattedName, 'pre'),
        [postColumnName]: getSkillScore(zipped, errorMessageArray, formattedName, 'post'),
        [skillTierColumnName]: getSkillTier(interDiagnosticActivities, currentValue.activities),
        ...accum
      }
    },
    {}
  )

  return JSON.stringify(
    {
      errorMessage: errorMessageArray.join(' '),
      diagnostic_pre_id: PRE_DIAGNOSTIC_ACTIVITY_ID,
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

  return `${percentage}`
}


