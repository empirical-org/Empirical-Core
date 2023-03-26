import * as React from 'react';

import LowerFormFields from './lowerFormFields';
import SchoolAndDistrictFields from './schoolAndDistrictFields';
import UpperFormFields from './upperFormFields';

import { COMMENTS, DISTRICT, DISTRICT_NOT_LISTED, EMAIL, FIRST_NAME, LAST_NAME, PHONE_NUMBER, SCHOOL, SCHOOL_NOT_LISTED, SCHOOL_OR_DISTRICT, SCHOOL_PREMIUM_ESTIMATE, STUDENT_PREMIUM_ESTIMATE, SUBMISSION_ERROR, TEACHER_PREMIUM_ESTIMATE, ZIPCODE } from '../../../../constants/salesForm';
import { DropdownObjectInterface, InputEvent } from '../../../Staff/interfaces/evidenceInterfaces';
import { getSchoolsAndDistricts, submitSalesForm, validateSalesForm } from '../../helpers/salesForms';

export const SalesForm = ({ type }) => {
  const [errors, setErrors] = React.useState<any>({});
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [zipcode, setZipcode] = React.useState<string>('');
  const [schoolPremiumEstimate, setSchoolPremiumEstimate] = React.useState<string>('');
  const [teacherPremiumEstimate, setTeacherPremiumEstimate] = React.useState<string>('');
  const [studentPremiumEstimate, setStudentPremiumEstimate] = React.useState<string>('');
  const [comments, setComments] = React.useState<string>('');
  const [schools, setSchools] = React.useState<any[]>([]);
  const [districts, setDistricts] = React.useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = React.useState<any>('');
  const [schoolSearchQuery, setSchoolSearchQuery] = React.useState<any>('');
  const [schoolNotListed, setSchoolNotListed] = React.useState<boolean>(false);
  const [selectedDistrict, setSelectedDistrict] = React.useState<any>('');
  const [districtSearchQuery, setDistrictSearchQuery] = React.useState<any>('');
  const [districtNotListed, setDistrictNotListed] = React.useState<boolean>(false);
  const [schoolOrDistrict, setSchoolOrDistrict] = React.useState<any>('');
  const [showSubmissionConfirmation, setShowSubmissionConfirmation] = React.useState(false)

  React.useEffect(() => {
    getSchoolsAndDistricts('school', schoolSearchQuery).then((response) => {
      if(response && response.options) {
        setSchools(response.options);
      }
    });
  }, [schoolSearchQuery]);

  React.useEffect(() => {
    getSchoolsAndDistricts('district', districtSearchQuery).then((response) => {
      if(response && response.options) {
        setDistricts(response.options);
      }
    });
  }, [districtSearchQuery]);

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
  const buttonClass = "submit-button quill-button contained primary medium focus-on-light";

  function handleUpdateField(e: InputEvent | React.ChangeEvent<HTMLTextAreaElement>) {
    const { target } = e;
    const { value, id } = target;
    const setterFunction = stateSetters[id];
    if(id === SCHOOL_OR_DISTRICT) {
      // reset to displaying search inputs in case user changes from school to district option (and vice versa)
      setSchoolNotListed(false);
      setDistrictNotListed(false);
    }
    setterFunction(value);
  }

  function handleSchoolSearchTextChange(value: string) {
    setSchoolSearchQuery(value);
  }

  function handleDistrictSearchTextChange(value: string) {
    setDistrictSearchQuery(value);
  }


  function handleSchoolSearchSelectionChange(option: DropdownObjectInterface) {
    if(option.value === SCHOOL_NOT_LISTED) {
      setSchoolNotListed(true);
      setSelectedSchool('');
    } else {
      setSelectedSchool(option);
    }
  };

  function handleDistrictSearchSelectionChange(option: DropdownObjectInterface) {
    if(option.value === DISTRICT_NOT_LISTED) {
      setDistrictNotListed(true);
      setSelectedDistrict('');
    } else {
      setSelectedDistrict(option);
    }
  };

  function handleFormSubmission(e: React.MouseEvent) {
    e.preventDefault();
    const salesFormSubmission = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      zipcode: zipcode,
      collection_type: schoolOrDistrict.toLowerCase(),
      school_name: selectedSchool && selectedSchool.value ? selectedSchool.value : selectedSchool,
      district_name: selectedDistrict && selectedDistrict.value ? selectedDistrict.value : selectedDistrict,
      school_premium_count_estimate: parseInt(schoolPremiumEstimate),
      teacher_premium_count_estimate: parseInt(teacherPremiumEstimate),
      student_premium_count_estimate: parseInt(studentPremiumEstimate),
      submission_type: type,
      comment: comments
    }
    const formErrors = validateSalesForm({ salesFormSubmission, schoolIsSelected, districtIsSelected });
    if(Object.keys(formErrors).length) {
      setErrors(formErrors)
    } else {
      setErrors({});
      submitSalesForm(salesFormSubmission).then(response => {
        if(response.error) {
          const submissionError = { [SUBMISSION_ERROR]: response.error };
          setErrors(submissionError)
        } else {
          setShowSubmissionConfirmation(true);
          window.scrollTo(0, 0);
        }
      });
    }
  }

  function handleClick() {
    window.location.href = `${process.env.DEFAULT_URL}/premium`;
  }

  function renderForm() {
    return(
      <form className="container">
        <UpperFormFields
          email={email}
          errors={errors}
          firstName={firstName}
          handleUpdateField={handleUpdateField}
          lastName={lastName}
          phoneNumber={phoneNumber}
          type={type}
          zipcode={zipcode}
        />
        <SchoolAndDistrictFields
          districtIsSelected={districtIsSelected}
          districtNotListed={districtNotListed}
          districts={districts}
          errors={errors}
          handleDistrictSearchSelectionChange={handleDistrictSearchSelectionChange}
          handleDistrictSearchTextChange={handleDistrictSearchTextChange}
          handleSchoolSearchSelectionChange={handleSchoolSearchSelectionChange}
          handleSchoolSearchTextChange={handleSchoolSearchTextChange}
          handleUpdateField={handleUpdateField}
          schoolIsSelected={schoolIsSelected}
          schoolNotListed={schoolNotListed}
          schools={schools}
          selectedDistrict={selectedDistrict}
          selectedSchool={selectedSchool}
        />
        <LowerFormFields
          comments={comments}
          errors={errors}
          handleUpdateField={handleUpdateField}
          schoolPremiumEstimate={schoolPremiumEstimate}
          studentPremiumEstimate={studentPremiumEstimate}
          teacherPremiumEstimate={teacherPremiumEstimate}
        />
        {errors[SUBMISSION_ERROR] && <p className="error-text">{errors[SUBMISSION_ERROR]}</p>}
        <button className={buttonClass} onClick={handleFormSubmission}>Submit</button>
      </form>
    );
  }

  function renderSuccessMessage() {
    return(
      <section className="container success-message-container">
        <h3>Thanks for contacting us!</h3>
        <p>A Quill team member will be in touch with you as soon as possible.</p>
        <button className={buttonClass} onClick={handleClick}>Done</button>
      </section>
    )
  }

  return(
    <div className="sales-form-container">
      {!showSubmissionConfirmation && renderForm()}
      {showSubmissionConfirmation && renderSuccessMessage()}
    </div>
  )
}

export default SalesForm
