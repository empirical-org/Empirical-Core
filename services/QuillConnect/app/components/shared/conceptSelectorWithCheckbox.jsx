import React from 'react'
import { connect } from 'react-redux';
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary';
import ConceptSelector from './conceptSelector.jsx'

class ConceptSelectorWithCheckbox extends React.Component {

  currentConcept () {
    const { concepts, currentConceptUID } = this.props
    return concepts.data["0"].find(concept => concept.uid === currentConceptUID)
  }

  renderConceptFeedback() {
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
            <h3><input checked={checked} onClick={onCheckboxChange} type="checkbox" /> Correct?</h3>
          </label>

          <p onClick={deleteConceptResult} style={{paddingLeft: '10px', paddingTop: '6px', cursor:'pointer'}}>X</p>
        </div>
        {this.renderConceptFeedback()}
      </div>
    );
  }

}

function select(props) {
  return {
    concepts: props.concepts,
    conceptsFeedback: props.conceptsFeedback
  };
}

export default connect(select)(ConceptSelectorWithCheckbox);
