import * as React from 'react';

import { titleCase, Input } from '../../../Shared';
import { FIRST_NAME, LAST_NAME, EMAIL, TITLE, PHONE_NUMBER, } from '../../../../constants/salesForm';

export const UpperFormFields = ({ type, errors, handleUpdateField, firstName, lastName, email, title, phoneNumber }) => {

  return(
    <React.Fragment>
      <h3 className="form-header">{`${titleCase(type)} form`}</h3>
      <p className="disclaimer">Please fill out this form. We will respond with a quote within three business days.</p>
      <Input
        className="form-input first-name"
        error={errors[FIRST_NAME]}
        handleChange={handleUpdateField}
        id={FIRST_NAME}
        label={FIRST_NAME}
        placeholder=""
        value={firstName}
      />
      <Input
        className="form-input last-name"
        error={errors[LAST_NAME]}
        handleChange={handleUpdateField}
        id={LAST_NAME}
        label={LAST_NAME}
        placeholder=""
        value={lastName}
      />
      <Input
        className="form-input email"
        error={errors[EMAIL]}
        handleChange={handleUpdateField}
        id={EMAIL}
        label={EMAIL}
        placeholder=""
        type="email"
        value={email}
      />
      <Input
        className="form-input title"
        error={errors[TITLE]}
        handleChange={handleUpdateField}
        id={TITLE}
        label={TITLE}
        placeholder=""
        value={title}
      />
      <Input
        characterLimit={10}
        className="form-input phone"
        error={errors[PHONE_NUMBER]}
        handleChange={handleUpdateField}
        id={PHONE_NUMBER}
        label={PHONE_NUMBER}
        placeholder=""
        type="tel"
        value={phoneNumber}
      />
    </React.Fragment>
  )
}

export default UpperFormFields;
