import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { LinkListItem } from 'quill-component-library/dist/componentLibrary'
import actions from '../../actions/concepts'

class Concepts extends React.Component {
  submitNewConcept = () => {
    var newConcept = {name: this.refs.newConceptName.value}
    this.props.dispatch(actions.submitNewConcept(newConcept))
    this.refs.newConceptName.value = ""
  };

  renderConcepts = () => {
    const data = this.props.concepts.data["0"];
    if (data) {
      return data.map((concept) => {
        return (<LinkListItem
          activeClassName='is-active'
          basePath='concepts'
          itemKey={concept.uid}
          key={concept.uid}
          text={concept.displayName}
        />)
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
