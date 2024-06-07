import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import _ from 'underscore';

const ConceptSelector = ({ concepts, conceptsFeedback, onlyShowConceptsWithConceptFeedback, currentConceptUID, selectorDisabled, handleSelectorChange, }) => {
  const conceptsToOptions = () => {
    let options = concepts.data["0"];
    if(onlyShowConceptsWithConceptFeedback) {
      options = _.filter(options, (concept) => {
        return _.keys(conceptsFeedback.data).includes(concept.uid);
      });
    }
    return _.map(options, (concept)=>{
      return (
        {label: concept.displayName, value: concept.uid, shortenedName: concept.name}
      )
    })
  }

  const currentConcept = () => {
    return _.find(concepts.data["0"], {uid: currentConceptUID})
  }

  const placeholder = () => {
    if (currentConceptUID && currentConceptUID.length > 0 && currentConcept()) {
      return currentConcept().displayName
    } else {
      return 'Please select a concept.'
    }
  }

  return (
    <Select
      className="concepts-container"
      disabled={selectorDisabled}
      onChange={handleSelectorChange}
      options={conceptsToOptions()}
      placeholder={placeholder()}
      style={{display: 'block'}}
    />
  )

}

function select (state) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback
  }
}

export default connect(select)(ConceptSelector)
