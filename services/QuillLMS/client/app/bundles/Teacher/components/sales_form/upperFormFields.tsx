import * as React from 'react';

import { titleCase, Input } from '../../../Shared';
import { FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER, ZIPCODE } from '../../../../constants/salesForm';

export const UpperFormFields = ({ type, errors, handleUpdateField, firstName, lastName, email, phoneNumber, zipcode }) => {

  return(
    <React.Fragment>
      <h3>{`${titleCase(type)} form`}</h3>
      <Input
        className="first-name"
        error={errors[FIRST_NAME]}
        handleChange={handleUpdateField}
        id={FIRST_NAME}
        label={FIRST_NAME}
        placeholder=""
        value={firstName}
      />
      <Input
        className="last-name"
        error={errors[LAST_NAME]}
        handleChange={handleUpdateField}
        id={LAST_NAME}
        label={LAST_NAME}
        placeholder=""
        value={lastName}
      />
      <Input
        className="email"
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
        className="phone-number"
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
        className="zipcode"
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
