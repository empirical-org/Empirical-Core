import * as React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions/conceptsFeedback'
import _ from 'underscore'
import { Modal } from 'quill-component-library/dist/componentLibrary'
import LinkListItem from '../shared/linkListItem'

class ConceptsFeedback extends React.Component {
  constructor(props) {
    super(props)
  }

  createNew() {
    this.props.dispatch(actions.toggleNewConceptsFeedbackModal())
  }

  submitNewConceptFeedback() {
    const newConcept = {name: this.refs.newConceptName.value}
    this.props.dispatch(actions.submitNewConceptFeedback(newConcept))
    this.refs.newConceptName.value = ""
    this.props.dispatch(actions.toggleNewConceptsFeedbackModal())
  }

  renderConceptsFeedback() {
    const data = this.props.concepts.data;
    if (data && data["0"]) {
      return data["0"].sort((a, b) => a.displayName.localeCompare(b.displayName)).map((concept) => {
        const hasFeedback = !!this.props.conceptsFeedback.data[concept.uid];
        return <LinkListItem
          key={concept.uid}
          basePath='concepts_feedback'
          itemKey={concept.uid}
          className={hasFeedback ? "" : "no-feedback"}
          activeClassName='is-active'
          text={concept.displayName}
        />
      })
    }
  }

  renderModal() {
    const {data, submittingnew} = this.props.conceptsFeedback;
    const stateSpecificClass = submittingnew ? 'is-loading' : '';
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
                <button className={"button is-primary " + stateSpecificClass} onClick={this.submitNewConceptFeedback}>Submit</button>
              </p>
            </div>
          </Modal>
        )
      }
  }

  render(){
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
}

function select(state) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback,
    routing: state.routing
  }
}

export default connect(select)(ConceptsFeedback)
