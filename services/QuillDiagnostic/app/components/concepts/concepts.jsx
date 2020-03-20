import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/concepts'
import _ from 'underscore'
import {
  Modal,
  LinkListItem
} from 'quill-component-library/dist/componentLibrary'

class Concepts extends React.Component {
  createNew = () => {
    const { dispatch } = this.props;
    dispatch(actions.toggleNewConceptModal())
  };

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
        return (<LinkListItem
          activeClassName='is-active'
          basePath='concepts'
          itemKey={uid}
          key={uid}
          text={displayName}
        />)
      })
    }
  };

  renderModal = () => {
    const { concepts } = this.props;
    const { submittingnew, newConceptModalOpen } = concepts;
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
          <h1 className="title"><button className="button is-primary" onClick={this.createNew}>Create New concept</button></h1>
          { this.renderModal() }
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
