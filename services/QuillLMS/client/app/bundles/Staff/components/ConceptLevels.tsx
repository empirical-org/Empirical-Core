import * as React from "react";
import _ from 'lodash'
import ConceptColumn from './ConceptColumn'

export default class ConceptLevels extends React.Component {
  constructor(props) {
    super(props)
  }

  renderConceptLevels() {
    const levelTwoConcepts = []
    const levelOneConcepts = []
    const levelZeroConcepts = []
    this.props.concepts.forEach(c => {
      if (c.parent) {
        if (c.parent.parent) {
          levelZeroConcepts.push(c)
        } else {
          levelOneConcepts.push(c)
        }
      } else {
        levelTwoConcepts.push(c)
      }
    })
    return <div className="concept-level-columns">
      <ConceptColumn
        concepts={levelTwoConcepts}
        levelNumber={2}
        selectConcept={this.props.selectConcept}
      />
      <ConceptColumn
        concepts={levelOneConcepts}
        levelNumber={1}
        selectConcept={this.props.selectConcept}
      />
      <ConceptColumn
        concepts={levelZeroConcepts}
        levelNumber={0}
        selectConcept={this.props.selectConcept}
      />
    </div>
  }

  render() {
    return this.renderConceptLevels()
  }
}
