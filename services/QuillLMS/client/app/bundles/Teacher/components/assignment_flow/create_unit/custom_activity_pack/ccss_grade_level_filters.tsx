import * as React from 'react';

import { arrayFromNumbers } from './shared';

import { helpIcon, Tooltip, TwoThumbSlider } from '../../../../../Shared/index';

interface CCSSGradeLevelFiltersProps {
  ccssGradeLevelFilters: number[],
  handleCCSSGradeLevelFilterChange: (ccssGradeLevelFilters: number[]) => void,
}

const MIN_LEVEL = 1
const MAX_LEVEL = 11

const tooltipText = "Each activity is aligned to a Common Core standard and the grade level associated with that standard.<br/><br/>Use this filter to see activities that are aligned to a standard within the selected grade level. For example, filter by 6-7 to see all activities aligned to a 6th or 7th grade CCSS.<br/><br/>Since CCSS are often overlapping and span multiple grades, we recommend setting a wide range so you don’t miss out on activities that may still be right for your students!<br/><br/>Click the “?” to learn more about CCSS grade levels and for helpful filtering tips."

const CCSSGradeLevelFilters = ({ ccssGradeLevelFilters, handleCCSSGradeLevelFilterChange, }: CCSSGradeLevelFiltersProps) => {
  function onChange(valuesArray: number[]) {
    const ccssGradeLevelArray = valuesArray[0] === MIN_LEVEL && valuesArray[1] === MAX_LEVEL ? [] : arrayFromNumbers(valuesArray[0], valuesArray[1]) // don't treat default as a filter
    handleCCSSGradeLevelFilterChange(ccssGradeLevelArray)
  }

  function clearAllCCSSGradeLevelFilters() { handleCCSSGradeLevelFilterChange([]) }

  const clearButton = ccssGradeLevelFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllCCSSGradeLevelFilters} type="button">Clear</button> : <span />

  const lowerValue = ccssGradeLevelFilters[0] || MIN_LEVEL
  const upperValue = ccssGradeLevelFilters[ccssGradeLevelFilters.length - 1] || MAX_LEVEL

  const filterSectionContent = (
    <div className="tooltip-trigger-filter-section-content">
      <div className="hoverbox" />
      <div className="name-and-clear-wrapper">
        <h2>
          <span>CCSS Grade Level</span>
          <a className="focus-on-light interactive-wrapper" href="https://support.quill.org/en/articles/1804176-ccss-vs-readability-how-does-quill-sort-activities" rel="noopener noreferrer" target="_blank"><img alt={helpIcon.alt} src={helpIcon.src} /></a>
        </h2>
        {clearButton}
      </div>
      <div className="slider-wrapper">
        <label htmlFor="ccss-grade-level-slider">Standard: {lowerValue} - {upperValue} Grade Level</label>
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
    </div>
  )

  return (
    <section className="filter-section ccss-grade-level">
      <Tooltip
        isTabbable={false}
        tooltipText={tooltipText}
        tooltipTriggerText={filterSectionContent}
      />
    </section>
  )
}

export default CCSSGradeLevelFilters
