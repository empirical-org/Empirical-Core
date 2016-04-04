import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/questions'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'

const Questions = React.createClass({
  createNew: function () {
    this.props.dispatch(actions.toggleNewQuestionModal())
  },

  submitNewQuestion: function () {
    var newQuestion = {name: this.refs.newQuestionName.value}
    this.props.dispatch(actions.submitNewQuestion(newQuestion))
    this.refs.newQuestionName.value = ""
    // this.props.dispatch(actions.toggleNewQuestionModal())
  },

  renderQuestions: function () {
    const {data} = this.props.questions;
    const keys = _.keys(data);
    return keys.map((key) => {
      return (<li key={key}><Link to={'/admin/questions/' + key} activeClassName="is-disabled">{data[key].prompt}</Link></li>)
    })
  },

  renderModal: function () {
    var stateSpecificClass = this.props.questions.submittingnew ? 'is-loading' : '';
    if (this.props.questions.newQuestionModalOpen) {
        return (
          <Modal close={this.createNew}>
            <div className="box">
              <h4 className="title">Add New Question</h4>
                <p className="control">
                  <label className="label">Name</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Text input"
                    ref="newQuestionName"
                  />
              </p>
              <p class="control">
                <span class="select">
                  <select>
                    <option>Choose a concept</option>
                    <option>And</option>
                    <option>Or</option>
                  </select>
                </span>
              </p>
              <p className="control">
                <button className={"button is-primary " + stateSpecificClass} onClick={this.submitNewQuestion}>Submit</button>
              </p>
            </div>
          </Modal>
        )
      }
  },

  render: function (){
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Questions</h1>
          { this.renderModal() }
          <div className="columns">
            <div className="column">
              <ul>
                {this.renderQuestions()}
              </ul>
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
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(Questions)
