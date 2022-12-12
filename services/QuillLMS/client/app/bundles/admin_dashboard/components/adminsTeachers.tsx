import * as React from 'react';
import TeacherLinks from './teacher_links';
import UnlinkLink from './unlink_link';
import _ from 'underscore'

import { DataTable, DropdownInput, } from '../../Shared/index'

interface AdminsTeachersProps {
  data: Array<Object>;
  schools: Array<{ name: string, id: number, role: string }>;
  adminAssociatedSchool: any;
  handleUserAction(url: string, data: Object): void;
}

export const AdminsTeachers: React.SFC<AdminsTeachersProps> = ({
  data,
  handleUserAction,
  schools,
  adminAssociatedSchool,
}) => {
  const defaultSchool = schools.find(s => s.id === adminAssociatedSchool?.id) || schools[0]
  const [selectedSchoolId, setSelectedSchoolId] = React.useState(defaultSchool.id)
  const [userIdForModal, setUserIdForModal] = React.useState(null)
  const [showModal, setShowModal] = React.useState(null)

  function onChangeSelectedSchool(selectedSchoolOption) { setSelectedSchoolId(selectedSchoolOption.value) }

  function loginAsUser(id) {
    window.location.href = `/users/${id}/admin_sign_in_classroom_manager`
  }

  function viewPremiumReports(id) {
    window.location.href = `/users/${id}/admin_sign_in_progress_reports`
  }

  function resendLoginDetailsForTeacher(id) {
    handleUserAction(`/users/${id}/resend_login_details`, { role: 'teacher', school_id: selectedSchoolId, })
  }

  function resendLoginDetailsForAdmin(id) {
    handleUserAction(`/users/${id}/resend_login_details`, { role: 'admin', school_id: selectedSchoolId, })
  }

  const actions = () => {
    return {
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
        action: (id) => viewAsStudent(id)
      },
      unlinkFromSchool: {
        name: 'Unlink from school',
        action: (id) => viewAsStudent(id)
      },
    }
  }

  function actionsForUser(user, relevantSchool) {
    if (relevantSchool.role === 'Admin') {
      
    }
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
      width: '350px'
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
  const filteredData = data.filter((d: { school: string }) => d.schools.include(s => s.id === selectedSchoolId)).map(user => {
    const relevantSchool = user.schools.find(s => s.id === selectedSchoolId)
    user.actions = actionsForUser(user, relevantSchool)
    user.role = relevantSchool.role
    return
  })

  return (
    <div className="teacher-account-access-container">
      <h2>Account Management</h2>
      <DropdownInput
        handleChange={onChangeSelectedSchool}
        isSearchable={true}
        options={schoolOptions}
        value={schoolOptions.find(so => so.value === selectedSchoolId)}
      />
      <div className="admins-teachers">
        <DataTable
          className='progress-report has-green-arrow'
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
    </div>
  );
};

export default AdminsTeachers;
