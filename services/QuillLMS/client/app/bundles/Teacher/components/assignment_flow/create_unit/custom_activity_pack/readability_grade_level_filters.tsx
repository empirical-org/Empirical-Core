import * as React from 'react';

import { arrayFromNumbers, } from './shared'

import { TwoThumbSlider, } from '../../../../../Shared/index'

interface ReadabilityGradeLevelFiltersProps {
  readabilityGradeLevelFilters: number[],
  handleReadabilityGradeLevelFilterChange: (readabilityGradeLevelFilters: number[]) => void,
}

const READABILITY_GRADE_LEVEL_LABELS = ['2-3', '4-5', '6-7', '8-9', '10-12']
const MIN_LEVEL = 0
const MAX_LEVEL = READABILITY_GRADE_LEVEL_LABELS.length - 1

const ReadabilityGradeLevelFilters = ({ readabilityGradeLevelFilters, handleReadabilityGradeLevelFilterChange, }: ReadabilityGradeLevelFiltersProps) => {
  function onChange(valuesArray: number[]) {
    const readabilityGradeLevelArray = valuesArray[0] === MIN_LEVEL && valuesArray[1] === MAX_LEVEL ? [] : arrayFromNumbers(valuesArray[0], valuesArray[1]) // don't treat default as a filter
    handleReadabilityGradeLevelFilterChange(readabilityGradeLevelArray)
  }

  function clearAllReadabilityGradeLevelFilters() { handleReadabilityGradeLevelFilterChange([]) }

  const clearButton = readabilityGradeLevelFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllReadabilityGradeLevelFilters} type="button">Clear</button> : <span />

  const lowerValue = readabilityGradeLevelFilters[0] || MIN_LEVEL
  const upperFilter = readabilityGradeLevelFilters[readabilityGradeLevelFilters.length - 1]
  const upperValue = upperFilter || upperFilter === 0 ? upperFilter : MAX_LEVEL
  const lowestGrade = READABILITY_GRADE_LEVEL_LABELS[lowerValue].split('-')[0]
  const highestGrade = READABILITY_GRADE_LEVEL_LABELS[upperValue].split('-')[1]

  return (
    <section className="filter-section">
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
          markLabels={READABILITY_GRADE_LEVEL_LABELS}
          maxValue={MAX_LEVEL}
          minValue={MIN_LEVEL}
          step={1}
          upperValue={upperValue}
        />
      </div>
    </section>
  )
}

export default ReadabilityGradeLevelFilters
