import * as React from 'react';

import { EMAIL, FIRST_NAME, LAST_NAME, PHONE_NUMBER, ZIPCODE } from '../../../../constants/salesForm';
import { Input, titleCase } from '../../../Shared';

export const UpperFormFields = ({ type, errors, handleUpdateField, firstName, lastName, email, phoneNumber, zipcode }) => {

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
      <Input
        characterLimit={5}
        className="form-input zipcode"
        error={errors[ZIPCODE]}
        handleChange={handleUpdateField}
        id={ZIPCODE}
        label={ZIPCODE}
        placeholder=""
        value={zipcode}
      />
    </React.Fragment>
  )
}

export default UpperFormFields;
