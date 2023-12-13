import React from 'react';

import { requestGet, requestPost, } from '../../../modules/request/index';
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor';
import { DataTable, DropdownInput, Snackbar, defaultSnackbarTimeout, Spinner, } from '../../Shared/index';
import { ADMIN, PENDING, TEACHER, } from '../../Shared/utils/constants';
import { FULL, RESTRICTED, restrictedElement, } from '../shared';

interface AccountManagementProps {
  accessType: string;
  passedModel: any;
  adminId: number;
}

enum modalNames {
  removeAdminModal = 'removeAdminModal',
  makeAdminModal = 'makeAdminModal',
}

const RESTRICTED_TEXT = "Sorry, only verified admins with a subscription to School or District Premium can access this feature."

const AdminActionModal = ({ handleClickConfirm, handleCloseModal, headerText, bodyText, }) => {
  return (
    <div className="modal-container admin-action-modal-container">
      <div className="modal-background" />
      <div className="admin-action-modal quill-modal">

        <div className="admin-action-modal-header">
          <h3 className="title">{headerText}</h3>
        </div>

        <div className="admin-action-modal-body modal-body">
          <p>{bodyText}</p>
        </div>

        <div className="admin-action-modal-footer">
          <div className="buttons">
            <button className="quill-button outlined secondary medium focus-on-light" onClick={handleCloseModal} type="button">Cancel</button>
            <button className="quill-button contained primary medium focus-on-light" onClick={handleClickConfirm} type="button">Confirm</button>
          </div>
        </div>

      </div>
    </div>
  )

}
const DEFAULT_MODEL = { teachers: [] }

