import * as React from 'react';

import { renderSchoolOrDistrictSelect } from '../../helpers/salesForms';
import { SCHOOL, DISTRICT, SCHOOL_OR_DISTRICT } from '../../../../constants/salesForm';

export const SchoolOrDistrictFields = ({
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
      {renderSchoolOrDistrictSelect({
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
      })}
    </React.Fragment>
  )
}

export default SchoolOrDistrictFields
