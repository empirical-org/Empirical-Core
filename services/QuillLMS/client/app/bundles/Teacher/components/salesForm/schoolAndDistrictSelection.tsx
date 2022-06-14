import * as React from 'react';

import { SCHOOL, DISTRICT, SCHOOL_NOT_LISTED, DISTRICT_NOT_LISTED } from '../../../../constants/salesForm';
import { DropdownInput, Input } from '../../../Shared';
import { customSearch } from '../../helpers/salesForms';

export const SchoolAndDistrictSelection = ({
  errors,
  districtIsSelected,
  districtNotListed,
  districts,
  handleDistrictSearchSelectionChange,
  handleDistrictSearchTextChange,
  handleSchoolSearchSelectionChange,
  handleSchoolSearchTextChange,
  handleUpdateField,
  schoolIsSelected,
  schoolNotListed,
  schools,
  selectedDistrict,
  selectedSchool
}) => {

  React.useEffect(() => {
    if(schoolNotListed) {
      const element = document.getElementById(SCHOOL)
      element.focus();
    }
    if(districtNotListed) {
      const element = document.getElementById(DISTRICT)
      element.focus();
    }
  }, [schoolNotListed, districtNotListed]);

  const schoolLabel = `${SCHOOL} name`;
  const districtLabel = `${DISTRICT} name`;
  const schoolInputLabel = selectedSchool ? schoolLabel : "Search for your school";
  const districtInputLabel = selectedDistrict ? districtLabel : "Search for your district";
  const schoolOptions = [{ label: SCHOOL_NOT_LISTED, value: SCHOOL_NOT_LISTED}, ...schools];
  const districtOptions = [{ label: DISTRICT_NOT_LISTED, value: DISTRICT_NOT_LISTED}, ...districts];

  const schoolSearchInput = (
    <DropdownInput
      className="form-input school-dropdown"
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
      className="form-input district-dropdown"
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
      label={schoolLabel}
      placeholder=""
      value={selectedSchool}
    />
  );
  const districtCustomInput = (
    <Input
      className="form-input district"
      handleChange={handleUpdateField}
      id={DISTRICT}
      label={districtLabel}
      placeholder=""
      value={selectedDistrict}
    />
  );
  return(
    <div>
      {schoolIsSelected && !schoolNotListed && schoolSearchInput}
      {schoolIsSelected && schoolNotListed && schoolCustomInput}
      {districtIsSelected && !districtNotListed && districtSearchInput}
      {districtIsSelected && districtNotListed && districtCustomInput}
      {errors[SCHOOL] && <p className="error-text">{errors[SCHOOL]}</p>}
      {errors[DISTRICT] && <p className="error-text">{errors[DISTRICT]}</p>}
    </div>
  );
}

export default SchoolAndDistrictSelection
