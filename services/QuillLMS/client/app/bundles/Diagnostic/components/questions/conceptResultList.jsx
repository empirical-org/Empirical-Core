import React from 'react'
import _ from 'underscore'
import ConceptSelectorWithCheckbox from '../shared/conceptSelectorWithCheckbox.jsx'

export default class conceptResultList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      conceptResults: {}
    }
  }

  handleConceptChange = e => {
    const newConceptResults = Object.assign({}, this.state.conceptResults)
    newConceptResults[e.value] ? null : newConceptResults[e.value] = false
    this.setState({conceptResults: newConceptResults}, () => this.props.updateConceptResults(this.state.conceptResults))
  };

  toggleConceptResultCorrect(key) {
    const newConceptResults = Object.assign({}, this.state.conceptResults)
    newConceptResults[key] = !newConceptResults[key]
    this.setState({conceptResults: newConceptResults}, () => this.props.updateConceptResults(this.state.conceptResults))
  }

  deleteConceptResult(key) {
    const newConceptResults = Object.assign({}, this.state.conceptResults)
    delete newConceptResults[key]
    this.setState({conceptResults: newConceptResults}, () => this.props.updateConceptResults(this.state.conceptResults))
  }

  renderConceptResults() {
    const mapped = Object.assign({}, this.state.conceptResults, { null: false })
    const components = _.mapObject(mapped, (val, key) => (
      <ConceptSelectorWithCheckbox
        checked={val}
        currentConceptUID={key}
        deleteConceptResult={() => this.deleteConceptResult(key)}
        handleSelectorChange={this.handleConceptChange}
        onCheckboxChange={() => this.toggleConceptResultCorrect(key)}
        selectorDisabled={key === 'null' ? false : true}
      />
    ));
    return _.values(components);
  }

  render() {
    return (
      <div>{this.renderConceptResults()}</div>
    )
  }
}
