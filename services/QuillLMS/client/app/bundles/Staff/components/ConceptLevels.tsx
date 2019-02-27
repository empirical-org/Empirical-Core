import * as React from "react";
import _ from 'lodash'
import ConceptColumn from './ConceptColumn'

import { Concept } from '../interfaces/interfaces'

interface ConceptLevelsProps {
  concepts: Array<Concept>;
  selectConcept: Function;
  unselectConcept(any): void;
  selectedConcept: { levelNumber?: Number, conceptID?: Number},
}

export default class ConceptLevels extends React.Component<ConceptLevelsProps, any> {
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
        unselectConcept={this.props.unselectConcept}
        selectedConcept={this.props.selectedConcept}
      />
      <ConceptColumn
        concepts={levelOneConcepts}
        levelNumber={1}
        selectConcept={this.props.selectConcept}
        unselectConcept={this.props.unselectConcept}
        selectedConcept={this.props.selectedConcept}
      />
      <ConceptColumn
        concepts={levelZeroConcepts}
        levelNumber={0}
        selectConcept={this.props.selectConcept}
        unselectConcept={this.props.unselectConcept}
        selectedConcept={this.props.selectedConcept}
      />
    </div>
  }

  render() {
    return this.renderConceptLevels()
  }
}
