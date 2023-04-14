import * as React from 'react';
import ConceptSelector from './conceptSelector';

interface ConceptSelectorWithCheckboxProps {
  handleSelectorChange: Function;
  currentConceptUID: string;
  selectorDisabled: boolean;
  checked: boolean;
  onCheckboxChange: Function;
  deleteConceptResult: Function;
}

const ConceptSelectorWithCheckbox = (props: ConceptSelectorWithCheckboxProps) => (
  <div style={{display: 'flex', marginBottom: 5}}>
    <div style={{flexGrow: 1}}>
      <ConceptSelector
        currentConceptUID={props.currentConceptUID}
        handleSelectorChange={props.handleSelectorChange}
        selectorDisabled={props.selectorDisabled}
      />
    </div>
    <label className="checkbox" style={{lineHeight: '32px'}}>
      <h3><input checked={props.checked} onClick={props.onCheckboxChange} type="checkbox" /> Correct?</h3>
    </label>

    <button className="interactive-wrapper focus-on-light" onClick={props.deleteConceptResult} style={{paddingLeft: '10px', paddingTop: '6px', cursor: 'pointer'}} type="button">X</button>
  </div>
)

export default ConceptSelectorWithCheckbox;
