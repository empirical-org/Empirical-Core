import React from 'react';
import { Input } from 'quill-component-library/dist/componentLibrary'

const NameTheUnit = (props) => {
  const { nameError, unitName, updateUnitName, } = props
  return (
    <div className="assignment-section">
      <div className="assignment-section-header">
        <span className="assignment-section-number">1</span>
        <span className="assignment-section-name">Name the assignment</span>
      </div>
      <div className="assignment-section-body">
        <Input
          label="Activity pack name"
          value={unitName}
          handleChange={updateUnitName}
          type="text"
          error={nameError}
        />
      </div>
    </div>
  )
}

export default NameTheUnit
