import { matchSorter } from 'match-sorter';

export function filterWords(filter, row, value) {
  return matchSorter(row, filter.value, { keys: [value] })
}
