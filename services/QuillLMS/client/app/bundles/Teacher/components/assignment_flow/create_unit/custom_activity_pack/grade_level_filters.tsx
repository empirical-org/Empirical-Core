import * as React from 'react';

import { arrayFromNumbers, } from './shared'

import NumberSuffixBuilder from '../../../../components/modules/numberSuffixBuilder'
import { TwoThumbSlider, Tooltip, helpIcon, } from '../../../../../Shared/index'

interface GradeLevelFiltersProps {
  gradeLevelFilters: number[],
  handleGradeLevelFilterChange: (gradeLevelFilters: number[]) => void,
}

const GRADE_LEVEL_LABELS = ['2-3', '4-5', '6-7', '8-9', '10-12']
const MIN_LEVEL = 0
const MAX_LEVEL = GRADE_LEVEL_LABELS.length - 1

const tooltipText = "The grade level helps you see which activities are accessible to your students, considering things like readability and the topic of the activity. Students never see the grade level of the activities they’re assigned.<br/><br/>We recommend filtering by the grade you teach, and then using the readability and the concepts filters to narrow down which activities are right for your students. Grades are always presented as a range, rather than as a level, because students in later grades can also benefit from more basic activities.<br/><br/>Click the “?” icon to learn more about how we determine grade ranges and for helpful filtering tips."

const GradeLevelFilters = ({ gradeLevelFilters, handleGradeLevelFilterChange, }: GradeLevelFiltersProps) => {
  function onChange(valuesArray: number[]) {
    const lowerValue = valuesArray[0]
    const upperValue = valuesArray[1]
    if (lowerValue === MIN_LEVEL && upperValue === MAX_LEVEL) {
      handleGradeLevelFilterChange([]) // don't treat default as a filter
    } else {
      const lowestGrade = GRADE_LEVEL_LABELS[lowerValue].split('-')[0]
      const highestGrade = GRADE_LEVEL_LABELS[upperValue].split('-')[1]

      handleGradeLevelFilterChange(arrayFromNumbers(Number(lowestGrade), Number(highestGrade)))
    }
  }

  function clearAllGradeLevelFilters() { handleGradeLevelFilterChange([]) }

  const clearButton = gradeLevelFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllGradeLevelFilters} type="button">Clear</button> : <span />

  const lowerValue = gradeLevelFilters[0] ? GRADE_LEVEL_LABELS.findIndex(label => label.includes(String(gradeLevelFilters[0]))) : MIN_LEVEL
  const upperFilter = gradeLevelFilters[gradeLevelFilters.length - 1]
  const upperValue = upperFilter ? GRADE_LEVEL_LABELS.findIndex(label => label.includes(String(upperFilter))) : MAX_LEVEL
  const lowestGrade = GRADE_LEVEL_LABELS[lowerValue].split('-')[0]
  const highestGrade = GRADE_LEVEL_LABELS[upperValue].split('-')[1]

  const filterSectionContent = (
    <div className="tooltip-trigger-filter-section-content">
      <div className="hoverbox" />
      <div className="name-and-clear-wrapper">
        <h2>
          <span>Grade Level</span>
          <a className="focus-on-light interactive-wrapper" href="https://support.quill.org/en/articles/1804176-ccss-vs-readability-how-does-quill-sort-activities"><img alt={helpIcon.alt} src={helpIcon.src} /></a>
        </h2>
        {clearButton}
      </div>
      <div className="slider-wrapper">
        <label htmlFor="grade-level-slider">Grade Level: {NumberSuffixBuilder(lowestGrade)} - {NumberSuffixBuilder(highestGrade)}</label>
        <TwoThumbSlider
          handleChange={onChange}
          id="grade-level-slider"
          lowerValue={lowerValue}
          markLabels={GRADE_LEVEL_LABELS}
          maxValue={MAX_LEVEL}
          minValue={MIN_LEVEL}
          step={1}
          upperValue={upperValue}
        />
      </div>
    </div>
  )

  return (
    <section className="filter-section grade-level">
      <Tooltip
        isTabbable={false}
        tooltipText={tooltipText}
        tooltipTriggerText={filterSectionContent}
      />
    </section>
  )
}

export default GradeLevelFilters
