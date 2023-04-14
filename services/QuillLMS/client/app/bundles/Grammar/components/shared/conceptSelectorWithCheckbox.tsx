import * as React from 'react';
import { connect } from 'react-redux';

import ConceptSelector from './conceptSelector';

import { ConceptExplanation } from '../../../Shared/index';

interface ConceptSelectorWithCheckboxProps {
  handleSelectorChange: Function;
  currentConceptUID: string;
  selectorDisabled: boolean;
  checked: boolean;
  onCheckboxChange: Function;
  deleteConceptResult: Function;
}

class ConceptSelectorWithCheckbox extends React.Component {

  currentConcept = () => {
    const { concepts, currentConceptUID } = this.props
    if (!concepts.data["0"]) { return }
    return concepts.data["0"].find(concept => concept.uid === currentConceptUID)
  }

  renderConceptFeedback = () => {
    const { currentConceptUID, conceptsFeedback } = this.props
    if (currentConceptUID && currentConceptUID.length > 0 && this.currentConcept()) {
      return (<ConceptExplanation {...conceptsFeedback.data[currentConceptUID]} />)
    }
  }

  render() {
    const { currentConceptUID, handleSelectorChange, selectorDisabled, checked, onCheckboxChange, deleteConceptResult } = this.props
    return(
      <div style={{marginBottom: 5, width: '80%'}}>
        <div style={{display: 'flex'}}>
          <div style={{flexGrow: 1}}>
            <ConceptSelector
              currentConceptUID={currentConceptUID}
              handleSelectorChange={handleSelectorChange}
              selectorDisabled={selectorDisabled}
            />
          </div>
          <label className="checkbox" style={{lineHeight: '32px', marginLeft: '5px'}}>
            <h3><input aria-label="Correct?" checked={checked} onClick={onCheckboxChange} type="checkbox" /> Correct?</h3>
          </label>

          <button className="interactive-wrapper focus-on-light" onClick={deleteConceptResult} style={{paddingLeft: '10px', paddingTop: '6px', cursor: 'pointer'}} type="button">X</button>
        </div>
        {this.renderConceptFeedback()}
      </div>
    )
  }
}

function select(props) {
  return {
    concepts: props.concepts,
    conceptsFeedback: props.conceptsFeedback
  };
}

export default connect(select)(ConceptSelectorWithCheckbox);
