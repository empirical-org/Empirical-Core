import * as React from 'react';

import { Activity } from './interfaces';
import { EARLY_ACCESS_FILTERS } from './shared';

import { EVIDENCE_BETA1, EVIDENCE_BETA2 } from '../../../../../../constants/flagOptions';
import { Tooltip } from '../../../../../Shared/index';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface EarlyAccessOption {
  flag: string,
  name: string,
  tooltipText: string
}

interface EarlyAccessFilterRowProps {
  earlyAccessFilters: string[],
  earlyAccessOption: EarlyAccessOption,
  handleEarlyAccessFilterChange: (earlyAccessFilters: string[]) => void,
  filteredActivities: Activity[]
}

interface EarlyAccessFiltersProps {
  activities: Activity[],
  filterActivities: (ignoredKey?: string) => Activity[]
  earlyAccessFilters: string[],
  flagset: string,
  handleEarlyAccessFilterChange: (earlyAccessFilters: string[]) => void,
}

const earlyAccessOptions = [
  {
    flag: EVIDENCE_BETA1,
    name: 'Teacher Advisory Council',
    tooltipText: "These are Quill’s newest activities, which are available only to the members of our Teacher Advisory Council (TAC). While the texts in these activities have been thoughtfully crafted and reviewed, the accuracy of the activities’ feedback may not be as strong because they are still under development. Having your students play these allows us to build a robust feedback system for each activity!"
  },
  {
    flag: EVIDENCE_BETA2,
    name: 'Early Access Activities',
    tooltipText: "These are activities that are still under development and therefore available only to high school educators with early access to Quill content (including members of our Teacher Advisory Council). While the texts in these activities have been thoughtfully crafted and reviewed, the accuracy of the activities’ feedback may not be as strong as publicly available activities. Having your students play these allows us to improve their feedback!"
  }
]

const EarlyAccessFilterRow = ({ earlyAccessFilters, earlyAccessOption, handleEarlyAccessFilterChange, filteredActivities, }: EarlyAccessFilterRowProps) => {
  function checkIndividualFilter() {
    const newEarlyAccessFilters = Array.from(new Set(earlyAccessFilters.concat([earlyAccessOption.flag])))
    handleEarlyAccessFilterChange(newEarlyAccessFilters)
  }

  function uncheckIndividualFilter() {
    const newEarlyAccessFilters = earlyAccessFilters.filter(k => k !== earlyAccessOption.flag)
    handleEarlyAccessFilterChange(newEarlyAccessFilters)
  }

  const activityCount = filteredActivities.filter(act => act.flags.includes(earlyAccessOption.flag)).length
  let checkbox = <button aria-label={`Check ${earlyAccessOption.name}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (earlyAccessFilters.includes(earlyAccessOption.flag)) {
    checkbox = (<button aria-label={`Uncheck ${earlyAccessOption.name}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${earlyAccessOption.name}`} className="focus-on-light quill-checkbox disabled" />
  }

  const rowContent = (
    <div className="individual-row-tooltip-trigger">
      <div className="individual-row-hoverbox" />
      <div className="individual-row filter-row" key={earlyAccessOption.flag}>
        <div>
          {checkbox}
          <span>{earlyAccessOption.name}</span>
        </div>
        <span>({activityCount})</span>
      </div>
    </div>
  )

  return (
    <Tooltip
      isTabbable={false}
      tooltipText={earlyAccessOption.tooltipText}
      tooltipTriggerText={rowContent}
    />
  )
}

const EarlyAccessFilters = ({ activities, filterActivities, earlyAccessFilters, handleEarlyAccessFilterChange, flagset, }: EarlyAccessFiltersProps) => {
  function clearAllEarlyAccessFilters() { handleEarlyAccessFilterChange([]) }

  const filteredActivities = filterActivities(EARLY_ACCESS_FILTERS)

  const earlyAccessOptionsForUser = flagset === EVIDENCE_BETA1 ? earlyAccessOptions : [earlyAccessOptions[1]]

  const earlyAccessRows = earlyAccessOptionsForUser.map(earlyAccessOption =>
    (<EarlyAccessFilterRow
      earlyAccessFilters={earlyAccessFilters}
      earlyAccessOption={earlyAccessOption}
      filteredActivities={filteredActivities}
      handleEarlyAccessFilterChange={handleEarlyAccessFilterChange}
      key={earlyAccessOption.flag}
    />)
  )
  const clearButton = earlyAccessFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllEarlyAccessFilters} type="button">Clear</button> : <span />

  return (
    <section className="filter-section early-access-filter-section">
      <div className="name-and-clear-wrapper">
        <h2>Early Access Activities</h2>
        {clearButton}
      </div>
      {earlyAccessRows}
    </section>
  )
}

export default EarlyAccessFilters
