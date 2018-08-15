import * as React from 'react'
import ConceptSelector from './conceptSelector'

class ConceptSelectorWithCheckbox extends React.Component {

  render() {
    return(
      <div style={{display: 'flex', marginBottom: 5}}>
        <div style={{flexGrow: 1}}>
          <ConceptSelector
            handleSelectorChange={this.props.handleSelectorChange}
            currentConceptUID={this.props.currentConceptUID}
            selectorDisabled={this.props.selectorDisabled}
          />
        </div>
        <label className="checkbox" style={{lineHeight: '32px'}}>
          <h3><input checked={this.props.checked} type="checkbox" onClick={this.props.onCheckboxChange} /> Correct?</h3>
        </label>

        <p style={{paddingLeft: '10px', paddingTop: '6px', cursor:'pointer'}} onClick={this.props.deleteConceptResult}>X</p>
      </div>
    );
  }

}

export default ConceptSelectorWithCheckbox;
