
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

  const prePostDiagnosticActivityIdPairs = {
    1161: 1774, // ELL Starter
    1568: 1814, // ELL Intermediate
    1590: 1818, // ELL Advanced
    1663: 1664, // Starter
    1668: 1669, // Intermediate
    1678: 1680  // Advanced
  }

  const recommendedActivities = {
    1161: [1096, 1097, 1098, 1099, 1100, 1101, 1137, 1102, 1103, 1104, 1105, 1144, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1153, 1114, 1152, 1136, 1145, 1154, 1151, 1138, 1115, 1117, 1116, 1118, 1119, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1127, 1128, 1129, 1130, 1131, 1132, 1133, 1134, 1135, 1156, 1157, 1158, 1159, 1160, 1139, 1155, 1142, 1140, 1141, 1143, 1148, 1146, 1149, 1147, 1150],  // ELL Starter
    1568: [1541, 1543, 1546, 1544, 1545, 1550, 1547, 1551, 1552, 1553, 1554, 1555, 1557, 1558, 1548, 1559, 1560, 1561, 1563, 1567, 1569, 1562, 1564, 1571, 1570, 1573, 1549],  // ELL Intermediate
    1590: [1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1591, 1588, 1625, 1589, 1626, 1627, 1628, 1629, 1654, 1657, 1655, 1658, 1660, 1662, 1661],  // ELL Advanced
    1663: [802, 181, 804, 885, 801, 887, 886, 803, 283, 1440, 1308, 808, 431, 301, 438, 775, 844, 843, 124, 713, 1407, 717, 1418, 1409, 599, 712, 600, 846, 435, 436, 434, 437, 837, 433, 113, 111, 107, 112, 1054, 742, 2506], // Starter
    1668: [435, 436, 434, 837, 1005, 424, 426, 428, 429, 430, 776, 417, 418, 1221, 2502, 2498, 2500, 2496, 2497, 2501, 2499, 755, 759, 851, 863, 757, 985, 986, 861, 993, 752, 754, 841, 2495, 887, 886, 840, 770, 769, 774, 772, 896, 1486, 1452, 1487, 1488, 848, 1308, 737, 1425, 1345, 2245], // Intermediate
    1678: [653, 862, 868, 869, 1211, 1220, 1213, 1212, 1214, 594, 595, 596, 1049, 598, 1002, 443, 450, 1237, 876, 878, 752, 754, 1235, 1414, 1283, 1281, 1223, 1441]   // Advanced
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

  const skillScores = skillGroupsByActivity[PRE_DIAGNOSTIC_ACTIVITY_ID].reduce(
    (accum, currentValue) => {
      const formattedName = removeCommas(currentValue.name)
      const preColumnName = `${formattedName}_pre`
      const postColumnName = `${formattedName}_post`
      return {
        [preColumnName]: getSkillScore(zipped, errorMessageArray, formattedName, 'pre'),
        [postColumnName]: getSkillScore(zipped, errorMessageArray, formattedName, 'post'),
        ...accum
      }
    },
    {}
  )
  const interDiagnosticActivities = zipped.slice(canonicalPreTestIdx + 1, canonicalPostTestIdx)
  const nonUniques = interDiagnosticActivities.filter(
    elem => recommendedActivities[PRE_DIAGNOSTIC_ACTIVITY_ID].includes(elem.activityId)
  )
  // project the object array to a primitive array, so we can use Set to compute uniques-by-activity
  const numAssignedRecommendedCompleted = [... new Set(nonUniques.map(x => x.activityId))].length

  return JSON.stringify(
    {
      recommendedActivityCount: recommendedActivities[PRE_DIAGNOSTIC_ACTIVITY_ID].length,
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

  return `${percentage}`
}


