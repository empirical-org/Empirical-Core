import * as React from 'react'

import BulkArchiveClassesCard from './bulk_archive_classrooms_card'
import EvidencePromotionCard from './evidence_promotion_card'
import SchoolYearUpdatesCard from './school_year_updates_card'

const MAY = 4

const PromotionalCard = ({ userId, classrooms, handleBulkArchiveSuccess, showEvidencePromotionCard, passedBulkArchiveCardClosedForRelevantYear, passedSchoolYearUpdatesCardClosed, }) => {
  const today = new Date(Date.now()) // equivalent to just new Date(), but much easier to stub for tests

  const relevantYear = today.getMonth() > MAY ? today.getUTCFullYear() : today.getUTCFullYear() - 1
  const bulkArchiveLocalStorageKey = `${relevantYear}BulkArchiveCardClosedForUser${userId}`
  const schoolYearUpdatesCard = `${relevantYear}SchoolYearUpdatesCardClosedForUser${userId}`

  const [bulkArchiveCardClosedForRelevantYear, setBulkArchiveCardClosedForRelevantYear] = React.useState(window.localStorage.getItem(bulkArchiveLocalStorageKey) || passedBulkArchiveCardClosedForRelevantYear)
  const [scoringUpdatesCardClosed, setSchoolYearUpdatesCardClosed] = React.useState(window.localStorage.getItem(schoolYearUpdatesCard) || passedSchoolYearUpdatesCardClosed)

  function handleCloseBulkArchiveCard() {
    window.localStorage.setItem(bulkArchiveLocalStorageKey, 'true')
    setBulkArchiveCardClosedForRelevantYear(true)
  }

  function handleCloseSchoolYearUpdatesCard() {
    window.localStorage.setItem(schoolYearUpdatesCard, 'true')
    setSchoolYearUpdatesCardClosed(true)
  }

  const classesCreatedLastSchoolYear = classrooms.filter(c => {
    const createdAt = new Date(c.created_at)
    return new Date(`July 1, ${relevantYear}`) > createdAt
  })

  if (!bulkArchiveCardClosedForRelevantYear && classesCreatedLastSchoolYear.length) {
    return (
      <BulkArchiveClassesCard
        classrooms={classesCreatedLastSchoolYear}
        handleCloseCard={handleCloseBulkArchiveCard}
        onSuccess={handleBulkArchiveSuccess}
      />
    )
  } else if (!scoringUpdatesCardClosed) {
    return <SchoolYearUpdatesCard handleCloseCard={handleCloseSchoolYearUpdatesCard} />
  } else if (showEvidencePromotionCard) {
    return <EvidencePromotionCard />
  } else {
    return <span />
  }

}

export default PromotionalCard
