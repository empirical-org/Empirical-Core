import React from 'react'

import ConceptSelector from './conceptSelector.jsx'

const ConceptSelectorWithCheckbox = (
  {
    currentConceptUID,
    handleSelectorChange,
    selectorDisabled,
    checked,
    onCheckboxChange,
    deleteConceptResult,
  },
) => {
  return (
    <div style={{display: 'flex', marginBottom: 5}}>
      <div style={{flexGrow: 1}}>
        <ConceptSelector
          currentConceptUID={currentConceptUID}
          handleSelectorChange={handleSelectorChange}
          selectorDisabled={selectorDisabled}
        />
      </div>
      <label className="checkbox" style={{lineHeight: '32px'}}>
        <h3><input checked={checked} onClick={onCheckboxChange} type="checkbox" /> Correct?</h3>
      </label>

      <p onClick={deleteConceptResult} style={{paddingLeft: '10px', paddingTop: '6px', cursor:'pointer'}}>X</p>
    </div>
  );
};

export default ConceptSelectorWithCheckbox;
