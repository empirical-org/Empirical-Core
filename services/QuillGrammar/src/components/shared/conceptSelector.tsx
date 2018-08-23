import * as React from 'react'
import { connect } from 'react-redux'
// import Select from 'react-select-search'
import Select from 'react-select';

// TODO: delete everywhere else that we use conceptsToOptions

class ConceptSelector extends React.Component {
  constructor(props) {
    super(props)

    this.conceptsToOptions = this.conceptsToOptions.bind(this)
    this.currentConcept = this.currentConcept.bind(this)
    this.placeholder = this.placeholder.bind(this)
    this.handleSelectorChange = this.handleSelectorChange.bind(this)
  }

  conceptsToOptions () {
    let concepts = this.props.concepts.data["0"];
    if(this.props.onlyShowConceptsWithConceptFeedback) {
      concepts = concepts.filter((concept) => {
        return Object.keys(this.props.conceptsFeedback.data).includes(concept.uid);
      });
    }
    return concepts.sort((a, b) => a.displayName.localeCompare(b.displayName)).map(concept =>{
      return (
        {label: concept.displayName, value: concept.uid, shortenedName: concept.name}
      )
    })
  }

  currentConcept () {
    return this.props.concepts.data[0].find(c => c.uid === this.props.currentConceptUID)
  }

  placeholder () {
    if (this.props.currentConceptUID && this.props.currentConceptUID.length > 0 && this.currentConcept()) {
      return this.currentConcept().displayName
    } else {
      return 'Please select a concept.'
    }
  }

  handleSelectorChange(concept) {
    this.props.handleSelectorChange(concept)
  }

  render() {
    return (
      <Select
        disabled={this.props.selectorDisabled}
        options={this.conceptsToOptions()}
        placeholder={this.placeholder()}
        onChange={this.handleSelectorChange}
        style={{display: 'block'}}
      />
    )
  }
}

function select (state) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback
  }
}

export default connect(select)(ConceptSelector)
