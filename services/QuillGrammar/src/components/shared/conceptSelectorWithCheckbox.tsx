import * as React from 'react'
import { connect } from 'react-redux';
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary';
import ConceptSelector from './conceptSelector'

interface ConceptSelectorWithCheckboxProps {
  handleSelectorChange: Function;
  currentConceptUID: string;
  selectorDisabled: boolean;
  checked: boolean;
  onCheckboxChange: Function;
  deleteConceptResult: Function;
}
//tets
class ConceptSelectorWithCheckbox extends React.Component {

  constructor(props: ConceptSelectorWithCheckboxProps) {
    super(props)

    this.currentConcept = this.currentConcept.bind(this)
    this.renderConceptFeedback = this.renderConceptFeedback.bind(this)
  }

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

          <p onClick={deleteConceptResult} style={{paddingLeft: '10px', paddingTop: '6px', cursor: 'pointer'}}>X</p>
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