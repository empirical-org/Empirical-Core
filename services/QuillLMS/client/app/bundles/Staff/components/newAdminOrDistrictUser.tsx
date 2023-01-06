import * as React from 'react';

import { Input, Snackbar, defaultSnackbarTimeout, } from '../../Shared';
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor'
import { InputEvent } from '../interfaces/evidenceInterfaces';
import { requestPost } from '../../../modules/request';

const ADMIN = 'admin'

interface NewAdminOrDistrictUserProps {
  type: string,
  returnUrl: string,
  schoolId?: any,
  districtId?: any
}

const NewAdminOrDistrictUser = ({ type, returnUrl, schoolId, districtId }: NewAdminOrDistrictUserProps) => {
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  function handleSetFirstName(e: InputEvent) {
    const { target } = e;
    const { value } = target;
    setFirstName(value);
  }

  function handleSetLastName(e: InputEvent) {
    const { target } = e;
    const { value } = target;
    setLastName(value);
  }

  function handleSetEmail(e: InputEvent) {
    const { target } = e;
    const { value } = target;
    setEmail(value);
  }

  function handleSubmitClick() {
    if(!firstName || !lastName || !email) {
      setError('Form fields cannot be blank.');
    } else {
      setError('');
      const requestUrl = type === ADMIN ? `/cms/schools/${schoolId}/school_admins` : `/cms/districts/${districtId}/district_admins`
      const params = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim()
      }
      requestPost(requestUrl, params, (body) => {
        if(body.error) {
          setSnackbarText(body.error);
          setShowSnackbar(true);
        } else {
          setSnackbarText(body.message);
          setShowSnackbar(true);
        }
      })
    }
  }

  function handleCancelClick() {
    window.location.href = returnUrl
  }

  const header = type === ADMIN ? 'New Admin' : 'New District Admin'
  const linkLabel = type === ADMIN ? 'School Directory > Add New Admin User' : 'District Directory > Add New District Admin User'

  return (
    <section className='container new-admin-user-container'>
      <Snackbar text={snackbarText} visible={showSnackbar} />
      <a className="data-link" href={returnUrl}>{linkLabel}</a>
      <h2>{header}</h2>
      <p className="instructions">Please enter the details of a new or existing user that you want to make an admin. They will receive an email with the login details.</p>
      <section className='cms-form'>
        <section className="name-inputs-container">
          <Input
            className="user-details-input"
            handleChange={handleSetFirstName}
            label="First name"
            value={firstName}
          />
          <Input
            className="user-details-input"
            handleChange={handleSetLastName}
            label="Last name"
            value={lastName}
          />
        </section>
        <Input
          className="user-details-input"
          handleChange={handleSetEmail}
          label="Email"
          value={email}
        />
        <section className="buttons-container">
          <button className="quill-button small primary contained" onClick={handleSubmitClick}>Submit</button>
          <button className="quill-button small secondary outlined" onClick={handleCancelClick}>Cancel</button>
        </section>
        {error && <p className="error-message">{error}</p>}
      </section>
    </section>
  )
}

export default NewAdminOrDistrictUser
