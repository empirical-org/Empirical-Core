import * as React from 'react';
import _  from 'lodash';

import { Activity } from './interfaces'
import { FLAG_FILTERS } from './shared'
import { flagOptions } from '../../../../../../constants/flagOptions';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface FlagFilterRowProps {
  flagFilters: string[],
  flag: string,
  handleFlagFilterChange: (flagFilters: string[]) => void,
  filteredActivities: Activity[]
}

interface FlagFiltersProps {
  activities: Activity[],
  filterActivities: (ignoredKey?: string) => Activity[]
  flagFilters: string[],
  handleFlagFilterChange: (flagFilters: string[]) => void,
}

const FlagFilterRow = ({ flagFilters, flag, handleFlagFilterChange, filteredActivities, }: FlagFilterRowProps) => {
  function checkIndividualFilter() {
    const newFlagFilters = Array.from(new Set(flagFilters.concat([flag])))
    handleFlagFilterChange(newFlagFilters)
  }

  function uncheckIndividualFilter() {
    const newFlagFilters = flagFilters.filter(k => k !== flag)
    handleFlagFilterChange(newFlagFilters)
  }

  const activityCount = filteredActivities.filter(act => act.flags.includes(flag)).length
  let checkbox = <button aria-label={`Check ${flag}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${flag}`} className="focus-on-light quill-checkbox disabled" />
  } else if (flagFilters.includes(flag)) {
    checkbox = (<button aria-label={`Uncheck ${flag}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  return (
    <div className="individual-row filter-row" key={flag}>
      <div>
        {checkbox}
        <span>{_.capitalize(flag)}</span>
      </div>
      <span>({activityCount})</span>
    </div>
  )
}

const FlagFilters = ({ activities, filterActivities, flagFilters, handleFlagFilterChange, }: FlagFiltersProps) => {
  function clearAllFlagFilters() { handleFlagFilterChange([]) }

  const filteredActivities = filterActivities(FLAG_FILTERS)

  // TODO: flag display
  const flagRows = flagOptions.map(ac =>
    (<FlagFilterRow
      filteredActivities={filteredActivities}
      flag={ac.value}
      flagFilters={flagFilters}
      handleFlagFilterChange={handleFlagFilterChange}
      key={ac.value}
    />)
  )
  const clearButton = flagFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllFlagFilters} type="button">Clear</button> : <span />

  return (
    <section className="filter-section flag-filter-section">
      <div className="name-and-clear-wrapper">
        <h2>Flags</h2>
        {clearButton}
      </div>
      {flagRows}
    </section>
  )
}

export default FlagFilters
