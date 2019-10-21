import React from 'react';
import { Input } from 'quill-component-library/dist/componentLibrary'

const NameTheUnit = ({ nameError, unitName, updateUnitName, timesSubmitted, }) => {
  return (
    <div className="assignment-section">
      <div className="assignment-section-header">
        <span className="assignment-section-number">1</span>
        <span className="assignment-section-name">Name the assignment</span>
      </div>
      <div className="assignment-section-body">
        <Input
          error={nameError}
          error={nameError}
          handleChange={updateUnitName}
          label="Activity pack name"
          timesSubmitted={timesSubmitted}
          type="text"
        />
      </div>
    </div>
  )
}

export default NameTheUnit
