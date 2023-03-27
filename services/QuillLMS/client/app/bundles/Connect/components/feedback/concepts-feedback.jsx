import React from 'react'
import { connect } from 'react-redux'
import { Modal } from '../../../Shared/index'
import actions from '../../actions/concepts-feedback'
import { LinkListItem } from '../shared/linkListItem'

class ConceptsFeedback extends React.Component {

  createNew = () => {
    const { dispatch } = this.props
    dispatch(actions.toggleNewConceptsFeedbackModal())
  };

  submitNewConcept = () => {
    const { dispatch } = this.props
    const newConcept = {name: this.refs.newConceptName.value}
    dispatch(actions.submitNewConceptsFeedback(newConcept))
    this.refs.newConceptName.value = ""
    dispatch(actions.toggleNewConceptsFeedbackModal())
  };

  renderConceptsFeedback = () => {
    const { concepts, conceptsFeedback } = this.props
    const { data } = concepts
    if (data && data["0"]) {
      return data["0"].map((concept) => {
        const hasFeedback = !!conceptsFeedback.data[concept.uid];
        return (
          <LinkListItem
            activeClassName='is-active'
            basePath='concepts-feedback'
            className={hasFeedback ? "" : "no-feedback"}
            excludeResponses={true}
            itemKey={concept.uid}
            key={concept.uid}
            text={concept.displayName}
          />
        )
      })
    }
  };

  renderModal = () => {
    const { conceptsFeedback } = this.props
    const { newConceptModalOpen, submittingnew} = conceptsFeedback;
    const stateSpecificClass = submittingnew ? 'is-loading' : '';
    if (newConceptModalOpen) {
      return (
        <Modal close={this.createNew}>
          <div className="box">
            <h4 className="title">Add New Concept</h4>
            <p className="control">
              <label className="label">Name</label>
              <input
                className="input"
                placeholder="Text input"
                ref="newConceptName"
                type="text"
              />
            </p>
            <p className="control">
              <button className={"button is-primary " + stateSpecificClass} onClick={this.submitNewConcept}>Submit</button>
            </p>
          </div>
        </Modal>
      )
    }
  };

  render() {
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
          </div>
        </div>
      </section>
    )
  }
}

function select(state) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback,
    routing: state.routing
  }
}

export default connect(select)(ConceptsFeedback)
