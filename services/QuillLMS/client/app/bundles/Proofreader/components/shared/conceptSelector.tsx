import * as React from 'react';
import { connect } from 'react-redux';
// import Select from 'react-select-search'
import Select from 'react-select';
import { Concept } from '../../interfaces/concepts';
import { ConceptsFeedbackState } from '../../reducers/conceptsFeedbackReducer';
import { ConceptReducerState } from '../../reducers/conceptsReducer';

// TODO: delete everywhere else that we use conceptsToOptions

interface ConceptSelectorProps {
  concepts: ConceptReducerState;
  conceptsFeedback: ConceptsFeedbackState;
  onlyShowConceptsWithConceptFeedback?: boolean;
  currentConceptUID: string;
  selectorDisabled?: boolean;
  handleSelectorChange: Function;
}

class ConceptSelector extends React.Component<ConceptSelectorProps> {
  constructor(props: ConceptSelectorProps) {
    super(props)

    this.conceptsToOptions = this.conceptsToOptions.bind(this)
    this.currentConcept = this.currentConcept.bind(this)
    this.placeholder = this.placeholder.bind(this)
    this.handleSelectorChange = this.handleSelectorChange.bind(this)
  }

  conceptsToOptions() {
    let concepts = this.props.concepts.data[0];
    if (this.props.onlyShowConceptsWithConceptFeedback) {
      concepts = concepts.filter((concept: Concept) => {
        return Object.keys(this.props.conceptsFeedback.data).includes(concept.uid);
      });
    }
    return concepts.sort((a, b) => a.displayName.localeCompare(b.displayName)).map(concept => {
      return (
        {label: concept.displayName, value: concept.uid, shortenedName: concept.name}
      )
    })
  }

  currentConcept() {
    return this.props.concepts.data[0].find(c => c.uid === this.props.currentConceptUID)
  }

  placeholder() {
    const currentConcept = this.currentConcept()
    if (this.props.currentConceptUID && this.props.currentConceptUID.length > 0 && currentConcept) {
      return currentConcept.displayName
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
        onChange={this.handleSelectorChange}
        options={this.conceptsToOptions()}
        placeholder={this.placeholder()}
        style={{display: 'block'}}
      />
    )
  }
}

function select(state) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback
  }
}

export default connect(select)(ConceptSelector)
