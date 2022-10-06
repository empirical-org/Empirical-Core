import { Activity } from './interfaces'

const RESULTS_PER_PAGE = 20

export const AVERAGE_FONT_WIDTH = 7

export const calculateNumberOfPages = (activities: Activity[]) => Math.ceil(activities.length / RESULTS_PER_PAGE)

export const lowerBound = (currentPage: number): number => (currentPage - 1) * RESULTS_PER_PAGE;

export const upperBound = (currentPage: number): number => currentPage * RESULTS_PER_PAGE;

export const activityClassificationGroupings = [
  {
    group: 'Independent: Reading Texts',
    keys: ['evidence'],
    new: true
  },
  {
    group: 'Independent: Language Skills',
    keys: ['connect', 'sentence', 'passage']
  },
  {
    group: 'Whole Class Instruction',
    keys: ['lessons']
  },
  {
    group: 'Diagnostics',
    keys: ['diagnostic']
  }
]

export const getNumberFromString = (string) => {
  if (!string) { return null }

  const numberMatch = string.match(/\d+/g)
  if (numberMatch) { return Number(numberMatch[0]) }

  return null
}

export const ACTIVITY_CLASSIFICATION_FILTERS = 'activityClassificationFilters'

export const ACTIVITY_CATEGORY_FILTERS = 'activityCategoryFilters'

export const CONTENT_PARTNER_FILTERS = 'contentPartnerFilters'

export const EARLY_ACCESS_FILTERS = 'earlyAccessFilters'

export const FLAG_FILTERS = 'flagFilters'

export const TOPIC_FILTERS = 'topicFilters'

export const SAVED_ACTIVITY_FILTERS = 'savedActivityFilters'

export const STANDARDS_FILTERS = 'standardsFilters'

export function arrayFromNumbers(lowerValue: number, upperValue: number) {
  const array = []
  for (let i = lowerValue; i <= upperValue; i++) {
    array.push(i)
  }
  return array
}

function filterBySearch(search: string, activity: Activity) {
  const stringActivity = Object.values(activity).join(' ').toLowerCase();
  return stringActivity.includes(search.toLowerCase())
}

function filterByActivityClassification(activityClassificationFilters: string[], activity: Activity) {
  if (!activityClassificationFilters.length) { return true }
  return activityClassificationFilters.includes(activity.activity_classification.key)
}

function filterByActivityCategory(activityCategoryFilters: number[], activity: Activity) {
  if (!activityCategoryFilters.length) { return true }
  return activityCategoryFilters.includes(activity.activity_category.id)
}

function filterByStandards(standardsFilters: { ccssGradeLevelFilters: number[], ellFilters: number[]}, activity: Activity) {
  const { ccssGradeLevelFilters, ellFilters, } = standardsFilters

  if (!ccssGradeLevelFilters.length && !ellFilters.length) { return true }

  return filterByCCSSGradeLevel(ccssGradeLevelFilters, activity) || filterByELL(ellFilters, activity)
}

function filterByCCSSGradeLevel(ccssGradeLevelFilters: number[], activity: Activity) {
  if (!activity.standard_level_name?.includes('CCSS')) { return }

  const numberFromStandardLevel = getNumberFromString(activity.standard_level_name)
  return ccssGradeLevelFilters.includes(numberFromStandardLevel)
}

function filterByELL(ellLevelFilters: number[], activity: Activity) {

  if (!activity.standard_level_name?.includes('ELL')) { return }
  console.log("filterByELL: ", ellLevelFilters)
  console.log("activity standard level name:", activity.standard_level_name)
  const numberFromStandardLevel = getNumberFromString(activity.standard_level_name)
  return ellLevelFilters.includes(activity.standard_level_name)
}

const READABILITY_GRADE_LEVEL_OPTIONS = ['2nd-3rd', '4th-5th', '6th-7th', '8th-9th', '10th-12th']

function filterByReadabilityGradeLevel(readabilityGradeLevelFilters: number[], activity: Activity) {
  if (!readabilityGradeLevelFilters.length) { return true }

  const indexOfOption = READABILITY_GRADE_LEVEL_OPTIONS.findIndex(opt => opt === activity.readability_grade_level)
  return readabilityGradeLevelFilters.includes(indexOfOption)
}

function filterByGradeLevel(gradeLevelFilters: number[], activity: Activity) {
  if (!gradeLevelFilters.length) { return true }

  return activity.minimum_grade_level <= gradeLevelFilters[0]
}

function filterByContentPartners(contentPartnerFilters: number[], activity: Activity) {
  if (!contentPartnerFilters.length) { return true }
  return contentPartnerFilters.some(id => activity.content_partners.some(cp => cp.id === id))
}

function filterByEarlyAccess(earlyAccessFilters: string[], activity: Activity) {
  if (!earlyAccessFilters.length) { return true }
  return earlyAccessFilters.some(flag => activity.flags.includes(flag))
}

function filterByTopic(topicFilters: number[], activity: Activity) {
  if (!topicFilters.length) { return true }
  return topicFilters.some(id => activity.topics.some(cp => cp.id === id))
}

function filterBySavedActivityIds(savedActivityFilters: number[], activity: Activity) {
  if (!savedActivityFilters.length) { return true }
  return savedActivityFilters.some(id => Number(activity.id) === Number(id))
}

export function filterByFlag(flagFilters: string[], activity:Activity) {
  if (!flagFilters.length) { return true }
  return flagFilters.some(flag => activity.flags.includes(flag))
}

