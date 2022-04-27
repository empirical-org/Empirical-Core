import * as React from 'react';
import SelectSearch from 'react-select-search';

import { titleCase, Input } from '../../../Shared';
import { InputEvent } from '../../../Staff/interfaces/evidenceInterfaces';
import { getSchoolsAndDistricts, schoolSearch, districtSearch, SCHOOL_NOT_LISTED, DISTRICT_NOT_LISTED } from '../../helpers/salesForms';

const FIRST_NAME = 'First name';
const LAST_NAME = 'Last name';
const EMAIL = 'Email';
const PHONE_NUMBER = 'Phone number';
const ZIPCODE = 'Zipcode';
const SCHOOL_PREMIUM_ESTIMATE = 'Estimated number of schools that will receive Quill Premium';
const TEACHER_PREMIUM_ESTIMATE = 'Estimated number of teachers that will receive Quill Premium';
const STUDENT_PREMIUM_ESTIMATE = 'Estimated number of students that will receive Quill Premium';
const COMMENTS = 'Comments';
const SCHOOL = 'School';
const DISTRICT = 'District';
const SCHOOL_OR_DISTRICT = 'School or district';

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
  const [comments, setComments] = React.useState<string>('');
  const [schools, setSchools] = React.useState<any[]>([]);
  const [districts, setDistricts] = React.useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = React.useState<string>('');
  const [schoolNotListed, setSchoolNotListed] = React.useState<boolean>(false);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>('');
  const [districtNotListed, setDistrictNotListed] = React.useState<boolean>(false);
  const [schoolOrDistrict, setSchoolOrDistrict] = React.useState<any>('');

  React.useEffect(() => {
    if(!schools.length) {
      getSchoolsAndDistricts('school').then((response) => {
        if(response && response.options) {
          setSchools(response.options)
        }
      });
    }
    if(!districts.length) {
      getSchoolsAndDistricts('district').then((response) => {
        if(response && response.options) {
          setDistricts(response.options)
        }
      });
    }
  }, []);

  const stateSetters = {
    [FIRST_NAME]: setFirstName,
    [LAST_NAME]: setLastName,
    [EMAIL]: setEmail,
    [PHONE_NUMBER]: setPhoneNumber,
    [ZIPCODE]: setZipcode,
    [SCHOOL_PREMIUM_ESTIMATE]: setSchoolPremiumEstimate,
    [TEACHER_PREMIUM_ESTIMATE]: setTeacherPremiumEstimate,
    [STUDENT_PREMIUM_ESTIMATE]: setStudentPremiumEstimate,
    [COMMENTS]: setComments,
    [SCHOOL]: setSelectedSchool,
    [DISTRICT]: setSelectedDistrict,
    [SCHOOL_OR_DISTRICT]: setSchoolOrDistrict
  }
  const schoolIsSelected = schoolOrDistrict === SCHOOL;
  const districtIsSelected = schoolOrDistrict === DISTRICT;

  function handleUpdateField(e: InputEvent | React.ChangeEvent<HTMLTextAreaElement>) {
    const { target } = e;
    const { value, id } = target;
    const setterFunction = stateSetters[id];
    setterFunction(value);
  }

  function handleSchoolSearchChange(value) {
    if(value === SCHOOL_NOT_LISTED) {
      setSchoolNotListed(true);
      setSelectedSchool('');
    } else {
      setSelectedSchool(value);
    }
  };

  function handleDistrictSearchChange(value) {
    if(value === DISTRICT_NOT_LISTED) {
      setDistrictNotListed(true);
      setSelectedDistrict('');
    } else {
      setSelectedDistrict(value);
    }
  };

  function renderSchoolOrDistrictSelect() {
    if(schoolIsSelected && !schoolNotListed) {
      return(
        <div>
          <SelectSearch
            filterOptions={schoolSearch}
            onChange={handleSchoolSearchChange}
            options={schools}
            placeholder="Search for your school"
            search={true}
          />
        </div>
      );
    }
    if(schoolNotListed) {
      return(
        <Input
          className="school"
          handleChange={handleUpdateField}
          id={SCHOOL}
          label={SCHOOL}
          placeholder=""
          value={selectedSchool}
        />
      );
    }
    if(districtIsSelected && !districtNotListed) {
      return(
        <div>
          <SelectSearch
            filterOptions={districtSearch}
            onChange={handleDistrictSearchChange}
            options={districts}
            placeholder="Search for your district"
            search={true}
          />
        </div>
      );
    }
    if(districtNotListed) {
      return(
        <Input
          className="district"
          handleChange={handleUpdateField}
          id={DISTRICT}
          label={DISTRICT}
          placeholder=""
          value={selectedDistrict}
        />
      );
    }
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
        <div>
          <p>Do you represent a school or district?</p>
          <div className="radio-options">
            <div className="radio">
              <label htmlFor={SCHOOL}>
                <input checked={schoolIsSelected} id={SCHOOL_OR_DISTRICT} onChange={handleUpdateField} type="radio" value={SCHOOL} />
                {SCHOOL}
              </label>
            </div>
            <div className="radio">
              <label htmlFor={DISTRICT}>
                <input checked={districtIsSelected} id={SCHOOL_OR_DISTRICT} onChange={handleUpdateField} type="radio" value={DISTRICT} />
                {DISTRICT}
              </label>
            </div>
          </div>
        </div>
        {renderSchoolOrDistrictSelect()}
        <Input
          className="school-premium-estimate"
          error={errors[SCHOOL_PREMIUM_ESTIMATE]}
          handleChange={handleUpdateField}
          id={SCHOOL_PREMIUM_ESTIMATE}
          label={SCHOOL_PREMIUM_ESTIMATE}
          placeholder=""
          value={schoolPremimumEstimate}
        />
        <Input
          className="teacher-premium-estimate"
          error={errors[TEACHER_PREMIUM_ESTIMATE]}
          handleChange={handleUpdateField}
          id={TEACHER_PREMIUM_ESTIMATE}
          label={TEACHER_PREMIUM_ESTIMATE}
          placeholder=""
          value={teacherPremimumEstimate}
        />
        <Input
          className="student-premium-estimate"
          error={errors[STUDENT_PREMIUM_ESTIMATE]}
          handleChange={handleUpdateField}
          id={STUDENT_PREMIUM_ESTIMATE}
          label={STUDENT_PREMIUM_ESTIMATE}
          placeholder=""
          value={studentPremimumEstimate}
        />
        <div className="control">
          <label className="label" htmlFor={COMMENTS} id="comments-label">Comments (optional)</label>
          <textarea
            aria-labelledby="comments-label"
            id={COMMENTS}
            onChange={handleUpdateField}
            style={{minHeight: '100px', border: '1px solid black', padding: '10px', width: '100%'}}
            value={comments}
          />
        </div>
      </form>
    </div>
  )
}

export default SalesForm
