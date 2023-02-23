import * as React from 'react';
import _ from 'underscore'

import { DataTable, DropdownInput, } from '../../Shared/index'
import { RESTRICTED, restrictedElement, } from '../shared'

interface AdminsTeachersProps {
  data: Array<Object>;
  schools: Array<{ name: string, id: number, role: string }>;
  adminAssociatedSchool: any;
  accessType: string;
  handleUserAction(url: string, data: Object): void;
}

enum modalNames {
  removeAdminModal = 'removeAdminModal',
  makeAdminModal = 'makeAdminModal',
}

const ADMIN = 'Admin'

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
}) => {
  const defaultSchool = schools.find(s => s.id === adminAssociatedSchool?.id) || schools[0]
  const [selectedSchoolId, setSelectedSchoolId] = React.useState(defaultSchool?.id)
  const [userIdForModal, setUserIdForModal] = React.useState(null)
  const [showModal, setShowModal] = React.useState(null)

  function onChangeSelectedSchool(selectedSchoolOption) { setSelectedSchoolId(selectedSchoolOption.value) }

  function closeModal() {
    setUserIdForModal(false)
    setShowModal(false)
  }

  function loginAsUser(id) {
    window.location.href = `/users/${id}/admin_sign_in_classroom_manager`
  }

  function viewPremiumReports(id) {
    window.location.href = `/users/${id}/admin_sign_in_progress_reports`
  }

  function resendLoginDetailsForTeacher(id) {
    handleUserAction(`/users/${id}/admin_resend_login_details`, { role: 'teacher', school_id: selectedSchoolId, })
  }

  function unlinkFromSchool(id) {
    handleUserAction(`/users/${id}/admin_unlink_from_school`, { role: 'teacher', })
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
    if (relevantSchool.role === ADMIN) {
      actions = user.last_sign_in ? [] : [actionsHash.resendLoginDetailsAdmin]
      actions = actions.concat([actionsHash.loginAsAdmin, actionsHash.viewPremiumReports, actionsHash.removeAsAdmin])
    } else {
      actions = user.last_sign_in ? [] : [actionsHash.resendLoginDetailsTeacher]
      actions = actions.concat([actionsHash.loginAsTeacher, actionsHash.viewPremiumReports, actionsHash.makeAdmin, actionsHash.unlinkFromSchool])
    }
    return actions
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
    user.role = relevantSchool.role
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
