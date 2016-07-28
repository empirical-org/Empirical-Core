import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/concepts-feedback'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'

const ConceptsFeedback = React.createClass({
  createNew: function () {
    this.props.dispatch(actions.toggleNewConceptsFeedbackModal())
    //alert("New feedback form being created")
  },

  submitNewConcept: function () {
    //console.log(this.props)
    //console.log(this.refs)
    var newConcept = {name: this.refs.newConceptName.value}
    this.props.dispatch(actions.submitNewConceptsFeedback(newConcept))
    this.refs.newConceptName.value = ""
    this.props.dispatch(actions.toggleNewConceptsFeedbackModal())
  },

  renderConceptsFeedback: function () {
    const {data} = this.props.conceptsFeedback;
    console.log("this.props.conceptsFeedback", data)
    const keys = _.keys(data);
    return keys.map((id, index) => {
      //console.log(key, data, data[key])
      return (<li key={index}><Link to={'/admin/concepts-feedback/' + id} activeClassName="is-active">{data[id].name}</Link></li>)
    })
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
    //console.log("Inside render for left panel, all concepts, this:\n ", this)
    return (
      <section className="section">
        <div className="container">
          <h1 className="title"><button className="button is-primary" onClick={this.createNew}>Create New concept</button></h1>
          { this.renderModal() }
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
    conceptsFeedback: state.conceptsFeedback,
    routing: state.routing
  }
}

export default connect(select)(ConceptsFeedback)
