import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/concepts'
import _ from 'underscore'
import {
  Modal,
  LinkListItem
} from 'quill-component-library/dist/componentLibrary'

const Concepts = React.createClass({

  submitNewConcept: function () {
    var newConcept = {name: this.refs.newConceptName.value}
    this.props.dispatch(actions.submitNewConcept(newConcept))
    this.refs.newConceptName.value = ""
    // this.props.dispatch(actions.toggleNewConceptModal())
  },

  renderConcepts: function () {
    const data = this.props.concepts.data["0"];
    // const keys = _.keys(data["0"]);
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
  },

  render: function (){
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
})

function select(state) {
  return {
    concepts: state.concepts,
    routing: state.routing
  }
}

export default connect(select)(Concepts)
