import * as React from 'react'
import ConceptSelector from './conceptSelector'

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
        handleSelectorChange={props.handleSelectorChange}
        currentConceptUID={props.currentConceptUID}
        selectorDisabled={props.selectorDisabled}
      />
    </div>
    <label className="checkbox" style={{lineHeight: '32px'}}>
      <h3><input checked={props.checked} type="checkbox" onClick={props.onCheckboxChange} /> Correct?</h3>
    </label>

    <p style={{paddingLeft: '10px', paddingTop: '6px', cursor:'pointer'}} onClick={props.deleteConceptResult}>X</p>
  </div>
)

export default ConceptSelectorWithCheckbox;
