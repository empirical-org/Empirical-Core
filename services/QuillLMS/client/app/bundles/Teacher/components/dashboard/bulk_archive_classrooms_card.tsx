import * as React from 'react'

import { arrowPointingRightIcon } from '../../../Shared/index'
import BulkArchiveClassesModal from '../shared/bulk_archive_classes_modal'

const closeIconSrc = `${process.env.CDN_URL}/images/pages/dashboard/bulk_archive_close_icon.svg`
const illustrationSrc = `${process.env.CDN_URL}/images/pages/dashboard/bulk_archive_illustration.svg`

const BulkArchiveClassesCard = ({ classrooms, onSuccess, handleCloseCard, }) => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  const handleOpenModal = () => {
    setModalIsOpen(true)
  }

  const handleCloseModal = () => {
    setModalIsOpen(false)
  }

  function handleSuccess(snackbarCopy) {
    handleCloseModal()
    handleCloseCard()
    onSuccess(snackbarCopy)
  }

  return (
    <React.Fragment>
      {modalIsOpen && <BulkArchiveClassesModal classes={classrooms} onCloseModal={handleCloseModal} onSuccess={handleSuccess} /> }
      <section className="bulk-archive-classes-card">
        <div>
          <div className="badge-section">
            <span className="title-tag">HELPFUL TIP</span>
          </div>
          <h2>Start of a new school year?</h2>
          <p>Quickly archive last year&#39;s classes.</p>
          <div className="link-section">
            <button className="interactive-wrapper" onClick={handleOpenModal} type="button"><span>Archive classes</span><img alt={arrowPointingRightIcon.alt} src={arrowPointingRightIcon.src} /></button>
          </div>
        </div>
        <button aria-label="Hide card until next school year" className="interactive-wrapper close-button" onClick={handleCloseCard} type="button"><img alt="" src={closeIconSrc} /></button>
        <img alt="" className="illustration" src={illustrationSrc} />
      </section>
    </React.Fragment>
  )
}

export default BulkArchiveClassesCard
