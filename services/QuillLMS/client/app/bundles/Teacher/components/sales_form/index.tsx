import * as React from 'react';

import { titleCase, Input } from '../../../Shared';
import { InputEvent } from '../../../Staff/interfaces/evidenceInterfaces';

const FIRST_NAME = 'First name';
const LAST_NAME = 'Last name';
const EMAIL = 'Email';
const PHONE_NUMBER = 'Phone number';
const ZIPCODE = 'Zipcode';
const SCHOOL_PREMIUM_ESTIMATE = 'School premium estimate';
const TEACHER_PREMIUM_ESTIMATE = 'Teacher premium estimate';
const STUDENT_PREMIUM_ESTIMATE = 'Student premium estimate';

export const SalesForm = ({ type }) => {
  const [errors, setErrors] = React.useState<string>('');
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [zipcode, setZipcode] = React.useState<string>('');
  const [schoolPremimumEstimate, setSchoolPremiumEstimate] = React.useState<string>('');
  const [teacherPremimumEstimate, setTeacherPremiumEstimate] = React.useState<string>('');
  const [studentPremimumEstimate, setStudentPremiumEstimate] = React.useState<string>('');

  const stateSetters = {
    [FIRST_NAME]: setFirstName,
    [LAST_NAME]: setLastName,
    [EMAIL]: setEmail,
    [PHONE_NUMBER]: setPhoneNumber,
    [ZIPCODE]: setZipcode,
    [SCHOOL_PREMIUM_ESTIMATE]: setSchoolPremiumEstimate,
    [TEACHER_PREMIUM_ESTIMATE]: setTeacherPremiumEstimate,
    [STUDENT_PREMIUM_ESTIMATE]: setStudentPremiumEstimate,
  }

  function handleUpdateField(e: InputEvent) {
    const { target } = e;
    const { value, id } = target;
    const setterFunction = stateSetters[id];
    setterFunction(value);
  }

  return(
    <div className="container">
      <h3>{`${titleCase(type)} form`}</h3>
      <form>
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
          error={errors[FIRST_NAME]}
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
        <Input
          className="school-premium-estimate"
          error={errors[SCHOOL_PREMIUM_ESTIMATE]}
          handleChange={handleUpdateField}
          id={SCHOOL_PREMIUM_ESTIMATE}
          label={SCHOOL_PREMIUM_ESTIMATE}
          placeholder="This is the estimated number of school premium accounts."
          value={schoolPremimumEstimate}
        />
        <Input
          className="teacher-premium-estimate"
          error={errors[TEACHER_PREMIUM_ESTIMATE]}
          handleChange={handleUpdateField}
          id={TEACHER_PREMIUM_ESTIMATE}
          label={TEACHER_PREMIUM_ESTIMATE}
          placeholder="This is the estimated number of teacher premium accounts."
          value={teacherPremimumEstimate}
        />
        <Input
          className="student-premium-estimate"
          error={errors[STUDENT_PREMIUM_ESTIMATE]}
          handleChange={handleUpdateField}
          id={STUDENT_PREMIUM_ESTIMATE}
          label={STUDENT_PREMIUM_ESTIMATE}
          placeholder="This is the estimated number of student premium accounts."
          value={studentPremimumEstimate}
        />
      </form>
    </div>
  )
}

export default SalesForm
