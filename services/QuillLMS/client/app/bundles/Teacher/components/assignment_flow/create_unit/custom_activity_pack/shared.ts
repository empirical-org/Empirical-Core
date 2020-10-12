import { Activity } from './interfaces'

const RESULTS_PER_PAGE = 20

export const calculateNumberOfPages = (activities: Activity[]) => Math.ceil(activities.length / RESULTS_PER_PAGE)

export const lowerBound = (currentPage: number): number => (currentPage - 1) * RESULTS_PER_PAGE;

export const upperBound = (currentPage: number): number => currentPage * RESULTS_PER_PAGE;

export const activityClassificationGroupings = [
  {
    group: 'Independent Practice',
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
  const numberMatch = string.match(/\d+/g)
  if (numberMatch) { return Number(numberMatch[0]) }

  return null
}

export const ACTIVITY_CLASSIFICATION_FILTERS = 'activityClassificationFilters'

export const ACTIVITY_CATEGORY_FILTERS = 'activityCategoryFilters'

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

function filterByGradeLevel(gradeLevelFilters: number[], activity: Activity) {
  if (!gradeLevelFilters.length) { return true }
  const numberFromStandardLevel = getNumberFromString(activity.standard_level_name)
  return gradeLevelFilters.includes(numberFromStandardLevel)
}

export const filters = {
  search: filterBySearch,
  [ACTIVITY_CLASSIFICATION_FILTERS]: filterByActivityClassification,
  gradeLevelFilters: filterByGradeLevel,
  [ACTIVITY_CATEGORY_FILTERS]: filterByActivityCategory
}
