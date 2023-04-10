import React from 'react';

import ConceptSelector from './conceptSelector.jsx';

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
        <h3><input aria-label="Correct?" checked={checked} onClick={onCheckboxChange} type="checkbox" /> Correct?</h3>
      </label>

      <button className="interactive-wrapper focus-on-light" onClick={deleteConceptResult} style={{paddingLeft: '10px', paddingTop: '6px', cursor:'pointer'}} type="button">X</button>
    </div>
  );
};

export default ConceptSelectorWithCheckbox;
