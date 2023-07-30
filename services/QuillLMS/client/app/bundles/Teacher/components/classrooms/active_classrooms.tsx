import * as React from 'react'
import { useEffect, useState } from 'react'
import { SortableHandle, } from 'react-sortable-hoc'

import pusherInitializer from '../../../../modules/pusherInitializer'
import useSnackbarMonitor from '../../../Shared/hooks/useSnackbarMonitor'
import { canvasProvider, cleverProvider, googleProvider, providerConfigLookup } from './providerHelpers'
import ArchiveClassModal from './archive_classroom_modal'
import ChangeGradeModal from './change_grade_modal'
import Classroom from './classroom'
import CoteacherInvitation from './coteacher_invitation'
import CreateAClassModal from './create_a_class_modal'
import ImportProviderClassroomStudentsModal from './import_provider_classroom_students_modal'
import ImportProviderClassroomsModal from './import_provider_classrooms_modal'
import InviteStudentsModal from './invite_students_modal'
import LinkProviderAccountModal from './link_provider_account_modal'
import NoClassroomsToImportModal from './no_classrooms_to_import_modal'
import ReauthorizeProviderModal from './reauthorize_provider_modal'
import RenameClassModal from './rename_classroom_modal'

import { requestGet, requestPut } from '../../../../modules/request/index'
import { Snackbar, SortableList, defaultSnackbarTimeout } from '../../../Shared/index'
import { MY_CLASSES_FEATURED_BLOG_POST_ID } from '../../constants/featuredBlogPost'
import ArticleSpotlight from '../shared/articleSpotlight'
import BulkArchiveClassesBanner from '../shared/bulk_archive_classes_banner'
import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import ViewAsStudentModal from '../shared/view_as_student_modal'

export const createAClassModal = 'createAClassModal'
export const renameClassModal = 'renameClassModal'
export const changeGradeModal = 'changeGradeModal'
export const archiveClassModal = 'archiveClassModal'
export const inviteStudentsModal = 'inviteStudentsModal'
export const importProviderClassroomsModal = 'importProviderClassroomsModal'
export const importProviderClassroomStudentsModal = 'importProviderClassroomStudentsModal'
export const linkCanvasAccountModal = 'linkCanvasAccountModal'
export const linkCleverAccountModal = 'linkCleverAccountModal'
export const linkGoogleAccountModal = 'linkGoogleAccountModal'
export const reauthorizeProviderModal = 'reauthorizeProviderModal'
export const noClassroomsToImportModal = 'noClassroomsToImportModal'
export const viewAsStudentModal = 'viewAsStudentModal'

const bookEmptySrc = `${process.env.CDN_URL}/images/illustrations/book-empty.svg`
const canvasIconSrc = `${process.env.CDN_URL}/images/icons/canvas.svg`
const cleverIconSrc = `${process.env.CDN_URL}/images/icons/clever.svg`
const googleClassroomIconSrc = `${process.env.CDN_URL}/images/icons/google-classroom.svg`
const reorderSrc = `${process.env.CDN_URL}/images/icons/reorder.svg`

interface ActiveClassroomsProps {
  canvasLink: string
  classrooms: Array<any>
  cleverLink: string
  googleLink: string
  coteacherInvitations: Array<any>
  user: any
}

