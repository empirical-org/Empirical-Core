import React from 'react'
import { connect } from 'react-redux'
import SelectSearch from 'react-select-search'
import _ from 'underscore'

// TODO: delete everywhere else that we use conceptsToOptions

class ConceptSelector extends React.Component {

  conceptsToOptions () {
    return _.map(this.props.concepts.data["0"], (concept)=>{
      return (
        {name: concept.displayName, value: concept.uid, shortenedName: concept.name}
      )
    })
  }

  currentConcept () {
    return _.find(this.props.concepts.data["0"], {uid: this.props.currentConceptUID})
  }

  fuse () {
    return ({
      keys: ['shortenedName', 'name'], //first search by specific concept, then by parent and grandparent
      threshold: 0.4
    })
  }

  placeholder () {
    if (this.props.currentConceptUID && this.props.currentConceptUID.length > 0 && this.currentConcept()) {
      return this.currentConcept().displayName
    } else {
      return 'Please select a concept.'
    }
  }

  render() {
    return (
      <SelectSearch options={this.conceptsToOptions()} placeholder={this.placeholder()}
                       onChange={this.props.handleSelectorChange} fuse={this.fuse()}/>
    )
  }
}

function select (state) {
  return {
    concepts: state.concepts
  }
}

export default connect(select)(ConceptSelector)
