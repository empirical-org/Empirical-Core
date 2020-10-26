import * as React from 'react';

import { TwoThumbSlider, } from '../../../../../Shared/index'

interface GradeLevelFiltersProps {
  gradeLevelFilters: number[],
  handleGradeLevelFilterChange: (gradeLevelFilters: number[]) => void,
}

function arrayFromNumbers(lowerValue: number, upperValue: number) {
  const array = []
  for (let i = lowerValue; i <= upperValue; i++) {
    array.push(i)
  }
  return array
}

const MIN_LEVEL = 1
const MAX_LEVEL = 11

const GradeLevelFilters = ({ gradeLevelFilters, handleGradeLevelFilterChange, }: GradeLevelFiltersProps) => {
  function onChange(valuesArray: number[]) {
    const gradeLevelArray = valuesArray[0] === MIN_LEVEL && valuesArray[1] === MAX_LEVEL ? [] : arrayFromNumbers(valuesArray[0], valuesArray[1]) // don't treat default as a filter
    handleGradeLevelFilterChange(gradeLevelArray)
  }

  function clearAllGradeLevelFilters() { handleGradeLevelFilterChange([]) }

  const clearButton = gradeLevelFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllGradeLevelFilters} type="button">Clear</button> : <span />

  const lowerValue = gradeLevelFilters[0] || MIN_LEVEL
  const upperValue = gradeLevelFilters[gradeLevelFilters.length - 1] || MAX_LEVEL

  return (<section className="filter-section">
    <div className="name-and-clear-wrapper">
      <h2>CCSS Grade Level</h2>
      {clearButton}
    </div>
    <div className="slider-wrapper">
      <label htmlFor="grade-level-slider">Standard: {lowerValue}-{upperValue} Grade Level</label>
      <TwoThumbSlider
        handleChange={onChange}
        id="grade-level-slider"
        lowerValue={lowerValue}
        markLabels={arrayFromNumbers(MIN_LEVEL, MAX_LEVEL)}
        maxValue={MAX_LEVEL}
        minValue={MIN_LEVEL}
        step={1}
        upperValue={upperValue}
      />
    </div>
  </section>)
}

export default GradeLevelFilters
