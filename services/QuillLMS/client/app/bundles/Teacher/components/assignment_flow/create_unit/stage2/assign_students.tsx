import * as React from 'react';

import { useEffect, useState } from 'react'

import ClassroomCard from './classroom_card'
import CreateAClassInlineForm from './create_a_class_inline_form'

import { canvasProvider, cleverProvider, googleProvider, providerConfigLookup } from '../../../classrooms/providerHelpers'
import { requestGet } from '../../../../../../modules/request/index'
import { Snackbar, defaultSnackbarTimeout } from '../../../../../Shared/index'
import useSnackbarMonitor from '../../../../../Shared/hooks/useSnackbarMonitor'
import pusherInitializer from '../../../../../../modules/pusherInitializer'
import ImportProviderClassroomsModal from '../../../classrooms/import_provider_classrooms_modal'
import LinkProviderAccountModal from '../../../classrooms/link_provider_account_modal'
import NoClassroomsToImportModal from '../../../classrooms/no_classrooms_to_import_modal'
import ReauthorizeProviderModal from '../../../classrooms/reauthorize_provider_modal'
import ButtonLoadingIndicator from '../../../shared/button_loading_indicator'

const canvasIconSrc = `${process.env.CDN_URL}/images/icons/canvas.svg`
const cleverIconSrc = `${process.env.CDN_URL}/images/icons/clever.svg`
const googleClassroomIconSrc = `${process.env.CDN_URL}/images/icons/google-classroom.svg`
const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`

export const createAClassForm = 'createAClassForm'

export const importProviderClassroomsModal = 'importProviderClassroomsModal'
export const linkCanvasAccountModal = 'linkCanvasAccountModal'
export const linkCleverAccountModal = 'linkCleverAccountModal'
export const linkGoogleAccountModal = 'linkGoogleAccountModal'
export const reauthorizeProviderModal = 'reauthorizeProviderModal'
export const noClassroomsToImportModal = 'noClassroomsToImportModal'

const AssignStudents = ({
  classrooms,
  canvasLink,
  cleverLink,
  fetchClassrooms,
  googleLink,
  lockedClassroomIds,
  lockedMessage,
  toggleClassroomSelection,
  toggleStudentSelection,
  user
}) => {
  const { provider } = user
  const providerConfig = providerConfigLookup[provider]

  const reauthorizeLink = {
    [canvasProvider]: canvasLink,
    [cleverProvider]: cleverLink,
    [googleProvider]: googleLink,
  }[provider]

  const [providerClassrooms, setProviderClassrooms] = useState([])
  const [providerClassroomsLoading, setProviderClassroomsLoading] = useState(false)
  const [pendingImportFromProviderRequest, setPendingImportFromProviderRequest] = useState(false)

  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false)
  const [snackbarCopy, setSnackbarCopy] = useState('')
  const [visibleModal, setVisibleModal] = useState(null)

  const providerIconSrc = {
    [canvasProvider]: canvasIconSrc,
    [cleverProvider]: cleverIconSrc,
    [googleProvider]: googleClassroomIconSrc,
  }

  useSnackbarMonitor(isSnackbarVisible, setIsSnackbarVisible, defaultSnackbarTimeout)

  useEffect(() => {
    if (!provider) { return }

    retrieveProviderClassrooms()
  }, [])

  useEffect(() => {
    if (!pendingImportFromProviderRequest) { return }
    if (providerClassrooms === null) { return }

    setPendingImportFromProviderRequest(false)
    openModal(providerClassrooms.length ? importProviderClassroomsModal : noClassroomsToImportModal)
  }, [providerClassrooms])

  const closeModal = (callback = null) => {
    setVisibleModal(null)

    if (callback && typeof(callback) === 'function') { callback() }
  }

  const importFromCanvas = () => {
    if (providerConfig?.isCanvas) {
      setPendingImportFromProviderRequest(true)
      retrieveProviderClassrooms()
    } else {
      openModal(linkCanvasAccountModal)
    }
  }

  const importFromClever = () => {
    if (providerConfig?.isClever) {
      setPendingImportFromProviderRequest(true)
      retrieveProviderClassrooms()
    } else {
      openModal(linkCanvasAccountModal)
    }
  }

  const importFromGoogle = () => {
    if (providerConfig?.isGoogle) {
      setPendingImportFromProviderRequest(true)
      retrieveProviderClassrooms()
    } else {
      openModal(linkGoogleAccountModal)
    }
  }

  const importFromProvider = {
    [canvasProvider]: importFromCanvas,
    [cleverProvider]: importFromClever,
    [googleProvider]: importFromGoogle,
  }

  const onSuccess = (snackbarCopy: string) => {
    fetchClassrooms()
    retrieveProviderClassrooms()
    showSnackbar(snackbarCopy)
    closeModal()
  }

  const openModal = (modalName: string) => {
    setVisibleModal(modalName)
  }

  const retrieveProviderClassrooms = () => {
    setProviderClassroomsLoading(true)
    pusherInitializer(user.id, providerConfig.retrieveClassroomsEventName, retrieveProviderClassrooms)

    requestGet(providerConfig.retrieveClassroomsPath, (body) => {
      if (body.reauthorization_required) {
        openModal(reauthorizeProviderModal)
        return
      }

      if (body.quill_retrieval_processing) { return }

      setProviderClassrooms(body.classrooms.filter(classroom => !classroom.alreadyImported))
      setProviderClassroomsLoading(false)
    })
  }

  const showSnackbar = (snackbarCopy: string) => {
    setSnackbarCopy(snackbarCopy)
    setIsSnackbarVisible(true)
  }

  const renderAllClassroomsCheckbox = () => {
    if (classrooms.length <= 1) { return null }

    const selectedClassrooms = classrooms.filter((c) => {
      const { students, classroom, } = c
      const selectedStudents = students && students.length ? students.filter(s => s.isSelected) : []
      return !!(classroom.emptyClassroomSelected || selectedStudents.length)
    })

    let checkbox = <span className="quill-checkbox unselected" onClick={() => toggleClassroomSelection(null, true)} />
    if (selectedClassrooms.length === classrooms.length) {
      checkbox = (<span className="quill-checkbox selected" onClick={() => toggleClassroomSelection(null, false)}>
        <img alt="check" src={smallWhiteCheckSrc} />
      </span>)
    } else if (selectedClassrooms.length) {
      checkbox = (<span className="quill-checkbox selected" onClick={() => toggleClassroomSelection(null, false)}>
        <img alt="check" src={indeterminateSrc} />
      </span>)
    }
    return (
      <div className="all-classes-checkbox">
        {checkbox}
        <span className="all-classes-text">All classes and students</span>
      </div>
    )
  }

  const renderClassroom = (classroom_students_data: any) => {
    const { classroom, students, } = classroom_students_data

    return (
      <ClassroomCard
        classroom={classroom}
        lockedClassroomIds={lockedClassroomIds}
        lockedMessage={lockedMessage}
        students={students}
        toggleClassroomSelection={toggleClassroomSelection}
        toggleStudentSelection={toggleStudentSelection}
      />
    )
  }

  const renderClassroomList = () => {
    if (classrooms && classrooms.length) {
      return (
        <div className="classrooms">
          {classrooms.map(classroom => renderClassroom(classroom))}
        </div>
      )
    } else if (visibleModal !== createAClassForm) {
      return (
        <div className="no-active-classes">
          <img alt="empty class" src={emptyClassSrc} />
          <p>Your classrooms will appear here. Add a class to get started.</p>
        </div>
      )
    }
  }

  const renderClassroomsSection = () => {
    return (
      <div className="assignment-section">
        <div className="assignment-section-header assign-students">
          <div className="number-and-name">
            <span className="assignment-section-number">3</span>
            <span className="assignment-section-name">Choose classes or students</span>
          </div>
          <div className="import-or-create-classroom-buttons">
            {renderImportFromProviderButton(canvasProvider)}
            {renderImportFromProviderButton(cleverProvider)}
            {renderImportFromProviderButton(googleProvider)}
            <button
              className="quill-button medium secondary outlined create-a-class-button"
              onClick={() => openModal(createAClassForm)}
              type="button"
            >
            Create a class
            </button>
          </div>
        </div>
        <div className="assignment-section-body">
          {renderCreateAClassInlineForm()}
          {renderAllClassroomsCheckbox()}
          {renderClassroomList()}
        </div>
      </div>
    )
  }

  const renderCreateAClassInlineForm = () => {
    return visibleModal === createAClassForm
      ? <CreateAClassInlineForm cancel={closeModal} onSuccess={onSuccess} />
      : null
  }

  const renderImportFromProviderButton = (theProvider: string) => {
    if (provider && provider != theProvider) { return null }

    const theProviderTitle = providerConfigLookup[theProvider].title

    let buttonContent = <React.Fragment>Import from {theProviderTitle}</React.Fragment>
    let buttonClassName = "interactive-wrapper import-from-provider-button"

    if (providerClassroomsLoading && pendingImportFromProviderRequest) {
      buttonContent = <React.Fragment>Import from {theProviderTitle}<ButtonLoadingIndicator /></React.Fragment>
      buttonClassName += ' loading'
    }

    const importFromTheProvider = importFromProvider[theProvider]
    const alt = `${theProviderTitle} Icon`
    const src = providerIconSrc[theProvider]

    return (
      <button className={buttonClassName} onClick={importFromTheProvider} type="button">
        <img alt={alt} className='import-from-provider-button-icon' src={src} />
        {buttonContent}
      </button>
    )
  }

  const renderImportProviderClassroomsModal = () => {
    if (visibleModal !== importProviderClassroomsModal) { return null }

    return (
      <ImportProviderClassroomsModal
        classrooms={providerClassrooms}
        close={() => closeModal(() => setPendingImportFromProviderRequest(false))}
        onSuccess={onSuccess}
        provider={provider}
        user={user}
      />
    )
  }

  const renderLinkProviderAccountModal = () => {
    let link = ''
    let linkAccountProvider = ''

    switch (visibleModal) {
      case linkCanvasAccountModal:
        link = canvasLink
        linkAccountProvider = canvasProvider
        break;
      case linkCleverAccountModal:
        link = cleverLink
        linkAccountProvider = cleverProvider
        break
      case linkGoogleAccountModal:
        // no link assignment since google uses a different component for linking accounts
        linkAccountProvider = googleProvider
        break
      default:
        return null
    }

    return (
      <LinkProviderAccountModal
        close={closeModal}
        link={link}
        provider={linkAccountProvider}
        user={user}
      />
    )
  }

  const renderNoClassroomsToImportModal = () => {
    return visibleModal === noClassroomsToImportModal
      ? <NoClassroomsToImportModal close={closeModal} provider={provider} />
      : null
  }

  const renderReauthorizeProviderModal = () => {
    return visibleModal === reauthorizeProviderModal
      ? <ReauthorizeProviderModal close={closeModal} link={reauthorizeLink} provider={provider} />
      : null
  }

  const renderSnackbar = () => {
    return <Snackbar text={snackbarCopy} visible={isSnackbarVisible} />
  }

  return (
    <div>
      {renderImportProviderClassroomsModal()}
      {renderReauthorizeProviderModal()}
      {renderLinkProviderAccountModal()}
      {renderNoClassroomsToImportModal()}
      {renderSnackbar()}
      {renderClassroomsSection()}
    </div>
  )
}

export default AssignStudents
