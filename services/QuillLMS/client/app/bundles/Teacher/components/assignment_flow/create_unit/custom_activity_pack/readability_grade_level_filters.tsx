import * as React from 'react';

import { TwoThumbSlider, } from '../../../../../Shared/index'

interface ReadabilityGradeLevelFiltersProps {
  readabilityGradeLevelFilters: string[],
  handleReadabilityGradeLevelFilterChange: (readabilityGradeLevelFilters: string[]) => void,
}

const READABILITY_GRADE_LEVEL_OPTIONS = ['2-3', '4-5', '6-7', '8-9', '10-12']

const MIN_LEVEL = 0
const MAX_LEVEL = READABILITY_GRADE_LEVEL_OPTIONS.length - 1

const ReadabilityGradeLevelFilters = ({ readabilityGradeLevelFilters, handleReadabilityGradeLevelFilterChange, }: ReadabilityGradeLevelFiltersProps) => {
  function onChange(valuesArray: number[]) {
    const readabilityGradeLevelArray = valuesArray[0] === MIN_LEVEL && valuesArray[1] === MAX_LEVEL ? [] : [...READABILITY_GRADE_LEVEL_OPTIONS].splice(valuesArray[0], valuesArray[1] + 1) // don't treat default as a filter
    handleReadabilityGradeLevelFilterChange(readabilityGradeLevelArray)
  }

  function clearAllReadabilityGradeLevelFilters() { handleReadabilityGradeLevelFilterChange([]) }

  const clearButton = readabilityGradeLevelFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllReadabilityGradeLevelFilters} type="button">Clear</button> : <span />

  const lowestIndex = READABILITY_GRADE_LEVEL_OPTIONS.findIndex(e => e === readabilityGradeLevelFilters[0])
  const highestIndex = READABILITY_GRADE_LEVEL_OPTIONS.findIndex(e => e === readabilityGradeLevelFilters[readabilityGradeLevelFilters.length - 1])
  const lowerValue = lowestIndex === -1 ? MIN_LEVEL : lowestIndex
  const upperValue = highestIndex === -1 ? MAX_LEVEL : highestIndex
  const lowestGrade = lowestIndex === -1 ? 2 : READABILITY_GRADE_LEVEL_OPTIONS[lowestIndex].split('-')[0]
  const highestGrade = highestIndex === -1 ? 12 : READABILITY_GRADE_LEVEL_OPTIONS[highestIndex].split('-')[1]

  return (<section className="filter-section">
    <div className="name-and-clear-wrapper">
      <h2>Readability Grade Level</h2>
      {clearButton}
    </div>
    <div className="slider-wrapper">
      <label htmlFor="readability-grade-level-slider">Readability: {lowestGrade}-{highestGrade} Grade Level</label>
      <TwoThumbSlider
        handleChange={onChange}
        id="readability-grade-level-slider"
        lowerValue={lowerValue}
        markLabels={READABILITY_GRADE_LEVEL_OPTIONS}
        maxValue={MAX_LEVEL}
        minValue={MIN_LEVEL}
        step={1}
        upperValue={upperValue}
      />
    </div>
  </section>)
}

export default ReadabilityGradeLevelFilters
