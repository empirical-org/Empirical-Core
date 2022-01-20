'use strict'

import React from 'react'

const UnitTemplateProfileDescription = (
  {
    data,
  },
) => {
  return <div dangerouslySetInnerHTML={{ __html: data.activity_info, }} />
};

export default UnitTemplateProfileDescription;
