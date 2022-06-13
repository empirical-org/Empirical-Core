import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { LinkListItem } from '../shared/linkListItem'
import actions from '../../actions/concepts'

class Concepts extends React.Component {

  submitNewConcept = () => {
    const { dispatch } = this.props
    const newConcept = {name: this.refs.newConceptName.value}
    dispatch(actions.submitNewConcept(newConcept))
    this.refs.newConceptName.value = ""
  };

  renderConcepts = () => {
    const { concepts } = this.props
    const { data } = concepts
    const dataRow = data["0"];
    if (dataRow) {
      return dataRow.map((concept) => {
        return (
          <LinkListItem
            activeClassName='is-active'
            basePath='concepts'
            excludeResponses={true}
            itemKey={concept.uid}
            key={concept.uid}
            text={concept.displayName}
          />
        )
      })
    }
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <aside className="menu">
            <p className="menu-label">
                  Concepts
            </p>
            <ul className="menu-list">
              {this.renderConcepts()}
            </ul>
          </aside>
        </div>
      </section>
    )
  }
}

function select(state) {
  return {
    concepts: state.concepts,
    routing: state.routing
  }
}

export default connect(select)(Concepts)
