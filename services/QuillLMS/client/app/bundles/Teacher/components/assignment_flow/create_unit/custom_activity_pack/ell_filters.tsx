import * as React from 'react';

import { Activity, Topic } from './interfaces'
import { STANDARDS_FILTERS, } from './shared'

import { Tooltip, helpIcon, } from '../../../../../Shared/index'

const dropdownIconSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/dropdown.svg`
const indeterminateSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/indeterminate.svg`
const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`

const tooltipText = 'Quill’s ELL activities are designed based on ELL standards from WIDA, CEFR, and ELA21.<br/><br/>Quill’s Starter ELL activities generally align to WIDA PL1 & ELPA Level 1.<br/><br/>Quill’s Intermediate ELL activities generally align to WIDA PL2 & ELPA Level 2.<br/><br/>Quill’s Advanced ELL activities generally align to WIDA PL3 & ELPA Level 3.<br/><br/>Click on the "?" to learn more about the alignment of Quill ELL Skill levels to common ELL frameworks.'

interface ELLLevel {
  standardLevelName: string,
  displayName: string,
}

interface Grouping {
  ellOptions: ELLLevel[],
  group: string
}

interface IndividualELLFilterRowProps {
  ellFilters: string[],
  level: ELLLevel,
  handleELLFilterChange: (ellFilters: string[]) => void,
  filteredActivities: Activity[],
}

interface ELLToggleProps {
  filteredActivities: Activity[],
  grouping: Grouping,
  ellFilters: string[],
  handleELLFilterChange: (ellFilters: string[]) => void,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void
}

interface ELLFiltersProps {
  activities: Activity[],
  filterActivities: (ignoredKey?: string) => Activity[]
  ellFilters: string[],
  handleELLFilterChange: (ellFilters: string[]) => void,
}

const levelOne = {
  standardLevelName: 'ELL Starter',
  displayName: 'ELL Starter',
}

const levelTwo = {
  standardLevelName: 'ELL Intermediate',
  displayName: 'ELL Intermediate',
}

const levelThree = {
  standardLevelName: 'ELL Advanced',
  displayName: 'ELL Advanced',
}

const allELLOptions = [levelOne, levelTwo, levelThree]

const IndividualELLFilterRow = ({ ellFilters, level, handleELLFilterChange, filteredActivities, }: IndividualELLFilterRowProps) => {
  const { displayName, standardLevelName, } = level

  function checkIndividualFilter() {
    const newELLFilters = Array.from(new Set(ellFilters.concat([standardLevelName])))
    handleELLFilterChange(newELLFilters)
  }

  function uncheckIndividualFilter() {
    const newELLFilters = ellFilters.filter(k => k !== standardLevelName)
    handleELLFilterChange(newELLFilters)
  }

  const activityCount = filteredActivities.filter(act => act.standard_level_name === standardLevelName).length
  let checkbox = <button aria-label={`Check ${displayName}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (ellFilters.includes(standardLevelName)) {
    checkbox = (<button aria-label={`Uncheck ${displayName}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${displayName}`} className="focus-on-light quill-checkbox disabled" />
  }

  return (
    <div className="individual-row filter-row topic-row" key={standardLevelName}>
      <div>
        {checkbox}
        <span>{displayName}</span>
      </div>
      <span>({activityCount})</span>
    </div>
  )
}

const ELLToggle = ({filteredActivities, grouping, ellFilters, handleELLFilterChange, isOpen, setIsOpen, }: ELLToggleProps) => {
  function toggleIsOpen() { setIsOpen(!isOpen) }

  function uncheckAllFilters() {
    handleELLFilterChange([])
  }

  function checkAllFilters() {
    handleELLFilterChange(allELLOptions.map(opt => opt.standardLevelName))
  }

  const toggleArrow = <button aria-label="Toggle menu" className="interactive-wrapper focus-on-light filter-toggle-button" onClick={toggleIsOpen} type="button"><img alt="" className={isOpen ? 'is-open' : 'is-closed'} src={dropdownIconSrc} /></button>
  let topLevelCheckbox = <button aria-label="Check all nested filters" className="focus-on-light quill-checkbox unselected" onClick={checkAllFilters} type="button" />

  const topLevelActivityCount = filteredActivities.filter(act => allELLOptions.map(opt => opt.standardLevelName).includes(act.standard_level_name)).length

  if (topLevelActivityCount === 0) {
    topLevelCheckbox = <div className="focus-on-light quill-checkbox disabled" />
  } else if (ellFilters.length === allELLOptions.length) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="focus-on-light quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (ellFilters.length) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="focus-on-light quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Indeterminate checkbox" src={indeterminateSrc} />
    </button>)
  }

  let individualFilters = <span />
  if (isOpen) {
    individualFilters = grouping.ellOptions.map((ellOption: ELLLevel) =>
      (<IndividualELLFilterRow
        ellFilters={ellFilters}
        filteredActivities={filteredActivities}
        handleELLFilterChange={handleELLFilterChange}
        key={ellOption.standardLevelName}
        level={ellOption}
      />)
    )
  }

  return (
    <section className="toggle-section activity-classification-toggle">
      <div className="top-level filter-row">
        <div>
          {toggleArrow}
          {topLevelCheckbox}
          <span>{grouping.group}</span>
        </div>
        <span>({topLevelActivityCount})</span>
      </div>
      {individualFilters}
    </section>
  )
}

const ELLFilters = ({ filterActivities, ellFilters, handleELLFilterChange, }: ELLFiltersProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  function clearAllELLFilters() { handleELLFilterChange([]) }

  const filteredActivities = filterActivities(STANDARDS_FILTERS)

  const grouping = {
    group: 'Activities by Skill Level',
    ellOptions: allELLOptions
  }

  const clearButton = ellFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllELLFilters} type="button">Clear</button> : <span />

  const filterSectionContent = (
    <div className="tooltip-trigger-filter-section-content">
      <div className="hoverbox" />
      <div className="name-and-clear-wrapper">
        <h2>
          <span>ELL Activities</span>
          <a className="focus-on-light interactive-wrapper" href="https://support.quill.org/en/articles/6437903-what-are-the-ell-levels-on-quill" rel="noopener noreferrer" target="_blank"><img alt={helpIcon.alt} src={helpIcon.src} /></a>
        </h2>
        {clearButton}
      </div>
      <ELLToggle
        ellFilters={ellFilters}
        filteredActivities={filteredActivities}
        grouping={grouping}
        handleELLFilterChange={handleELLFilterChange}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  )

  return (
    <section className={`filter-section ell-filters ${isOpen ? 'toggle-expanded' : ''}`}>
      <Tooltip
        isTabbable={false}
        tooltipText={tooltipText}
        tooltipTriggerText={filterSectionContent}
      />
    </section>
  )

}

export default ELLFilters