export const AccountManagement: React.SFC<AccountManagementProps> = ({
  accessType,
  passedModel,
  adminId,
}) => {
  const [loading, setLoading] = React.useState(passedModel ? false : true)
  const [model, setModel] = React.useState(passedModel || DEFAULT_MODEL)
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');
  const [userIdForModal, setUserIdForModal] = React.useState(null)
  const [showModal, setShowModal] = React.useState(null)
  const [error, setError] = React.useState('')
  const [selectedSchoolId, setSelectedSchoolId] = React.useState(null)

  React.useEffect(getData, [])

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  function getData(skipLoading = false) {
    initializePusher(skipLoading);
    requestGet(
      `${process.env.DEFAULT_URL}/admins/${adminId}`,
      (body) => {
        receiveData(body, skipLoading)
      }
    );
  }

  function receiveData(data, skipLoading) {
    if (Object.keys(data).length > 1) {
      setModel(data)
      const defaultSchool = data.schools.find(s => s.id === data.associated_school?.id) || data.schools[0]
      setSelectedSchoolId(defaultSchool?.id)
      setLoading(false)
    } else if (!skipLoading) {
      setModel(data)
      setLoading(true)
    }
  };

  function initializePusher(skipLoading) {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminId));
    channel.bind('admin-users-found', () => {
      getData(skipLoading)
    });
  };

  function handleUserAction(link, data) {
    setError('')
    initializePusher(true)
    requestPost(
      link,
      data,
      (response) => {
        getData(true)
        setSnackbarText(response.message)
        setShowSnackbar(true)
      },
      (response) => {
        if (response.error) {
          setError(response.error);
        } else {
          // to do, use Sentry to capture error
        }
      }
    );
  }

  function onChangeSelectedSchool(selectedSchoolOption) { setSelectedSchoolId(selectedSchoolOption.value) }

  function closeModal() {
    setUserIdForModal(false)
    setShowModal(false)
  }

  function loginAsUser(id) {
    if (accessType === FULL) {
      window.location.href = `/users/${id}/admin_sign_in_classroom_manager`
    } else {
      setSnackbarText(RESTRICTED_TEXT)
      setShowSnackbar(true)
    }
  }

  function viewPremiumReports(id) {
    if (accessType === FULL) {
      window.location.href = `/users/${id}/admin_sign_in_progress_reports`
    } else {
      setSnackbarText(RESTRICTED_TEXT)
      setShowSnackbar(true)
    }
  }

  function resendLoginDetailsForTeacher(id) {
    handleUserAction(`/users/${id}/admin_resend_login_details`, { role: 'teacher', school_id: selectedSchoolId, })
  }

  function unlinkFromSchool(id) {
    handleUserAction(`/users/${id}/admin_unlink_from_school`, { role: 'teacher', })
  }

  function approveAdminRequest(id) {
    handleUserAction(`/users/${id}/approve_admin_request`, { school_id: selectedSchoolId, })
  }

  function denyAdminRequest(id) {
    handleUserAction(`/users/${id}/deny_admin_request`, { school_id: selectedSchoolId, })
  }

  function resendLoginDetailsForAdmin(id) {
    handleUserAction(`/users/${id}/admin_resend_login_details`, { role: 'admin', school_id: selectedSchoolId, })
  }

  function handleConfirmMakeAdmin() {
    handleUserAction(`/users/${userIdForModal}/admin_make_admin`, { school_id: selectedSchoolId, })
    closeModal()
  }

  function handleConfirmRemoveAsAdmin() {
    handleUserAction(`/users/${userIdForModal}/admin_remove_as_admin`, { school_id: selectedSchoolId, })
    closeModal()
  }

  function removeAsAdmin(id) {
    setUserIdForModal(id)
    setShowModal(modalNames.removeAdminModal)
  }

  function makeAdmin(id) {
    setUserIdForModal(id)
    setShowModal(modalNames.makeAdminModal)
  }

  const actionsHash = {
    resendLoginDetailsAdmin: {
      name: 'Resend login details',
      action: (id) => resendLoginDetailsForAdmin(id)
    },
    resendLoginDetailsTeacher: {
      name: 'Resend login details',
      action: (id) => resendLoginDetailsForTeacher(id)
    },
    loginAsAdmin: {
      name: 'Login as admin',
      action: (id) => loginAsUser(id)
    },
    loginAsTeacher: {
      name: 'Login as teacher',
      action: (id) => loginAsUser(id)
    },
    viewPremiumReports: {
      name: 'View premium reports',
      action: (id) => viewPremiumReports(id)
    },
    approveAdminRequest: {
      name: 'Approve admin request',
      action: (id) => approveAdminRequest(id)
    },
    denyAdminRequest: {
      name: 'Deny admin request',
      action: (id) => denyAdminRequest(id)
    },
    removeAsAdmin: {
      name: 'Remove as admin',
      action: (id) => removeAsAdmin(id)
    },
    makeAdmin: {
      name: 'Make admin',
      action: (id) => makeAdmin(id)
    },
    unlinkFromSchool: {
      name: 'Unlink from school',
      action: (id) => unlinkFromSchool(id)
    },
  }

  function actionsForUser(user, relevantSchool) {
    let actions
    if (relevantSchool.role.toLowerCase() === ADMIN) {
      actions = user.last_sign_in ? [] : [actionsHash.resendLoginDetailsAdmin]
      actions = actions.concat([actionsHash.loginAsAdmin, actionsHash.viewPremiumReports, actionsHash.removeAsAdmin])
    } else if (pendingAdminRequest(user, relevantSchool)) {
      actions = user.last_sign_in ? [] : [actionsHash.resendLoginDetailsTeacher]
      actions = actions.concat([actionsHash.loginAsTeacher, actionsHash.viewPremiumReports, actionsHash.approveAdminRequest, actionsHash.denyAdminRequest, actionsHash.unlinkFromSchool])
    } else {
      actions = user.last_sign_in ? [] : [actionsHash.resendLoginDetailsTeacher]
      actions = actions.concat([actionsHash.loginAsTeacher, actionsHash.viewPremiumReports, actionsHash.makeAdmin, actionsHash.unlinkFromSchool])
    }
    return actions
  }

  function pendingAdminRequest(user, relevantSchool) {
    return relevantSchool.role.toLowerCase() === TEACHER && user.admin_info?.approval_status === PENDING && model.admin_approval_requests.find(request => request.admin_info_id === user.admin_info?.id)
  }

  const teacherColumns = [
    {
      name: 'Name',
      attribute: 'name',
      isSortable: true,
      width: '350px'
    },
    {
      name: 'Role',
      attribute: 'role',
      isSortable: true,
      width: '314px'
    },
    {
      name: 'Students',
      attribute: 'number_of_students',
      isSortable: true,
      width: '118px',
    },
    {
      name: 'Activities Completed',
      attribute: 'number_of_activities_completed',
      isSortable: true,
      width: '118px',
    },
    {
      name: 'Time Spent',
      attribute: 'time_spent',
      isSortable: true,
      width: '91px',
    },
    {
      name: 'Actions',
      attribute: 'actions',
      isActions: true,
      width: '48px'
    }
  ];

  if (loading) {
    return (
      <div className="white-background-accommodate-footer account-management">
        <div className="container">
          <div className="header">
            <h1>Account Management</h1>
            <button className="quill-button contained medium focus-on-light primary" type="button">Create and link accounts</button>
          </div>
          <Spinner />
        </div>
      </div>
    )
  }


  const schoolOptions = model.schools.map(school => ({ value: school.id, label: school.name}))
  const filteredData = model.teachers.filter((d: { school: string }) => d.schools.find(s => s.id === selectedSchoolId)).map(user => {
    const relevantSchool = user.schools.find(s => s.id === selectedSchoolId)
    user.actions = actionsForUser(user, relevantSchool)
    const adminRequest = pendingAdminRequest(user, relevantSchool)
    if (adminRequest) {
      user.role = adminRequest.request_made_during_sign_up ? "🛎️ New user requested to become admin" : "🛎️ Teacher requested to become admin"
    } else {
      user.role = relevantSchool.role
    }
    return user
  })

  const userNameForModal = model.teachers.find(user => user.id === userIdForModal)?.name
  const schoolNameForModal = model.schools.find(s => s.id === selectedSchoolId)?.name

  let accountManagementContent = (
    <React.Fragment>
      <DropdownInput
        handleChange={onChangeSelectedSchool}
        isSearchable={true}
        options={schoolOptions}
        value={schoolOptions.find(so => so.value === selectedSchoolId)}
      />
      <div className="admins-teachers">
        <DataTable
          className='progress-report has-green-arrow'
          defaultSortAttribute="role"
          headers={teacherColumns}
          rows={filteredData}
          showActions={true}
        />
      </div>
      <p className="warning-section">
        <span className="warning">Warning:</span> Any changes you make when you
        access a teacher account will impact the teacher and student facing
        dashboards. This list provides you with the ability to sign in to all of the
        teacher accounts for the schools you have admin access.
        <strong>The data above represents usage from this school year, beginning July 1st.</strong>
      </p>
    </React.Fragment>
  )

  if (accessType === RESTRICTED) {
    accountManagementContent = restrictedElement
  }

  return (
    <div className="white-background-accommodate-footer account-management">
      <div className="container">
        <Snackbar text={snackbarText} visible={showSnackbar} />
        {showModal === modalNames.makeAdminModal && (
          <AdminActionModal
            bodyText={`Are you sure you want to add ${userNameForModal} as an admin of ${schoolNameForModal}?`}
            handleClickConfirm={handleConfirmMakeAdmin}
            handleCloseModal={closeModal}
            headerText="Add admin?"
          />
        )}
        {showModal === modalNames.removeAdminModal && (
          <AdminActionModal
            bodyText={`Are you sure you want to remove ${userNameForModal} as an admin of ${schoolNameForModal}?`}
            handleClickConfirm={handleConfirmRemoveAsAdmin}
            handleCloseModal={closeModal}
            headerText="Remove admin?"
          />
        )}
        <div className="header">
          <h1>Account Management</h1>
          <button className="quill-button contained medium focus-on-light primary" type="button">Create and link accounts</button>
        </div>
        {accountManagementContent}
      </div>
    </div>
  );
}

export default AccountManagement
