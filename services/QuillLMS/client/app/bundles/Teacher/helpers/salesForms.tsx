import * as React from 'react';

import { DropdownInput, Input, Spinner } from '../../Shared';
import { requestFailed } from "../../Staff/helpers/evidence/routingHelpers";
import { SCHOOL, DISTRICT, SCHOOL_NOT_LISTED, DISTRICT_NOT_LISTED, PROPERTIES, NUMERICAL_PROPERTIES, PROPERTY_LABELS } from '../../../constants/salesForm';

interface SalesFormSubmission {
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  zipcode: string,
  collection_type: string,
  school_name: string,
  district_name: string,
  school_premium_count_estimate: number,
  teacher_premium_count_estimate: number,
  student_premium_count_estimate: number,
  submission_type: string,
  comment?: string
}

const fetchDefaults = require("fetch-defaults");
const baseUrl = process.env.DEFAULT_URL;
const headerHash = {
  headers: {
    "Accept": "application/JSON",
    "Content-Type": "application/json"
  }
};
const apiFetch = fetchDefaults(fetch, baseUrl, headerHash);

export const getSchoolsAndDistricts = async (type: string) => {
  const url = `/options_for_sales_form?type=${type}`;
  const response = await apiFetch(url);
  const { status } = response;

  if(requestFailed(status)) {
    return { error: 'Failed to fetch school and districts. Please refresh the page.' };
  } else {
    const schoolOrDistrictOptions = await response.json();
    const { options } = schoolOrDistrictOptions;
    const formattedOptions = options.map((option: string) => ({ label: option, value: option }));
    return { options: formattedOptions };
  }
}

export const submitSalesForm = async (salesFormSubmission: SalesFormSubmission) => {
  const response = await apiFetch('/submit_sales_form', {
    method: 'POST',
    body: JSON.stringify({ sales_form_submission: salesFormSubmission })
  });
  const { status } = response;

  if(requestFailed(status)) {
    return { error: 'Failed to submit form. Please try again.' };
  } else {
    return { success: true };
  }
}

export const customSearch = (
  candidate: { label: string; value: string; data: any },
  input: string,
  options: { label: string; value: string }[]
) => {
  if (input) {
    const lowerCaseValue = candidate.value.toLowerCase();
    const lowerCaseInput = input.toLowerCase();
    return lowerCaseValue.includes(lowerCaseInput) || candidate.value === options[0].value;
  }
  return true;
};

export const renderSchoolAndDistrictSelect = ({
  errors,
  schoolNotListed,
  districtNotListed,
  selectedSchool,
  selectedDistrict,
  schools,
  districts,
  handleUpdateField,
  handleSchoolSearchChange,
  handleDistrictSearchChange
}) => {
  const schoolInputLabel = selectedSchool ? SCHOOL : "Search for your school";
  const districtInputLabel = selectedDistrict ? DISTRICT : "Search for your district";
  const schoolOptions = [{ label: SCHOOL_NOT_LISTED, value: SCHOOL_NOT_LISTED}, ...schools];
  const districtOptions = [{ label: DISTRICT_NOT_LISTED, value: DISTRICT_NOT_LISTED}, ...schools];
  const schoolSearchInput = (
    <DropdownInput
      className="form-input"
      filterOptions={customSearch}
      handleChange={handleSchoolSearchChange}
      label={schoolInputLabel}
      isSearchable={true}
      options={schoolOptions}
      value={selectedSchool}
    />
  );
  const districtSearchInput = (
    <DropdownInput
      className="form-input"
      filterOptions={customSearch}
      handleChange={handleDistrictSearchChange}
      label={districtInputLabel}
      isSearchable={true}
      options={districtOptions}
      value={selectedDistrict}
    />
  );
  const schoolCustomInput = (
    <Input
      className="school"
      handleChange={handleUpdateField}
      id={SCHOOL}
      label={SCHOOL}
      placeholder=""
      value={selectedSchool}
    />
  );
  const districtCustomInput = (
    <Input
      className="district"
      handleChange={handleUpdateField}
      id={DISTRICT}
      label={DISTRICT}
      placeholder=""
      value={selectedDistrict}
    />
  );
  if(!schools.length || !districts.length) {
    return(
      <div className="loading-options-container">
        <p>Loading school and district options...</p>
        <Spinner />
      </div>
    );
  }
  return(
    <div>
      {!schoolNotListed && schoolSearchInput}
      {schoolNotListed && schoolCustomInput}
      {!districtNotListed && districtSearchInput}
      {districtNotListed && districtCustomInput}
      {errors[SCHOOL] && <p className="error-text">{errors[SCHOOL]}</p>}
      {errors[DISTRICT] && <p className="error-text">{errors[DISTRICT]}</p>}
    </div>
  );
}

export const validateSalesForm = (submission: SalesFormSubmission) => {
  let errors = {};
  PROPERTIES.map((property, i) => {
    const value = submission[property];
    const inputType = PROPERTY_LABELS[i];
    if(NUMERICAL_PROPERTIES.includes(property) && isNaN(value)) {
      errors[inputType] = `${inputType} must be a number.`
    } else if(!value) {
      errors[inputType] = `${inputType} cannot be blank.`
    }
  });
  return errors;
}
