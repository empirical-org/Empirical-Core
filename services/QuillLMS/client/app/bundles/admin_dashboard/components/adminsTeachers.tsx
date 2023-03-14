import * as React from 'react';
import _ from 'underscore'

import { DataTable, DropdownInput, Snackbar, defaultSnackbarTimeout, } from '../../Shared/index'
import { RESTRICTED, FULL, restrictedElement, } from '../shared'
import { ADMIN, TEACHER, PENDING, } from '../../Shared/utils/constants'
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor'

interface AdminsTeachersProps {
  data: Array<Object>;
  schools: Array<{ name: string, id: number, role: string }>;
  adminAssociatedSchool: any;
  accessType: string;
  handleUserAction(url: string, data: Object): void;
  adminApprovalRequestAdminInfoIds: number[]
}

enum modalNames {
  removeAdminModal = 'removeAdminModal',
  makeAdminModal = 'makeAdminModal',
}

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

export const AdminsTeachers: React.SFC<AdminsTeachersProps> = ({
  data,
  handleUserAction,
  schools,
  adminAssociatedSchool,
  accessType,
  adminApprovalRequestAdminInfoIds,
}) => {
  const defaultSchool = schools.find(s => s.id === adminAssociatedSchool?.id) || schools[0]
  const [selectedSchoolId, setSelectedSchoolId] = React.useState(defaultSchool?.id)
  const [userIdForModal, setUserIdForModal] = React.useState(null)
  const [showModal, setShowModal] = React.useState(null)
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  function onChangeSelectedSchool(selectedSchoolOption) { setSelectedSchoolId(selectedSchoolOption.value) }

  function closeModal() {
    setUserIdForModal(false)
    setShowModal(false)
  }

  function loginAsUser(id) {
    if (accessType === FULL) {
      window.location.href = `/users/${id}/admin_sign_in_classroom_manager`
    } else {
      setShowSnackbar(true)
    }
  }

  function viewPremiumReports(id) {
    if (accessType === FULL) {
      window.location.href = `/users/${id}/admin_sign_in_progress_reports`
    } else {
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
    } else if (userHasPendingAdminRequest(user, relevantSchool)) {
      actions = user.last_sign_in ? [] : [actionsHash.resendLoginDetailsTeacher]
      actions = actions.concat([actionsHash.loginAsTeacher, actionsHash.viewPremiumReports, actionsHash.approveAdminRequest, actionsHash.denyAdminRequest, actionsHash.unlinkFromSchool])
    } else {
      actions = user.last_sign_in ? [] : [actionsHash.resendLoginDetailsTeacher]
      actions = actions.concat([actionsHash.loginAsTeacher, actionsHash.viewPremiumReports, actionsHash.makeAdmin, actionsHash.unlinkFromSchool])
    }
    return actions
  }

  function userHasPendingAdminRequest(user, relevantSchool) {
    return relevantSchool.role.toLowerCase() === TEACHER && adminApprovalRequestAdminInfoIds.includes(user.admin_info?.id) && user.admin_info?.approval_status === PENDING
  }

  const teacherColumns = [
    {
      name: 'Name',
      attribute: 'name',
      width: '350px'
    },
    {
      name: 'Role',
      attribute: 'role',
      width: '314px'
    },
    {
      name: 'Students',
      attribute: 'number_of_students',
      width: '118px',
    },
    {
      name: 'Activities Completed',
      attribute: 'number_of_activities_completed',
      width: '118px',
    },
    {
      name: 'Time Spent',
      attribute: 'time_spent',
      width: '91px',
    },
    {
      name: 'Actions',
      attribute: 'actions',
      isActions: true,
      width: '48px'
    }
  ];

  const schoolOptions = schools.map(school => ({ value: school.id, label: school.name}))
  const filteredData = data.filter((d: { school: string }) => d.schools.find(s => s.id === selectedSchoolId)).map(user => {
    const relevantSchool = user.schools.find(s => s.id === selectedSchoolId)
    user.actions = actionsForUser(user, relevantSchool)
    user.role = userHasPendingAdminRequest(user, relevantSchool) ? "🛎️ Teacher requested to become admin" : relevantSchool.role
    return user
  })

  const userNameForModal = data.find(user => user.id === userIdForModal)?.name
  const schoolNameForModal = schools.find(s => s.id === selectedSchoolId)?.name

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
        <strong>The data below represents usage from this school year, beginning July 1st.</strong>
      </p>
    </React.Fragment>
  )

  if (accessType === RESTRICTED) {
    accountManagementContent = restrictedElement
  }

  return (
    <div className="teacher-account-access-container">
      <Snackbar text="Sorry, only verified admins with a subscription to School or District Premium can access this feature." visible={showSnackbar} />
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
      <h2>Account Management</h2>
      {accountManagementContent}
    </div>
  );
};

export default AdminsTeachers;
