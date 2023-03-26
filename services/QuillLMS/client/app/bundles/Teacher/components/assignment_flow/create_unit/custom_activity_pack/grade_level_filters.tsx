import * as React from 'react';

import { arrayFromNumbers } from './shared';

import { helpIcon, OneThumbSlider, smallWhiteCheckIcon, Tooltip } from '../../../../../Shared/index';

interface GradeLevelFiltersProps {
  gradeLevelFilters: number[],
  handleGradeLevelFilterChange: (gradeLevelFilters: number[]) => void,
}

const GRADE_LEVEL_LABELS = ['4-5', '6-7', '8-9', '10-12']
const MIN_LEVEL = 0
const MAX_LEVEL = GRADE_LEVEL_LABELS.length - 1
const DEFAULT_VALUE = 2 // corresponds to '8-9'

const tooltipText = "The grade level range helps you see which activities are accessible to your students, considering things like readability and the topic of the activity. Students never see the grade level range of the activities they’re assigned.<br/><br/>We recommend filtering by the grade you teach, and then using the readability and the concepts filters to narrow down which activities are right for your students. Grades are always presented as a range, rather than as a level, because students in later grades can also benefit from more basic activities.<br/><br/>Click the “?” icon to learn more about how we determine grade ranges and for helpful filtering tips."

const GradeLevelFilters = ({ gradeLevelFilters, handleGradeLevelFilterChange, }: GradeLevelFiltersProps) => {
  const [defaultValue, setDefaultValue] = React.useState(DEFAULT_VALUE)

  function onChange(valuesArray: number[]) {
    const lowerValue = valuesArray[0]
    setDefaultValue(lowerValue)
    const lowestGrade = GRADE_LEVEL_LABELS[lowerValue].split('-')[0]
    handleGradeLevelFilterChange(arrayFromNumbers(Number(lowestGrade), 12))
  }

  function handleEnableGradeLevelFilters() {
    onChange([defaultValue])
  }

  function clearAllGradeLevelFilters() { handleGradeLevelFilterChange([]) }

  const clearButton = gradeLevelFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllGradeLevelFilters} type="button">Clear</button> : <span />

  let gradeLevelRangeText = 'All Grades'
  let checkbox = <button aria-label="Enable Grade Level Range filters" className="focus-on-light quill-checkbox unselected" onClick={handleEnableGradeLevelFilters} type="button" />

  if (gradeLevelFilters.length) {
    checkbox = (<button aria-label="Disable GradeLevel Range filters" className="focus-on-light quill-checkbox selected" onClick={clearAllGradeLevelFilters} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckIcon.src} />
    </button>)

    const lowerValue = GRADE_LEVEL_LABELS.findIndex(label => label.includes(String(gradeLevelFilters[0])))
    const lowestGrade = GRADE_LEVEL_LABELS[lowerValue].split('-')[0]
    gradeLevelRangeText = `${lowestGrade} - 12`
  }

  const filterSectionContent = (
    <div className="tooltip-trigger-filter-section-content">
      <div className="hoverbox" />
      <div className="name-and-clear-wrapper">
        <h2>
          <span>Grade Level Range</span>
          <a className="focus-on-light interactive-wrapper" href="https://support.quill.org/en/articles/6445559-how-quill-determines-the-grade-range-for-quill-activities" rel="noopener noreferrer" target="_blank"><img alt={helpIcon.alt} src={helpIcon.src} /></a>
        </h2>
        {clearButton}
      </div>
      <div className="slider-wrapper">
        <label htmlFor="grade-level-slider">Grade Level Range: {gradeLevelRangeText}</label>
        <div className="checkbox-and-slider">
          {checkbox}
          <OneThumbSlider
            defaultValue={defaultValue}
            handleChange={onChange}
            id="grade-level-slider"
            markLabels={GRADE_LEVEL_LABELS}
            maxValue={MAX_LEVEL}
            minValue={MIN_LEVEL}
            step={1}
            value={lowerValue}
          />
        </div>
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
