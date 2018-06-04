import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/concepts-feedback'
import _ from 'underscore'
import Modal from '../modal/modal.jsx'
import LinkListItem from '../shared/linkListItem.jsx'
import {hashToCollection} from '../../libs/hashToCollection'

const ConceptsFeedback = React.createClass({
  createNew: function () {
    this.props.dispatch(actions.toggleNewConceptsFeedbackModal())
  },

  submitNewConcept: function () {
    var newConcept = {name: this.refs.newConceptName.value}
    this.props.dispatch(actions.submitNewConceptsFeedback(newConcept))
    this.refs.newConceptName.value = ""
    this.props.dispatch(actions.toggleNewConceptsFeedbackModal())
  },

  renderConceptsFeedback: function () {
    const data = this.props.concepts.data;
    if (data && data["0"]) {
      return data["0"].map((concept) => {
        const hasFeedback = !!this.props.conceptsFeedback.data[concept.uid];
        return <LinkListItem
          key={concept.uid}
          basePath='concepts-feedback'
          itemKey={concept.uid}
          className={hasFeedback ? "" : "no-feedback"}
          activeClassName='is-active'
          text={concept.displayName}
        />
      })
    }
  },

  renderModal: function () {
    const {data, submittingnew} = this.props.conceptsFeedback;
    var stateSpecificClass = submittingnew ? 'is-loading' : '';
    if (this.props.conceptsFeedback.newConceptModalOpen) {
        return (
          <Modal close={this.createNew}>
            <div className="box">
              <h4 className="title">Add New Concept</h4>
                <p className="control">
                  <label className="label">Name</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Text input"
                    ref="newConceptName"
                  />
              </p>
              <p className="control">
                <button className={"button is-primary " + stateSpecificClass} onClick={this.submitNewConcept}>Submit</button>
              </p>
            </div>
          </Modal>
        )
      }
  },

  render: function (){
    //// console.log("Inside render for left panel, all concepts, this:\n ", this)
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <aside className="menu">
                <p className="menu-label">
                  Concepts
                </p>
                <ul className="menu-list">
                  {this.renderConceptsFeedback()}
                </ul>
              </aside>
            </div>
            <div className="column">
              {this.props.children}
            </div>
          </div>
        </div>
      </section>
    )
  }
})

function select(state) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback,
    routing: state.routing
  }
}

export default connect(select)(ConceptsFeedback)
