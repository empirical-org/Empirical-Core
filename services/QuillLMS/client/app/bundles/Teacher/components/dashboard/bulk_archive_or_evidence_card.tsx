import * as React from 'react'

import BulkArchiveClassesCard from './bulk_archive_classrooms_card'
import EvidencePromotionCard from './evidence_promotion_card'

const MAY = 4

const BulkArchiveOrEvidenceCard = ({ userId, classrooms, handleBulkArchiveSuccess, showEvidencePromotionCard, passedCardClosedForRelevantYearInLocalStorage, }) => {
  const today = new Date(Date.now()) // equivalent to just new Date(), but much easier to stub for tests

  const relevantYear = today.getMonth() > MAY ? today.getUTCFullYear() : today.getUTCFullYear() - 1
  const localStorageKey = `${relevantYear}BulkArchiveCardClosedForUser${userId}`

  const classesCreatedLastSchoolYear = classrooms.filter(c => {
    const createdAt = new Date(c.created_at)
    return new Date(`July 1, ${relevantYear}`) > createdAt
  })

  const cardClosedForRelevantYearInLocalStorage = window.localStorage.getItem(localStorageKey) || passedCardClosedForRelevantYearInLocalStorage

  if (!cardClosedForRelevantYearInLocalStorage && classesCreatedLastSchoolYear.length) {
    return (
      <BulkArchiveClassesCard
        classrooms={classesCreatedLastSchoolYear}
        localStorageKey={localStorageKey}
        onSuccess={handleBulkArchiveSuccess}
      />
    )
  } else if (showEvidencePromotionCard) {
    return <EvidencePromotionCard />
  } else {
    return <span />
  }

}

export default BulkArchiveOrEvidenceCard
