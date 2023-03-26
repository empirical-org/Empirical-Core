import * as React from "react";
import ConceptColumn from './ConceptColumn';

import { Concept } from '../interfaces/interfaces';

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
    const { concepts, selectedConcept } = this.props
    const completeSelectedConcept = concepts.find(c => Number(c.id) === Number(selectedConcept.conceptID)) || {}
    let levelTwoConcepts = []
    let levelOneConcepts = []
    let levelZeroConcepts = []
    concepts.forEach(c => {
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
    if (selectedConcept) {
      if (selectedConcept.levelNumber === 2) {
        levelOneConcepts = levelOneConcepts.filter(c => c.parent.id === selectedConcept.conceptID)
        levelZeroConcepts = levelZeroConcepts.filter(c => c.parent.parent ? c.parent.parent.id === selectedConcept.conceptID : false)
      } else if (selectedConcept.levelNumber === 1) {
        levelZeroConcepts = levelZeroConcepts.filter(c => c.parent.id === selectedConcept.conceptID)
      }
    }
    return (
      <div className="concept-level-columns">
        <ConceptColumn
          concepts={levelTwoConcepts}
          levelNumber={2}
          selectConcept={this.props.selectConcept}
          selectedConcept={completeSelectedConcept}
          unselectConcept={this.props.unselectConcept}
        />
        <ConceptColumn
          concepts={levelOneConcepts}
          levelNumber={1}
          selectConcept={this.props.selectConcept}
          selectedConcept={completeSelectedConcept}
          unselectConcept={this.props.unselectConcept}
        />
        <ConceptColumn
          concepts={levelZeroConcepts}
          levelNumber={0}
          selectConcept={this.props.selectConcept}
          selectedConcept={completeSelectedConcept}
          unselectConcept={this.props.unselectConcept}
        />
      </div>
    )
  }

  render() {
    return this.renderConceptLevels()
  }
}
