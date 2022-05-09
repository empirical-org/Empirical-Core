import * as React from 'react';

import { requestFailed } from "../../Staff/helpers/evidence/routingHelpers";
import { PROPERTIES, NUMERICAL_PROPERTIES, PROPERTY_LABELS } from '../../../constants/salesForm';

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

export const getSchoolsAndDistricts = async (type: string, searchQuery: string) => {
  const url = `/options_for_sales_form?type=${type}&search=${searchQuery}`;
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
