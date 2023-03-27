import * as React from 'react';

import SchoolOrDistrictSelection from './schoolAndDistrictSelection';

import { COLLECTION_TYPE, DISTRICT, SCHOOL, SCHOOL_OR_DISTRICT } from '../../../../constants/salesForm';

export const SchoolAndDistrictFields = ({
  errors,
  schoolIsSelected,
  districtIsSelected,
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
  return(
    <React.Fragment>
      <div className="school-or-district-container">
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
        {errors[COLLECTION_TYPE] && <p className="error-text">{errors[COLLECTION_TYPE]}</p>}
      </div>
      <SchoolOrDistrictSelection
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
    </React.Fragment>
  )
}

export default SchoolAndDistrictFields
