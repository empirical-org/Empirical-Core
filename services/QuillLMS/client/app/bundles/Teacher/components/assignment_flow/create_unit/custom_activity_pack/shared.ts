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
