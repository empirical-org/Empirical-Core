import * as React from 'react'

import BulkArchiveClassesModal from './bulk_archive_classes_modal'
import { PostNavigationBanner } from '../../../Shared'

const JULY = 6
const AUGUST = 7
const SEPTEMBER = 8

const BulkArchiveClassesBanner = ({ classes, onSuccess, userId, }) => {
  const today = new Date(Date.now()) // equivalent to just new Date(), but much easier to stub for tests
  const localStorageKey = `${today.getYear()}BulkArchiveBannerClosedForUser${userId}`

  const [previouslyClosedBanner, setPreviouslyClosedBanner] = React.useState(window.localStorage.getItem(localStorageKey))
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  if (previouslyClosedBanner) { return null }

  if (![JULY, AUGUST, SEPTEMBER].includes(today.getMonth())) { return null }

  const threeMonthsAgo = today.setMonth(today.getMonth() - 3)
  const anyClassesCreatedAtLeastThreeMonthsAgo = classes.some(c => {
    const createdAt = new Date(c.created_at)
    return threeMonthsAgo > createdAt
  })

  if (!anyClassesCreatedAtLeastThreeMonthsAgo) { return null }

  const handleOpenModal = () => {
    setModalIsOpen(true)
  }

  const handleCloseModal = () => {
    setModalIsOpen(false)
  }

  const handleCloseBanner = () => {
    window.localStorage.setItem(localStorageKey, 'true')
    setPreviouslyClosedBanner('true')
  }

  return (
    <React.Fragment>
      {modalIsOpen && <BulkArchiveClassesModal classes={classes} onCloseModal={handleCloseModal} onSuccess={onSuccess} /> }
      <PostNavigationBanner
        bannerColor="grey"
        bannerStyle="minimal archive-classrooms"
        bodyText="Quickly archive last year's classes."
        buttons={[
          {
            onClick: handleOpenModal,
            text: "Archive Classes",
          },
          {
            className: "small outlined",
            onClick: handleCloseBanner,
            text: "Close",
          }
        ]}
        primaryHeaderText="Start of a new school year?"
      />
    </React.Fragment>
  )
}

export default BulkArchiveClassesBanner
