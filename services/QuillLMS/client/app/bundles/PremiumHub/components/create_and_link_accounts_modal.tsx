import * as React from 'react';

import { DropdownInput, Input } from '../../Shared/index';
import useModalAccessibility from '../../Shared/hooks/useModalAccessibility'

const roleOptions = [{ value: 'teacher', label: 'Teacher' }, { value: 'admin', label: 'Admin' }];

const CreateAndLinkAccountsModal = ({ addTeacherAccount, handleCloseModal, schoolOptions }) => {
  const { modalRef } = useModalAccessibility(handleCloseModal);

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [school, setSchool] = React.useState(schoolOptions[0])
  const [role, setRole] = React.useState(roleOptions[0])

  const supportLink = <a href="http://support.quill.org/getting-started-for-teachers/manage-classes/how-can-i-connect-my-account-to-my-school" rel="noopener noreferrer" target="_blank"> Here&#39;s the guide</a>

  function handleFirstNameChange(e) { setFirstName(e.target.value) }

  function handleLastNameChange(e) { setLastName(e.target.value) }

  function handleEmailChange(e) { setEmail(e.target.value) }

  function handleSubmitClick() {
    const data = {
      teacher: {
        first_name: firstName,
        last_name: lastName,
        role: role.value,
        email
      },
      school_id: school.value || school.id
    }

    addTeacherAccount(data)
    handleCloseModal()
  }

  return (
    <div className="modal-container admin-action-modal-container create-and-link-accounts-modal">
      <div className="modal-background" />
      <div
        aria-labelledby="createAndLinkAccountsModalTitle"
        aria-modal="true"
        className="admin-action-modal quill-modal"
        ref={modalRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="admin-action-modal-header">
          <h3 className="title" id="createAndLinkAccountsModalTitle">Create and Link Accounts</h3>
        </div>
        <div className="admin-action-modal-body modal-body">
          <section className="name-inputs-container">
            <Input className="first-name" handleChange={handleFirstNameChange} label="First Name" value={firstName} />
            <Input className="last-name" handleChange={handleLastNameChange} label="Last Name" value={lastName} />
          </section>
          <Input className="email" handleChange={handleEmailChange} label="Email Address" value={email} />
          <DropdownInput
            className='school-selector'
            handleChange={setSchool}
            isSearchable={true}
            label='School'
            options={schoolOptions}
            value={schoolOptions.find(s => s.value === school.id || s.value === school.value)}
          />
          <DropdownInput
            className='role-selector'
            handleChange={setRole}
            label='Role'
            options={roleOptions}
            value={role}
          />
          <section className="info-section-container">
            <section className="info-section">
              <span>How does this work for new accounts?</span>
              <p>An account linked to the selected school will be created on their behalf and they will receive an email with the login details.</p>
            </section>
            <section className="info-section">
              <span>How does this work for existing accounts?</span>
              <p>They will receive an email asking them to link their account to the selected school. They can also link to their school from the <a href="/teachers/my_account">My Account</a> page. {supportLink}.</p>
            </section>
          </section>
        </div>
        <div className="admin-action-modal-footer">
          <div className="buttons">
            <button className="quill-button outlined secondary medium focus-on-light" onClick={handleCloseModal} type="button">Cancel</button>
            <button className="quill-button contained primary medium focus-on-light" onClick={handleSubmitClick} type="submit">Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CreateAndLinkAccountsModal;
