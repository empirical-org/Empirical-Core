import * as React from 'react'
import ConceptSelectorWithCheckbox from '../shared/conceptSelectorWithCheckbox'
import * as  _ from 'underscore'

interface ConceptResultListProps {
  updateConceptResults: Function
}

interface ConceptResultListState {
  conceptResults: { [key: string]: boolean}
}

export default class ConceptResultList extends React.Component<ConceptResultListProps, ConceptResultListState> {
  constructor(props: ConceptResultListProps) {
    super(props)
    this.state = {
      conceptResults: {}
    }

    this.handleConceptChange = this.handleConceptChange.bind(this)
  }

  handleConceptChange(e: { value: string }) {
    const newConceptResults = Object.assign({}, this.state.conceptResults)
    if (!newConceptResults[e.value]) {
      newConceptResults[e.value] = false
    }
    this.setState({conceptResults: newConceptResults}, () => this.props.updateConceptResults(this.state.conceptResults))
  }

  toggleConceptResultCorrect(key: string) {
    const newConceptResults = Object.assign({}, this.state.conceptResults)
    newConceptResults[key] = !newConceptResults[key]
    this.setState({conceptResults: newConceptResults}, () => this.props.updateConceptResults(this.state.conceptResults))
  }

  deleteConceptResult(key: string) {
    const newConceptResults = Object.assign({}, this.state.conceptResults)
    delete newConceptResults[key]
    this.setState({conceptResults: newConceptResults}, () => this.props.updateConceptResults(this.state.conceptResults))
  }

  renderConceptResults() {
    const mapped = Object.assign({}, this.state.conceptResults, { null: false })
    const components = _.mapObject(mapped, (val: boolean, key: string) => (
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
