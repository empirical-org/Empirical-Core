import * as React from 'react'

import BulkArchiveClassesCard from './bulk_archive_classrooms_card'
import EvidencePromotionCard from './evidence_promotion_card'
import ScoringUpdatesCard from './scoring_updates_card'

const MAY = 4

const PromotionalCard = ({ userId, classrooms, handleBulkArchiveSuccess, showEvidencePromotionCard, passedBulkArchiveCardClosedForRelevantYear, passedScoringUpdatesCardClosed, }) => {
  const today = new Date(Date.now()) // equivalent to just new Date(), but much easier to stub for tests

  const relevantYear = today.getMonth() > MAY ? today.getUTCFullYear() : today.getUTCFullYear() - 1
  const bulkArchiveLocalStorageKey = `${relevantYear}BulkArchiveCardClosedForUser${userId}`
  const scoringUpdateLocalStorageKey = `ScoringUpdatesCardClosedForUser${userId}`

  const [bulkArchiveCardClosedForRelevantYear, setBulkArchiveCardClosedForRelevantYear] = React.useState(window.localStorage.getItem(bulkArchiveLocalStorageKey) || passedBulkArchiveCardClosedForRelevantYear)
  const [scoringUpdatesCardClosed, setScoringUpdatesCardClosed] = React.useState(window.localStorage.getItem(scoringUpdateLocalStorageKey) || passedScoringUpdatesCardClosed)


  function handleCloseBulkArchiveCard() {
    window.localStorage.setItem(bulkArchiveLocalStorageKey, 'true')
    setBulkArchiveCardClosedForRelevantYear(true)
  }

  function handleCloseScoringUpdatesCard() {
    window.localStorage.setItem(scoringUpdateLocalStorageKey, 'true')
    setScoringUpdatesCardClosed(true)
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
    return <ScoringUpdatesCard handleCloseCard={handleCloseScoringUpdatesCard} />
  } else if (showEvidencePromotionCard) {
    return <EvidencePromotionCard />
  } else {
    return <span />
  }

}

export default PromotionalCard
