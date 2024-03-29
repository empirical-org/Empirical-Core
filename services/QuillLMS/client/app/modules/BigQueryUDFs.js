
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
      { name: 'Sentences with To Be', activities: [1096, 1097, 1098, 1099, 1100, 1101, 1137, 1102, 1103, 1104, 1105, 1144, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1153, 1114, 1152, 1136, 1145, 1154, 1151, 1138] },
      { name: 'Sentences With Have', activities: [1119, 1120, 1121, 1122, 1127, 1128, 1129, 1130, 1131]  },
      { name: 'Sentences With Want', activities: [1115, 1117, 1116, 1118, 1123, 1124, 1125, 1126, 1132, 1133]  },
      { name: 'Listing Adjectives and Nouns', activities: [1134, 1135, 1156, 1157, 1158, 1159, 1160]  },
      { name: 'Writing Questions', activities: [1139, 1155, 1142, 1140, 1141, 1143, 1148, 1146, 1149, 1147, 1150]  }
    ],
    1568: [
      { name: 'Subject-Verb Agreement', activities: [1541, 1543, 1546]  },
      { name: 'Possessive Nouns and Pronouns', activities: [1544, 1545, 1550, 1547]  },
      { name: 'Prepositions', activities: [1551, 1552, 1553, 1554, 1555, 1557, 1558, 1548]  },
      { name: 'Future Tense', activities: [1559, 1560, 1561, 1563]  },
      { name: 'Articles', activities: [1567, 1569, 1562, 1564]  },
      { name: 'Writing Questions', activities: [1571, 1570, 1573, 1549]  }
    ],
    1590: [
      { name: 'Regular Past Tense', activities: [1575, 1576, 1577, 1578]  },
      { name: 'Irregular Past Tense', activities: [1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587]  },
      { name: 'Progressive Tense', activities: [1591, 1588, 1625, 1589, 1626]  },
      { name: 'Phrasal Verbs', activities: [1627, 1628, 1629, 1654, 1657, 1655]  },
      { name: 'ELL-Specific Skills', activities: [1658, 1660, 1662, 1661]  }
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
      { name: 'Compound Subjects, Objects, and Predicates', activities: [435, 436, 434, 837, 1005]  },
      { name: 'Compound Sentences', activities: [424, 426, 428, 429, 430, 776]  },
      { name: 'Complex Sentences', activities: [417, 418, 1221, 2502, 2498, 2500, 2496, 2497, 2501, 2499]  },
      { name: 'Conjunctive Adverbs', activities: [755, 759, 851, 863, 757, 985, 986, 861, 993]  },
      { name: 'Parallel Structure', activities: [752, 754]  },
      { name: 'Capitalization', activities: [841, 2495, 887, 886, 840]  },
      { name: 'Subject-Verb Agreement', activities: [770, 769, 774, 772, 896]  },
      { name: 'Nouns, Pronouns, and Verbs', activities: [1486, 1452, 1487, 1488, 848, 1308, 737, 1425, 1345, 2245]  }
    ],
    1678: [
      { name: 'Compound-Complex Sentences', activities: [653, 862, 868, 869]  },
      { name: 'Advanced Combining', activities: [1414, 1283, 1281, 1223, 1441] },
      { name: 'Appositive Phrases', activities: [1211, 1220, 1213, 1212, 1214]  },
      { name: 'Relative Clauses', activities: [594, 595, 596, 1049, 598, 1002]  },
      { name: 'Participial Phrases', activities: [443, 450, 1237, 876, 878]  },
      { name: 'Parallel Structure', activities: [752, 754, 1235]  }
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
    return `${[... new Set(intersection)].length}/${skillRecommendedActivities.length}`
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
