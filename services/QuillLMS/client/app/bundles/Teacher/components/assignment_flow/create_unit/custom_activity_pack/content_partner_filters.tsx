import * as React from 'react';

import { Activity, ContentPartner } from './interfaces';
import { CONTENT_PARTNER_FILTERS } from './shared';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface ContentPartnerFilterRowProps {
  contentPartnerFilters: number[],
  contentPartner: ContentPartner,
  handleContentPartnerFilterChange: (contentPartnerFilters: number[]) => void,
  uniqueContentPartners: ContentPartner[],
  filteredActivities: Activity[]
}

interface ContentPartnerFiltersProps {
  activities: Activity[],
  filterActivities: (ignoredKey?: string) => Activity[]
  contentPartnerFilters: number[],
  handleContentPartnerFilterChange: (contentPartnerFilters: number[]) => void,
}

const ContentPartnerFilterRow = ({ contentPartnerFilters, contentPartner, handleContentPartnerFilterChange, filteredActivities, }: ContentPartnerFilterRowProps) => {
  function checkIndividualFilter() {
    const newContentPartnerFilters = Array.from(new Set(contentPartnerFilters.concat([contentPartner.id])))
    handleContentPartnerFilterChange(newContentPartnerFilters)
  }

  function uncheckIndividualFilter() {
    const newContentPartnerFilters = contentPartnerFilters.filter(k => k !== contentPartner.id)
    handleContentPartnerFilterChange(newContentPartnerFilters)
  }

  const activityCount = filteredActivities.filter(act => act.content_partners.some(cp => cp.id === contentPartner.id)).length
  let checkbox = <button aria-label={`Check ${contentPartner.name}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (contentPartnerFilters.includes(contentPartner.id)) {
    checkbox = (<button aria-label={`Uncheck ${contentPartner.name}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${contentPartner.name}`} className="focus-on-light quill-checkbox disabled" />
  }

  return (
    <div className="individual-row filter-row" key={contentPartner.id}>
      <div>
        {checkbox}
        <span>{contentPartner.name}</span>
      </div>
      <span>({activityCount})</span>
    </div>
  )
}

const ContentPartnerFilters = ({ activities, filterActivities, contentPartnerFilters, handleContentPartnerFilterChange, }: ContentPartnerFiltersProps) => {
  function clearAllContentPartnerFilters() { handleContentPartnerFilterChange([]) }

  let allContentPartners = []
  activities.forEach(a => allContentPartners = allContentPartners.concat(a.content_partners))
  const uniqueContentPartnerIds = Array.from(new Set(allContentPartners.filter(Boolean).map(a => a.id)))
  const uniqueContentPartners = uniqueContentPartnerIds.map(id => allContentPartners.find(ac => ac.id === id)).filter(ac => ac.name && ac.id)
  const sortedContentPartners = uniqueContentPartners.sort((ac1, ac2) => ac1.name.localeCompare(ac2.name))

  const filteredActivities = filterActivities(CONTENT_PARTNER_FILTERS)

  const contentPartnerRows = sortedContentPartners.map(ac =>
    (<ContentPartnerFilterRow
      contentPartner={ac}
      contentPartnerFilters={contentPartnerFilters}
      filteredActivities={filteredActivities}
      handleContentPartnerFilterChange={handleContentPartnerFilterChange}
      key={ac.id}
      uniqueContentPartners={uniqueContentPartners}
    />)
  )
  const clearButton = contentPartnerFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllContentPartnerFilters} type="button">Clear</button> : <span />

  return (
    <section className="filter-section content-partner-filter-section">
      <div className="name-and-clear-wrapper">
        <h2>Content Partners</h2>
        {clearButton}
      </div>
      {contentPartnerRows}
    </section>
  )
}

export default ContentPartnerFilters
