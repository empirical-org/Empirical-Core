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

const GradeLevelFilters = ({ gradeLevelFilters, handleGradeLevelFilterChange, }: GradeLevelFiltersProps) => {
  function onChange(valuesArray: number[]) {
    const gradeLevelArray = valuesArray[0] === 1 && valuesArray[1] === 11 ? [] : arrayFromNumbers(valuesArray[0], valuesArray[1]) // don't treat default as a filter
    handleGradeLevelFilterChange(gradeLevelArray)
  }

  function clearAllGradeLevelFilters() { handleGradeLevelFilterChange([]) }

  const clearButton = gradeLevelFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllGradeLevelFilters} type="button">Clear</button> : <span />

  return (<section className="filter-section">
    <div className="name-and-clear-wrapper">
      <h2>CCSS Grade Level</h2>
      {clearButton}
    </div>
    <div className="slider-wrapper">
      <label htmlFor="grade-level-slider">Standard: 1-11 Grade Level</label>
      <TwoThumbSlider
        handleChange={onChange}
        id="grade-level-slider"
        lowerValue={gradeLevelFilters[0] || 1}
        markLabels={arrayFromNumbers(1, 11)}
        maxValue={11}
        minValue={1}
        step={1}
        upperValue={gradeLevelFilters[gradeLevelFilters.length - 1] || 11}
      />
    </div>
  </section>)
}

export default GradeLevelFilters
