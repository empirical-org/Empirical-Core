import * as React from 'react'

const UnitTemplateProfileDescription = ({ data }) => {
  return <div className="unit-template-profile-description" dangerouslySetInnerHTML={{ __html: data.activity_info, }} />
};

export default UnitTemplateProfileDescription;
