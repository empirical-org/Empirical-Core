import * as React from 'react';

import { requestPost } from '../../../modules/request';
import { Input, Snackbar, Spinner, defaultSnackbarTimeout } from '../../Shared';
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor';
import { DataTable } from '../../Shared/index';
import { InputEvent } from '../interfaces/evidenceInterfaces';

const ADMIN = 'admin';

interface NewAdminOrDistrictUserProps {
  type: string,
  returnUrl: string,
  schoolId?: number,
  districtId?: number,
  schools?: any[]
}

interface School {
  id: number,
  name: string,
  checked: boolean,
  has_subscription: string
}

const NewAdminOrDistrictUser = ({ type, returnUrl, schoolId, districtId, schools }: NewAdminOrDistrictUserProps) => {
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const [snackbarText, setSnackbarText] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const reformattedSchools = schools.map((s) => {
    s.has_subscription ? s.has_subscription = 'Yes' : s.has_subscription = ''
    return s
  })
  const [checklistSchools, setChecklistSchools] = React.useState<School[]>(reformattedSchools);

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
      setLoading(true);
      setError('');
      const requestUrl = type === ADMIN ? `/cms/schools/${schoolId}/school_admins` : `/cms/districts/${districtId}/district_admins`
      const params = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        school_ids: checklistSchools.filter((s) => s.checked).map((s) => s.id),
      }
      requestPost(requestUrl, params, (body) => {
        if(body.error) {
          setSnackbarText(body.error);
          setShowSnackbar(true);
          setLoading(false);
        } else {
          setSnackbarText(body.message);
          setShowSnackbar(true);
          setLoading(false);
          setFirstName('');
          setLastName('');
          setEmail('');
        }
      })
    }
  }

  function handleCancelClick() {
    window.location.href = returnUrl
  }

  function checkAllRows() {
    const schools = checklistSchools.map(school => {
      school.checked = true
      return school
    })
    setChecklistSchools(schools)
  }

  function uncheckAllRows() {
    const schools = checklistSchools.map(school => {
      school.checked = false
      return school
    })
    setChecklistSchools(schools)
  }

  function handleCheckboxChange(id) {
    const schools = [...checklistSchools]
    const school = schools.find(school => school.id === id)
    school.checked = !school.checked
    setChecklistSchools(schools)
  };

  function attachSchools() {
    const headers = [
      {width: '460px', name: 'School', attribute: 'name'},
      {width: '120px', name: 'Has Subscription?', attribute: 'has_subscription'}
    ]

    return (
      <section>
        <h3>Attach Schools</h3>
        <p>The user will become an Admin for the following schools:</p>
        <DataTable
          checkAllRows={checkAllRows}
          checkRow={handleCheckboxChange}
          headers={headers}
          rows={checklistSchools}
          showCheckboxes={true}
          uncheckAllRows={uncheckAllRows}
          uncheckRow={handleCheckboxChange}
        />
      </section>
    )
  }

  const header = type === ADMIN ? 'New Admin' : 'New District Admin'
  const linkLabel = type === ADMIN ? 'School Directory > Add New Admin User' : 'District Directory > Add New District Admin User'
  const innerSubmitButtonElement = loading ? <Spinner /> : 'Submit';

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
        {type !== ADMIN && attachSchools()}
        <section className="buttons-container">
          <button className="quill-button small primary contained" onClick={handleSubmitClick}>{innerSubmitButtonElement}</button>
          <button className="quill-button small secondary outlined" onClick={handleCancelClick}>Cancel</button>
        </section>
        {error && <p className="error-message">{error}</p>}
      </section>
    </section>
  )
}

export default NewAdminOrDistrictUser
