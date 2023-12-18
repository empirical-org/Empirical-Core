import * as React from 'react';

import { DropdownInput, } from '../../../Shared/index';
import useModalAccessibility from '../../../Shared/hooks/useModalAccessibility'

const LogInAsATeacherModal = ({ teacherOptions, handleCloseModal, schoolOptions }) => {
  const { modalRef } = useModalAccessibility(handleCloseModal);

  const [school, setSchool] = React.useState(schoolOptions[0])
  const [teacher, setTeacher] = React.useState(null)

  function handleLogInClick() {
    window.location.href = `/users/${teacher.id}/admin_sign_in_classroom_manager`
  }

  const availableTeacherOptions = teacherOptions.filter(t => t.schoolId === school.id)

  return (
    <div className="modal-container admin-action-modal-container log-in-as-a-teacher-modal">
      <div className="modal-background" />
      <div
        aria-labelledby="logInAsATeacherModalTitle"
        aria-modal="true"
        className="admin-action-modal quill-modal"
        ref={modalRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="admin-action-modal-header">
          <h3 className="title" id="logInAsATeacherModalTitle">Log in as a teacher</h3>
        </div>
        <div className="admin-action-modal-body modal-body">
          <p>Access a teacher&#39;s account to assign activities, manage rosters, and view data.</p>
          <DropdownInput
            className='school-selector'
            handleChange={setSchool}
            isSearchable={true}
            label='School'
            options={schoolOptions}
            value={schoolOptions.find(s => s.value === school.id || s.value === school.value)}
          />
          <DropdownInput
            className='teacher-selector'
            handleChange={setTeacher}
            isSearchable={true}
            label='Teacher'
            options={availableTeacherOptions}
            value={teacher ? teacherOptions.find(t => t.value === teacher.id || t.value === teacher.value) : null}
          />
        </div>
        <div className="admin-action-modal-footer">
          <div className="buttons">
            <button className="quill-button outlined secondary medium focus-on-light" onClick={handleCloseModal} type="button">Cancel</button>
            <button className={`quill-button contained primary medium focus-on-light ${teacher ? '' : 'disabled'}`} disabled={!teacher} onClick={handleLogInClick} type="button">Log in</button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default LogInAsATeacherModal;
