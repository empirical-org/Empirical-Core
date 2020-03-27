import React from 'react'
import { connect } from 'react-redux';
import ConceptSelector from './conceptSelector.jsx'
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary';

class ConceptSelectorWithCheckbox extends React.Component {

  currentConcept () {
    const { concepts, currentConceptUID } = this.props
    return _.find(concepts.data["0"], {uid: currentConceptUID})
  }

  renderConceptFeedback() {
    const { currentConceptUID, conceptsFeedback } = this.props
    if (currentConceptUID && currentConceptUID.length > 0 && this.currentConcept()) {
      return (<ConceptExplanation {...conceptsFeedback.data[currentConceptUID]} />)
    } else {
      return;
    }
  }

  render() {
    return(
      <div style={{marginBottom: 5, width: '80%'}}>
        <div style={{display: 'flex'}}>
          <div style={{flexGrow: 1}}>
            <ConceptSelector
              currentConceptUID={this.props.currentConceptUID}
              handleSelectorChange={this.props.handleSelectorChange}
              selectorDisabled={this.props.selectorDisabled}
            />
          </div>
          <label className="checkbox" style={{lineHeight: '32px', marginLeft: '5px'}}>
            <h3><input checked={this.props.checked} onClick={this.props.onCheckboxChange} type="checkbox" /> Correct?</h3>
          </label>

          <p onClick={this.props.deleteConceptResult} style={{paddingLeft: '10px', paddingTop: '6px', cursor:'pointer'}}>X</p>
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
