import * as React from 'react';

import { arrayFromNumbers, } from './shared'

import { TwoThumbSlider, } from '../../../../../Shared/index'

interface CCSSGradeLevelFiltersProps {
  ccssGradeLevelFilters: number[],
  handleCCSSGradeLevelFilterChange: (ccssGradeLevelFilters: number[]) => void,
}

const MIN_LEVEL = 1
const MAX_LEVEL = 11

const CCSSGradeLevelFilters = ({ ccssGradeLevelFilters, handleCCSSGradeLevelFilterChange, }: CCSSGradeLevelFiltersProps) => {
  function onChange(valuesArray: number[]) {
    const ccssGradeLevelArray = valuesArray[0] === MIN_LEVEL && valuesArray[1] === MAX_LEVEL ? [] : arrayFromNumbers(valuesArray[0], valuesArray[1]) // don't treat default as a filter
    handleCCSSGradeLevelFilterChange(ccssGradeLevelArray)
  }

  function clearAllCCSSGradeLevelFilters() { handleCCSSGradeLevelFilterChange([]) }

  const clearButton = ccssGradeLevelFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllCCSSGradeLevelFilters} type="button">Clear</button> : <span />

  const lowerValue = ccssGradeLevelFilters[0] || MIN_LEVEL
  const upperValue = ccssGradeLevelFilters[ccssGradeLevelFilters.length - 1] || MAX_LEVEL

  return (
    <section className="filter-section">
      <div className="name-and-clear-wrapper">
        <h2>CCSS Grade Level</h2>
        {clearButton}
      </div>
      <div className="slider-wrapper">
        <label htmlFor="ccss-grade-level-slider">Standard: {lowerValue}-{upperValue} Grade Level</label>
        <TwoThumbSlider
          handleChange={onChange}
          id="ccss-grade-level-slider"
          lowerValue={lowerValue}
          markLabels={arrayFromNumbers(MIN_LEVEL, MAX_LEVEL)}
          maxValue={MAX_LEVEL}
          minValue={MIN_LEVEL}
          step={1}
          upperValue={upperValue}
        />
      </div>
    </section>
  )
}

export default CCSSGradeLevelFilters
