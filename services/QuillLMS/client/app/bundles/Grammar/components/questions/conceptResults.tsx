import * as React from 'react';
import ConceptSelectorWithCheckbox from '../shared/conceptSelectorWithCheckbox';

export default class ConceptResults extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.renderConceptResults = this.renderConceptResults
  }

  renderConceptResults() {
    const conceptResults = Object.assign({}, this.props.conceptResults)
    let components
    if (conceptResults) {
      if (this.props.mode === 'Editing') {
        const conceptResultsPlus = Object.assign(conceptResults, {null: this.props.response.optimal})
        components = Object.keys(conceptResultsPlus).map(uid => {
          const concept = _.find(this.props.concepts.data['0'], { uid, });
          return (
            <ConceptSelectorWithCheckbox
              checked={conceptResults[uid]}
              currentConceptUID={uid}
              deleteConceptResult={() => this.props.deleteConceptResult(uid)}
              handleSelectorChange={this.props.handleConceptChange}
              key={uid}
              onCheckboxChange={() => this.props.toggleCheckboxCorrect(uid)}
              selectorDisabled={uid === null || uid === 'null' ? false : true}
            />
          )
        });
      } else {
        components = Object.keys(conceptResults).map(uid => {
          const concept = _.find(this.props.concepts.data['0'], { uid, });
          if (concept) {
            // hacky fix for the problem where concept result uids are being returned with string value 'false' rather than false
            return  (
              <li key={uid}>
                {concept.displayName} {conceptResults[uid] && conceptResults[uid] !== 'false' ? <span className="tag is-small is-success">Correct</span> : <span className="tag is-small is-danger">Incorrect</span>}
                {'\t'}
              </li>
            )
          }
        });
      }
      return components;
    }
  }

  render() {
    return (
      <div>
        {this.renderConceptResults()}
      </div>
    )
  }

}
