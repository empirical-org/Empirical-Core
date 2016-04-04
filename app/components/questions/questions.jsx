import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/questions'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'

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
    const concepts = hashToCollection(this.props.concepts.data);
    const questions = hashToCollection(this.props.questions.data);
    return concepts.map((concept) => {
      var label = (
        <p className="menu-label">
          {concept.name}
        </p>
      )
      var questionsForConcept = _.where(questions, {conceptID: concept.key})
      var listItems = questionsForConcept.map((question) => {
        return (<li key={question.key}><Link to={'/admin/questions/' + question.key} activeClassName="is-active">{question.prompt}</Link></li>)
      })

      if (questionsForConcept.length === 0) {
        return
      }

      return [
        label,
        (<ul className="menu-list">
          {listItems}
        </ul>)
      ]

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
    concepts: state.concepts,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(Questions)
