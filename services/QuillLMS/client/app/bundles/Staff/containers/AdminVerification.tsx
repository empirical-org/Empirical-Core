import * as moment from 'moment'
import * as React from 'react'

import { requestGet, requestPut } from '../../../modules/request'
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor'
import { DataTable, defaultSnackbarTimeout, Snackbar, Spinner } from '../../Shared/index'
import ApproveModal from '../components/adminVerification.tsx/approveModal'
import DenyModal from '../components/adminVerification.tsx/denyModal'
import UndoModal from '../components/adminVerification.tsx/undoModal'

const PENDING = 'Pending'
const COMPLETED = 'Completed'
const IS_ACTIVE = 'is-active'

const APPROVE_MODAL = 'approveModal'
const DENY_MODAL = 'denyModal'
const UNDO_MODAL = 'undoModal'

const dataTableFields = [
  {
    name: 'Date of Request',
    attribute: 'date',
    width: '90px'
  },
  {
    name: 'Name',
    attribute: 'name',
    width: '120px'
  },
  {
    name: 'School',
    attribute: 'school',
    width: '120px'
  },
  {
    name: 'Email',
    attribute: 'email',
    width: '250px'
  },
  {
    name: 'LinkedIn URL or Other URL',
    attribute: 'verificationURL',
    width: '250px'
  },
  {
    name: 'Reason',
    attribute: 'verificationReason',
    width: '300px'
  },
  {
    name: 'Location',
    attribute: 'location',
    width: '200px'
  },
  {
    name: 'Approval',
    attribute: 'approval',
    width: '90px',
    noTooltip: true,
    rowSectionClassName: 'approval-section'
  },
];

const ApprovalStatusElement = ({ id, approvalStatus, onClickApprove, onClickDeny, onClickUndo,  }) => {
  function handleClickApprove() { onClickApprove(id) }
  function handleClickDeny() { onClickDeny(id) }
  function handleClickUndo() { onClickUndo(id) }

  if (approvalStatus === PENDING) {
    return (
      <React.Fragment>
        <button className="interactive-wrapper focus-on-light" onClick={handleClickApprove} type="button">Approve</button>
        <button className="interactive-wrapper focus-on-light" onClick={handleClickDeny} type="button">Deny</button>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <span>{approvalStatus}</span>
        <button className="interactive-wrapper focus-on-light" onClick={handleClickUndo} type="button">Undo</button>
      </React.Fragment>
    )
  }
}

const AdminVerification = ({}) => {
  const [activeTab, setActiveTab] = React.useState(PENDING)
  const [pendingRecords, setPendingRecords] = React.useState(null)
  const [completedRecords, setCompletedRecords] = React.useState(null)
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [idForModal, setIdForModal] = React.useState(null)
  const [modalToShow, setModalToShow] = React.useState(null)

  function setActiveTabToPending() { setActiveTab(PENDING) }
  function setActiveTabToCompleted() { setActiveTab(COMPLETED) }

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  React.useEffect(() => {
    getAdminInfoRecords()
  }, [])

  function getAdminInfoRecords() {
    requestGet('/cms/admin_verification', (body) => {
      setPendingRecords(body.pending)
      setCompletedRecords(body.completed)
    })
  }

  function closeModal() {
    setIdForModal(null)
    setModalToShow(null)
  }

  function handleClickApprove(id) {
    setIdForModal(id)
    setModalToShow(APPROVE_MODAL)
  }

  function handleClickDeny(id) {
    setIdForModal(id)
    setModalToShow(DENY_MODAL)
  }

  function handleClickUndo(id) {
    setIdForModal(id)
    setModalToShow(UNDO_MODAL)
  }

  function approve() {
    requestPut(
      '/cms/admin_verification/set_approved',
      { admin_info_id: idForModal, },
      () => {
        setSnackbarText('Request approved')
        setShowSnackbar(true)
        setIdForModal(null)
        setModalToShow(null)
        getAdminInfoRecords()
      }
    )
  }

  function deny() {
    requestPut(
      '/cms/admin_verification/set_denied',
      { admin_info_id: idForModal, },
      () => {
        setSnackbarText('Request denied')
        setShowSnackbar(true)
        setIdForModal(null)
        setModalToShow(null)
        getAdminInfoRecords()
      }
    )
  }

  function undo() {
    requestPut(
      '/cms/admin_verification/set_pending',
      { admin_info_id: idForModal, },
      () => {
        setSnackbarText('Admin verification undone')
        setShowSnackbar(true)
        setIdForModal(null)
        setModalToShow(null)
        getAdminInfoRecords()
      }
    )
  }

  const rows = () => {
    const records = activeTab === PENDING ? pendingRecords : completedRecords
    return records.map(record => {
      const { admin_info_id, approval_status, date, name, school, email, verification_url, verification_reason, location, } = record
      return {
        name,
        date: moment(date).format('MM/DD/YY'),
        school: school,
        email: email,
        verificationURL: <a href={verification_url} rel="noopener noreferrer" target="_blank">{verification_url}</a>,
        verificationReason: verification_reason,
        location: location,
        approval: (
          <ApprovalStatusElement
            approvalStatus={approval_status}
            id={admin_info_id}
            onClickApprove={handleClickApprove}
            onClickDeny={handleClickDeny}
            onClickUndo={handleClickUndo}
          />
        )
      }
    })
  }

  let content = <div className="loading-spinner-container"><Spinner /></div>

  if (pendingRecords && completedRecords) {
    content = (
      <DataTable
        headers={dataTableFields}
        rows={rows()}
      />
    )
  }

  return (
    <div className="main-admin-container admin-verification">
      <section className="left-side-menu">
        <ul className="menu-list">
          <button className={activeTab === PENDING ? IS_ACTIVE : ''} onClick={setActiveTabToPending} type="button">{PENDING}</button>
          <button className={activeTab === COMPLETED ? IS_ACTIVE : ''} onClick={setActiveTabToCompleted} type="button">{COMPLETED}</button>
        </ul>
      </section>
      <Snackbar text={snackbarText} visible={showSnackbar} />
      {modalToShow === APPROVE_MODAL && <ApproveModal approve={approve} closeModal={closeModal} />}
      {modalToShow === DENY_MODAL && <DenyModal closeModal={closeModal} deny={deny} />}
      {modalToShow === UNDO_MODAL && <UndoModal closeModal={closeModal} undo={undo} />}
      {content}
    </div>
  )
}

export default AdminVerification
