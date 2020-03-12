import React from 'react'
import ConceptSelector from './conceptSelector.jsx'

class ConceptSelectorWithCheckbox extends React.Component {

  render() {
    return(
      <div style={{display: 'flex', marginBottom: 5}}>
        <div style={{flexGrow: 1}}>
          <ConceptSelector
            currentConceptUID={this.props.currentConceptUID}
            handleSelectorChange={this.props.handleSelectorChange}
            selectorDisabled={this.props.selectorDisabled}
          />
        </div>
        <label className="checkbox" style={{lineHeight: '32px'}}>
          <h3><input checked={this.props.checked} onClick={this.props.onCheckboxChange} type="checkbox" /> Correct?</h3>
        </label>

        <p onClick={this.props.deleteConceptResult} style={{paddingLeft: '10px', paddingTop: '6px', cursor:'pointer'}}>X</p>
      </div>
    );
  }

}

export default ConceptSelectorWithCheckbox;
