import * as React from 'react';

import { arrayFromNumbers, } from './shared'

import { TwoThumbSlider, Tooltip, helpIcon, } from '../../../../../Shared/index'

interface ReadabilityGradeLevelFiltersProps {
  readabilityGradeLevelFilters: number[],
  handleReadabilityGradeLevelFilterChange: (readabilityGradeLevelFilters: number[]) => void,
}

const READABILITY_GRADE_LEVEL_LABELS = ['2-3', '4-5', '6-7', '8-9', '10-12']
const MIN_LEVEL = 0
const MAX_LEVEL = READABILITY_GRADE_LEVEL_LABELS.length - 1

const tooltipText = "The readability level is based on the Lexile level of the activity’s prompts and text.<br/><br/>We recommend assigning activities with a readability at or below your students’ reading level so that your students can focus on building the target writing skill. Students never see the readability level of the activities they’re assigned.<br/><br/>Click the “?” Icon to learn more about our readability levels."

const ReadabilityGradeLevelFilters = ({ readabilityGradeLevelFilters, handleReadabilityGradeLevelFilterChange, }: ReadabilityGradeLevelFiltersProps) => {
  function onChange(valuesArray: number[]) {
    const readabilityGradeLevelArray = valuesArray[0] === MIN_LEVEL && valuesArray[1] === MAX_LEVEL ? [] : arrayFromNumbers(valuesArray[0], valuesArray[1]) // don't treat default as a filter
    handleReadabilityGradeLevelFilterChange(readabilityGradeLevelArray)
  }

  function clearAllReadabilityGradeLevelFilters() {
    handleReadabilityGradeLevelFilterChange([])
  }

  const clearButton = readabilityGradeLevelFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllReadabilityGradeLevelFilters} type="button">Clear</button> : <span />

  const lowerValue = readabilityGradeLevelFilters[0] || MIN_LEVEL
  const upperFilter = readabilityGradeLevelFilters[readabilityGradeLevelFilters.length - 1]
  const upperValue = upperFilter || upperFilter === 0 ? upperFilter : MAX_LEVEL
  const lowestGrade = READABILITY_GRADE_LEVEL_LABELS[lowerValue].split('-')[0]
  const highestGrade = READABILITY_GRADE_LEVEL_LABELS[upperValue].split('-')[1]

  const filterSectionContent = (
    <div className="tooltip-trigger-filter-section-content">
      <div className="hoverbox" />
      <div className="name-and-clear-wrapper">
        <h2>
          <span>Readability Level</span>
          <a className="focus-on-light interactive-wrapper" href="https://support.quill.org/en/articles/1804176-ccss-vs-readability-how-does-quill-sort-activities" rel="noopener noreferrer" target="_blank"><img alt={helpIcon.alt} src={helpIcon.src} /></a>
        </h2>
        {clearButton}
      </div>
      <div className="slider-wrapper">
        <label htmlFor="readability-grade-level-slider">Grade Level: {lowestGrade} - {highestGrade} Grade Text</label>
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
    </div>
  )

  return (
    <section className="filter-section readability">
      <Tooltip
        isTabbable={false}
        tooltipText={tooltipText}
        tooltipTriggerText={filterSectionContent}
      />
    </section>
  )
}

export default ReadabilityGradeLevelFilters
