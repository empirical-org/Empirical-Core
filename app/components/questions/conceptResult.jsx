import React from 'react'
import ConceptSelector from '../shared/conceptSelector.jsx';

export default class conceptResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newMassEditConceptResultConceptUID: '',
      newMassEditConceptResultCorrect: false
    }
    this.selectMassEditConceptForResult = this.selectMassEditConceptForResult.bind(this)
    this.updateMassEditConceptResultCorrect = this.updateMassEditConceptResultCorrect.bind(this)
  }

  selectMassEditConceptForResult(e) {
    this.setState({ newMassEditConceptResultConceptUID: e.value, }, () => this.updateConceptResult());
  }

  updateMassEditConceptResultCorrect() {
    this.setState({ newMassEditConceptResultCorrect: this.refs.massEditConceptResultsCorrect.checked, }, () => this.updateConceptResult());
  }

  updateConceptResult() {
    this.props.updateConceptResult(this.state.newMassEditConceptResultConceptUID, this.state.newMassEditConceptResultCorrect)
  }

  render() {
    return (<div className="card-content">
      <div className="content">
        <h3>ADD CONCEPT RESULTS <span style={{ fontSize: '0.7em', marginLeft: '0.75em', }}>⚠️️ This concept result will be added to all selected responses ⚠️️</span></h3>
        <ConceptSelector currentConceptUID={this.state.newMassEditConceptResultConceptUID} handleSelectorChange={this.selectMassEditConceptForResult} />
        <br />
        <label className="checkbox">
          <h3><input ref="massEditConceptResultsCorrect" defaultChecked={false} type="checkbox" onChange={() => this.updateMassEditConceptResultCorrect()} /> CORRECT</h3>
        </label>
      </div>
    </div>)
  }
}
