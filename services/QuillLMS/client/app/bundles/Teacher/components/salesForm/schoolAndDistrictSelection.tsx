import * as React from 'react';

import { SCHOOL, DISTRICT, SCHOOL_NOT_LISTED, DISTRICT_NOT_LISTED } from '../../../../constants/salesForm';
import { DropdownInput, Input, Spinner } from '../../../Shared';
import { customSearch } from '../../helpers/salesForms';

export const SchoolAndDistrictSelection = ({
  errors,
  schoolNotListed,
  districtNotListed,
  selectedSchool,
  selectedDistrict,
  schools,
  districts,
  handleUpdateField,
  handleSchoolSearchSelectionChange,
  handleSchoolSearchTextChange,
  handleDistrictSearchSelectionChange,
  handleDistrictSearchTextChange
}) => {
  const schoolInputLabel = selectedSchool ? SCHOOL : "Search for your school";
  const districtInputLabel = selectedDistrict ? DISTRICT : "Search for your district";
  const schoolOptions = [{ label: SCHOOL_NOT_LISTED, value: SCHOOL_NOT_LISTED}, ...schools];
  const districtOptions = [{ label: DISTRICT_NOT_LISTED, value: DISTRICT_NOT_LISTED}, ...districts];
  const schoolSearchInput = (
    <DropdownInput
      className="form-input"
      filterOptions={customSearch}
      handleChange={handleSchoolSearchSelectionChange}
      handleInputChange={handleSchoolSearchTextChange}
      isSearchable={true}
      label={schoolInputLabel}
      options={schoolOptions}
      value={selectedSchool}
    />
  );
  const districtSearchInput = (
    <DropdownInput
      className="form-input"
      filterOptions={customSearch}
      handleChange={handleDistrictSearchSelectionChange}
      handleInputChange={handleDistrictSearchTextChange}
      isSearchable={true}
      label={districtInputLabel}
      options={districtOptions}
      value={selectedDistrict}
    />
  );
  const schoolCustomInput = (
    <Input
      className="form-input school"
      handleChange={handleUpdateField}
      id={SCHOOL}
      label={SCHOOL}
      placeholder=""
      value={selectedSchool}
    />
  );
  const districtCustomInput = (
    <Input
      className="form-input district"
      handleChange={handleUpdateField}
      id={DISTRICT}
      label={DISTRICT}
      placeholder=""
      value={selectedDistrict}
    />
  );
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

export default SchoolAndDistrictSelection
