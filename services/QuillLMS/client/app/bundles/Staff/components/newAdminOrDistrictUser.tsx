import * as React from 'react';

import { Input } from '../../Shared';
import { InputEvent } from '../interfaces/evidenceInterfaces';

const ADMIN = 'admin'
const FIRST_NAME = 'First name'
const LAST_NAME = 'Last name'
const EMAIL = 'Email'

interface NewAdminOrDistrictUserProps {
  type: string,
  return_url: string,
  school?: any,
  district?: any
}

const NewAdminOrDistrictUser = ({ type, return_url, school, district }: NewAdminOrDistrictUserProps) => {
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [errors, setErrors] = React.useState<{}>({});

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

  function validateForm() {
    const errors = {};
    [FIRST_NAME, LAST_NAME, EMAIL].map((value) => {
      switch(value) {
        case FIRST_NAME:
          if(!firstName) {
            errors[FIRST_NAME] = `${FIRST_NAME} cannot be blank.`
          }
          break;
        case LAST_NAME:
          if(!lastName) {
            errors[LAST_NAME] = `${LAST_NAME} cannot be blank.`
          }
          break;
        case EMAIL:
          if(!email) {
            errors[EMAIL] = `${EMAIL} cannot be blank.`
          }
          break;
      }
    });
    return errors;
  }

  function handleSubmitClick() {
    const errors = validateForm();
    if(Object.keys(errors)) {
      setErrors(errors);
    } else {
      setErrors({});
    }
  }

  function handleCancelClick() {
    window.location.href = return_url
  }

  const header = type === ADMIN ? 'New Admin' : 'New District Admin'
  const linkLabel = type === ADMIN ? 'School Directory > New Admin' : 'District Directory > New Admin'

  return(
    <div className='container'>
      <section className='simple-rounded-box cms-container'>
        <a className="data-link" href={return_url}>{linkLabel}</a>
        <h2>{header}</h2>
        <p>Please enter the details of a new or existing user that you want to make an admin. They will receive an email with the login details.</p>
        <div className='cms-form'>
          <div className="name-inputs-container">
            <Input
              className="name-input"
              error={errors[FIRST_NAME]}
              handleChange={handleSetFirstName}
              label={FIRST_NAME}
              value={firstName}
            />
            <Input
              className="name-input"
              error={errors[LAST_NAME]}
              handleChange={handleSetLastName}
              label={LAST_NAME}
              value={lastName}
            />
          </div>
          <Input
            className="email-input"
            error={errors[EMAIL]}
            handleChange={handleSetEmail}
            label={EMAIL}
            value={email}
          />
          <div className="buttons-container">
            <button className="quill-button small primary contained" onClick={handleSubmitClick}>Submit</button>
            <button className="quill-button small secondary outlined" onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NewAdminOrDistrictUser