const ActiveClassrooms = ({
  canvasLink,
  classrooms: initialClassrooms,
  cleverLink,
  coteacherInvitations: initialCoteacherInvitations,
  googleLink,
  user,
}: ActiveClassroomsProps) => {
  const { provider } = user
  const providerConfig = providerConfigLookup[provider]

  const reauthorizeLink = {
    [canvasProvider]: canvasLink,
    [cleverProvider]: cleverLink,
    [googleProvider]: googleLink,
  }[provider]

  const [classrooms, setClassrooms] = useState(initialClassrooms)
  const [coteacherInvitations, setCoteacherInvitations] = useState(initialCoteacherInvitations)
  const [providerClassrooms, setProviderClassrooms] = useState([])
  const [providerClassroomsLoading, setProviderClassroomsLoading] = useState(false)
  const [pendingImportFromProviderRequest, setPendingImportFromProviderRequest] = useState(false)

  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false)
  const [snackbarCopy, setSnackbarCopy] = useState('')
  const [visibleModal, setVisibleModal] = useState(null)
  const [selectedClassroomId, setSelectedClassroomId] = useState(null)

  const providerIconSrc = {
    [canvasProvider]: canvasIconSrc,
    [cleverProvider]: cleverIconSrc,
    [googleProvider]: googleClassroomIconSrc,
  }

  useSnackbarMonitor(isSnackbarVisible, setIsSnackbarVisible, defaultSnackbarTimeout)

  useEffect(() => {
    setStateBasedOnParams()
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

  const getClassroomCardsWithHandle = (classroomCards) => {
    // using a div as the outer element instead of a button here because something about default button behavior overrides the keypress handling by sortablehandle
    const DragHandle = SortableHandle(() => <div className="focus-on-light" role="button" tabIndex={0}><img alt="Reorder icon" className="reorder-icon" src={reorderSrc} /></div>)
    const handle = <span className='reorder-classroom-item'><DragHandle /></span>

    return classroomCards.map(card => {
      return (
        <React.Fragment key={`classroom-card-item-${card.key}`}>
          {handle}
          {card}
        </React.Fragment>
      )
    })
  }

  const clickClassroomHeader = (classroomId) => {
    setSelectedClassroomId(selectedClassroomId === classroomId ? null : classroomId)
  }

  const getClassroomsAndCoteacherInvitations = () => {
    requestGet('/teachers/classrooms', (body) => {
      setClassrooms(body.classrooms.filter(classroom => classroom.visible))
      setCoteacherInvitations(body.coteacher_invitations)
    })
  }

  const getOwnActiveClassrooms = (classrooms) => {
    return classrooms.filter(c => {
      const classroomOwner = c.teachers.find(teacher => teacher.classroom_relation === 'owner')
      return c.visible && classroomOwner.id === user.id
    })
  }

  const importFromCanvas = () => {
    if (providerConfig.isCanvas) {
      setPendingImportFromProviderRequest(true)
      retrieveProviderClassrooms()
    } else {
      openModal(linkCanvasAccountModal)
    }
  }

  const importFromClever = () => {
    if (providerConfig.isClever) {
      setPendingImportFromProviderRequest(true)
      retrieveProviderClassrooms()
    } else {
      openModal(linkCanvasAccountModal)
    }
  }

  const importFromGoogle = () => {
    if (providerConfig.isGoogle) {
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

  const importProviderClassroomStudents = () => {
    requestGet(providerConfig.retrieveClassroomsPath, (body) => {
      if (body.reauthorization_required) {
        openModal(reauthorizeProviderModal)
      } else {
        openModal(importProviderClassroomStudentsModal)
      }
    })
  }

  const onSuccess = (snackbarCopy: string) => {
    getClassroomsAndCoteacherInvitations()
    retrieveProviderClassrooms()
    showSnackbar(snackbarCopy)
    closeModal()
  }

  const openModal = (modalName: string) => {
    setVisibleModal(modalName)
  }

  const retrieveProviderClassrooms = () => {
    if (!provider) { return }

    pusherInitializer(user.id, providerConfig.retrieveClassroomsEventName, retrieveProviderClassrooms)
    setProviderClassroomsLoading(true)

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

  const setStateBasedOnParams = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const modal = urlParams.get('modal')
    const classroomId = urlParams.get('classroom')

    setSelectedClassroomId(Number(classroomId) || null)

    switch (modal) {
      case 'create-a-class':
        setVisibleModal(createAClassModal)
        break
      case 'google-classroom':
        importFromGoogle()
        break
      case 'invite-students':
        setVisibleModal(inviteStudentsModal)
        break
      case 'view-as-student':
        setVisibleModal(viewAsStudentModal)
        break
    }

    if (visibleModal || selectedClassroomId) {
      setVisibleModal(visibleModal)
      setSelectedClassroomId(selectedClassroomId)
    }
  }

  const showSnackbar = snackbarCopy => {
    setSnackbarCopy(snackbarCopy)
    setIsSnackbarVisible(true)
  }

  const sortClassrooms = (sortedClassroomObjects) => {
    const newlySortedClassrooms = sortedClassroomObjects.map((classroomObject, i) => {
      const { props } = classroomObject
      const { children } = props
      let classroom = children[1].props.classroom
      classroom.order = i
      return classroom
    })

    requestPut('/classrooms_teachers/update_order', { updated_classrooms: JSON.stringify(newlySortedClassrooms) }, body => {
      const { classrooms } = body
      if(classrooms) { setClassrooms(newlySortedClassrooms) }
    })
  }

  const viewAsStudent = (id = null) => {
    if (id) {
      window.location.href = `/teachers/preview_as_student/${id}`
    } else {
      openModal(viewAsStudentModal)
    }
  }

  const renderBulkArchiveClassesBanner = () => {
    const ownedClassrooms = classrooms.filter(c => {
      const classroomOwner = c.teachers.find(t => t.classroom_relation === 'owner')
      return classroomOwner && classroomOwner.id === user.id
    })

    return (
      <BulkArchiveClassesBanner
        classes={ownedClassrooms}
        onSuccess={onSuccess}
        userId={user.id}
      />
    )
  }

  const renderClassroomCards = (ownActiveClassrooms) => {
    return classrooms.map(classroom => {
      const isOwnedByCurrentUser = !!ownActiveClassrooms.find(c => c.id === classroom.id)

      return (
        <Classroom
          archiveClass={() => openModal(archiveClassModal)}
          changeGrade={() => openModal(changeGradeModal)}
          classroom={classroom}
          classrooms={ownActiveClassrooms}
          clickClassroomHeader={clickClassroomHeader}
          importProviderClassroomStudents={importProviderClassroomStudents}
          inviteStudents={() => openModal(inviteStudentsModal)}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          key={classroom.id}
          onSuccess={onSuccess}
          renameClass={() => openModal(renameClassModal)}
          selected={classroom.id === selectedClassroomId}
          user={user}
          viewAsStudent={viewAsStudent}
        />
      )
    })
  }

  const renderClassroomRows = (ownActiveClassrooms) => {
    const classroomCards = renderClassroomCards(ownActiveClassrooms)
    const rows = getClassroomCardsWithHandle(classroomCards)

    return (
      <SortableList
        axis="y"
        data={rows}
        helperClass="sortable-classroom"
        sortCallback={sortClassrooms}
        useDragHandle={true}
      />
    )
  }

  const renderCreateAClassButton = () => {
    return (
      <button
        className="quill-button medium primary contained create-a-class-button"
        onClick={() => openModal(createAClassModal)}
        type="button"
      >
      Create a class
      </button>
    )
  }

  const renderCreateAClassModal = () => {
    if (visibleModal === createAClassModal) {
      return (
        <CreateAClassModal
          close={() => closeModal(getClassroomsAndCoteacherInvitations)}
          showSnackbar={showSnackbar}
        />
      )
    }
  }

  const renderInviteStudentsModal = () => {
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)

    if (visibleModal === inviteStudentsModal && selectedClassroom) {
      return (
        <InviteStudentsModal
          classroom={selectedClassroom}
          close={() => closeModal(getClassroomsAndCoteacherInvitations)}
          showSnackbar={showSnackbar}
        />
      )
    }
  }

  const renderChangeGradeModal = () => {
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)

    if (visibleModal === changeGradeModal && selectedClassroom) {
      return (
        <ChangeGradeModal
          classroom={selectedClassroom}
          close={closeModal}
          onSuccess={onSuccess}
        />
      )
    }
  }

  const renderArchiveClassModal = () => {
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)

    if (visibleModal === archiveClassModal && selectedClassroom) {
      return (
        <ArchiveClassModal
          classroom={selectedClassroom}
          close={closeModal}
          onSuccess={onSuccess}
        />
      )
    }
  }

  const renderHeader = () => {
    return (
      <div className="header">
        <h1>Active Classes</h1>
        <div className="buttons">
          {renderImportFromProviderButton(canvasProvider)}
          {renderImportFromProviderButton(cleverProvider)}
          {renderImportFromProviderButton(googleProvider)}
          {renderCreateAClassButton()}
        </div>
      </div>
    )
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

  const renderImportProviderClassroomStudentsModal = () => {
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)

    if (visibleModal === importProviderClassroomStudentsModal && selectedClassroom) {
      return (
        <ImportProviderClassroomStudentsModal
          classroom={selectedClassroom}
          close={closeModal}
          onSuccess={onSuccess}
          provider={provider}
          user={user}
        />
      )
    }
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

    if (visibleModal === linkCanvasAccountModal) {
      link = canvasLink
      linkAccountProvider = canvasProvider
    } else if (visibleModal === linkCleverAccountModal) {
      link = cleverLink
      linkAccountProvider = cleverProvider
    } else if (visibleModal === linkGoogleAccountModal) {
      // no link assignment since google uses a different component for linking accounts
      linkAccountProvider = googleProvider
    } else {
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

  const renderPageContent = () => {
    const ownActiveClassrooms = getOwnActiveClassrooms(classrooms)

    if (classrooms.length === 0 && coteacherInvitations.length === 0) {

      return (
        <div className="no-active-classes">
          <img alt="Gray book, open and blank" src={bookEmptySrc} />
          <h2>Add your first class</h2>
          <p>All teachers need a class! Choose to create or import your classes. </p>
        </div>
      )
    } else {
      const coteacherInvitationCards = coteacherInvitations.map(coteacherInvitation => {
        return (
          <CoteacherInvitation
            coteacherInvitation={coteacherInvitation}
            getClassroomsAndCoteacherInvitations={getClassroomsAndCoteacherInvitations}
            key={coteacherInvitation.id}
            showSnackbar={showSnackbar}
          />
        )
      })
      const classroomCards = renderClassroomRows(ownActiveClassrooms)
      return (
        <div className="active-classes">
          {coteacherInvitationCards}
          {classroomCards}
        </div>
      )
    }
  }

  const renderNoClassroomsToImportModal = () => {
    if (visibleModal === noClassroomsToImportModal) {
      return <NoClassroomsToImportModal close={closeModal} provider={provider} />
    }
  }

  const renderReauthorizeProviderModal = () => {
    return visibleModal === reauthorizeProviderModal
      ? <ReauthorizeProviderModal close={closeModal} link={reauthorizeLink} provider={provider} />
      : null
  }

  const renderRenameClassModal = () => {
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)

    if (visibleModal === renameClassModal && selectedClassroom) {
      return (
        <RenameClassModal
          classroom={selectedClassroom}
          close={closeModal}
          onSuccess={onSuccess}
        />
      )
    }
  }

  const renderSnackbar = () => {
    return <Snackbar text={snackbarCopy} visible={isSnackbarVisible} />
  }

  const renderViewAsStudentModal = () => {
    if (visibleModal === viewAsStudentModal) {
      return (
        <ViewAsStudentModal
          classrooms={classrooms}
          close={closeModal}
          defaultClassroomId={selectedClassroomId}
          handleViewClick={viewAsStudent}
        />
      )
    }
  }

  return (
    <React.Fragment>
      <div className="container gray-background-accommodate-footer active-classrooms classrooms-page">
        {renderCreateAClassModal()}
        {renderRenameClassModal()}
        {renderChangeGradeModal()}
        {renderArchiveClassModal()}
        {renderInviteStudentsModal()}
        {renderImportProviderClassroomsModal()}
        {renderImportProviderClassroomStudentsModal()}
        {renderReauthorizeProviderModal()}
        {renderLinkProviderAccountModal()}
        {renderNoClassroomsToImportModal()}
        {renderViewAsStudentModal()}
        {renderSnackbar()}
        {renderBulkArchiveClassesBanner()}
        {renderHeader()}
        {renderPageContent()}
      </div>
      <ArticleSpotlight blogPostId={MY_CLASSES_FEATURED_BLOG_POST_ID} />
    </React.Fragment>
  )
}

export default ActiveClassrooms