export const filters = {
  search: filterBySearch,
  [ACTIVITY_CLASSIFICATION_FILTERS]: filterByActivityClassification,
  [STANDARDS_FILTERS]: filterByStandards,
  gradeLevelFilters: filterByGradeLevel,
  readabilityGradeLevelFilters: filterByReadabilityGradeLevel,
  [ACTIVITY_CATEGORY_FILTERS]: filterByActivityCategory,
  [CONTENT_PARTNER_FILTERS]: filterByContentPartners,
  [EARLY_ACCESS_FILTERS]: filterByEarlyAccess,
  [TOPIC_FILTERS]: filterByTopic,
  [SAVED_ACTIVITY_FILTERS]: filterBySavedActivityIds,
  [FLAG_FILTERS]: filterByFlag
}

export const stringifyLowerLevelTopics = (topics) => {
  const levelOneTopic = topics.find(t => Number(t.level) === 1)
  const levelZeroTopic = topics.find(t => Number(t.level) === 0)
  let topicString = levelOneTopic ? levelOneTopic.name : ''
  topicString += levelOneTopic && levelZeroTopic ? ': ' : ''
  topicString += levelZeroTopic ? levelZeroTopic.name : ''
  return topicString
}

const conceptSort = (activities) => activities.sort((a, b) => {
  if (!a.activity_category_name) { return 1 }
  if (!b.activity_category_name) { return -1 }
  return a.activity_category_name.localeCompare(b.activity_category_name)
})

const topicSort = (activities) => {
  const sortedActivities = activities.sort((a, b) => {
    if (!(a.topics && a.topics.length)) { return 1 }
    if (!(b.topics && b.topics.length)) { return -1 }
    return stringifyLowerLevelTopics(a.topics).localeCompare(stringifyLowerLevelTopics(b.topics))
  })
  return sortedActivities
}

const numberFromStringAscendingSort = (activities, attributeKey) => activities.sort((a, b) => {
  const numberMatchA = getNumberFromString(a[attributeKey])
  const numberMatchB = getNumberFromString(b[attributeKey])

  if (!numberMatchA) { return 1 }
  if (!numberMatchB) { return -1 }

  return numberMatchA - numberMatchB
})

const numberFromStringDescendingSort = (activities, attributeKey) => activities.sort((a, b) => {
  const numberMatchA = getNumberFromString(a[attributeKey])
  const numberMatchB = getNumberFromString(b[attributeKey])

  if (!numberMatchA) { return 1 }
  if (!numberMatchB) { return -1 }

  return numberMatchB - numberMatchA
})

const numberAscendingSort = (activities, attributeKey) => activities.sort((a, b) => {
  const numberMatchA = a[attributeKey]
  const numberMatchB = b[attributeKey]

  if (!numberMatchA) { return 1 }
  if (!numberMatchB) { return -1 }

  return numberMatchA - numberMatchB
})

const numberDescendingSort = (activities, attributeKey) => activities.sort((a, b) => {
  const numberMatchA = a[attributeKey]
  const numberMatchB = b[attributeKey]

  if (!numberMatchA) { return 1 }
  if (!numberMatchB) { return -1 }

  return numberMatchB - numberMatchA
})

export const DEFAULT = 'default'
const GRADE_LEVEL_ASCENDING = 'grade-level-asc'
const GRADE_LEVEL_DESCENDING = 'grade-level-desc'
const CCSS_ASCENDING = 'ccss-asc'
const CCSS_DESCENDING = 'ccss-desc'
const READABILITY_ASCENDING = 'readability-asc'
const READABILITY_DESCENDING = 'readability-desc'
const CONCEPT = 'concept'
const TOPIC = 'topic'

export const sortFunctions = {
  [DEFAULT]: (activities) => activities,
  [GRADE_LEVEL_ASCENDING]: (activities) => numberAscendingSort(activities, 'minimum_grade_level'),
  [GRADE_LEVEL_DESCENDING]: (activities) => numberDescendingSort(activities, 'minimum_grade_level'),
  [CCSS_ASCENDING]: (activities) => numberFromStringAscendingSort(activities, 'standard_level_name'),
  [CCSS_DESCENDING]: (activities) => numberFromStringDescendingSort(activities, 'standard_level_name'),
  [READABILITY_ASCENDING]: (activities) => numberFromStringAscendingSort(activities, 'readability_grade_level'),
  [READABILITY_DESCENDING]: (activities) => numberFromStringDescendingSort(activities, 'readability_grade_level'),
  [CONCEPT]: conceptSort,
  [TOPIC]: topicSort
}

export const sortOptions = [
  {
    label: 'Default',
    key: DEFAULT,
    value: DEFAULT
  },
  {
    label: 'Grade Level Range (Low to High)',
    key: GRADE_LEVEL_ASCENDING,
    value: GRADE_LEVEL_ASCENDING
  },
  {
    label: 'Grade Level Range (High to Low)',
    key: GRADE_LEVEL_DESCENDING,
    value: GRADE_LEVEL_DESCENDING
  },
  {
    label: 'Readability Level (Low to High)',
    key: READABILITY_ASCENDING,
    value: READABILITY_ASCENDING
  },
  {
    label: 'Readability Level (High to Low)',
    key: READABILITY_DESCENDING,
    value: READABILITY_DESCENDING
  },
  {
    label: 'CCSS Grade Level (Low to High)',
    key: CCSS_ASCENDING,
    value: CCSS_ASCENDING
  },
  {
    label: 'CCSS Grade Level (High to Low)',
    key: CCSS_DESCENDING,
    value: CCSS_DESCENDING
  },
  {
    label: 'Concept',
    key: CONCEPT,
    value: CONCEPT
  },
  {
    label: 'Topic',
    key: TOPIC,
    value: TOPIC
  }
]
