import * as React from 'react';

import { renderSchoolAndDistrictSelect } from '../../helpers/salesForms';
import { SCHOOL, DISTRICT, SCHOOL_OR_DISTRICT, COLLECTION_TYPE } from '../../../../constants/salesForm';

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
  handleSchoolSearchChange,
  handleDistrictSearchChange
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
      {renderSchoolAndDistrictSelect({
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
      })}
    </React.Fragment>
  )
}

export default SchoolAndDistrictFields
