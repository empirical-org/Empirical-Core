import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/concepts'
import _ from 'underscore'
import { LinkListItem } from '../shared/linkListItem';

class Concepts extends React.Component {

  submitNewConcept = () => {
    const { dispatch } = this.props;
    const { newConceptName } = this.refs;
    const { value } = newConceptName;
    const newConcept = {name: value}
    dispatch(actions.submitNewConcept(newConcept))
    this.refs.newConceptName.value = ""
  };

  renderConcepts = () => {
    const { concepts } = this.props;
    const { data } = concepts;
    const dataRow = data["0"];
    if (dataRow) {
      return dataRow.map((concept) => {
        const { uid, displayName } = concept;
        return (
          <LinkListItem
            activeClassName='is-active'
            basePath='concepts'
            itemKey={uid}
            key={uid}
            text={displayName}
          />
        )
      })
    }
  };

  render() {
    return (
      <section className="section">
        <div className="admin-container">
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
