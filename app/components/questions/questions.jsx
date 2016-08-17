import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/questions'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'
import QuestionsList from './questionsList.jsx'
import QuestionSelector from 'react-select-search'
import {push} from 'react-router-redux';

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

  handleSearchChange: function(e) {
    var action = push('/admin/questions/' + e.value)
    this.props.dispatch(action)
  },

  renderSearchBox: function() {
    const options = hashToCollection(this.props.questions.data)
    if (options.length > 0) {
      const formatted = options.map((opt) => {
        return {name: opt.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, ""), value: opt.key}
      })
      const searchBox = (<QuestionSelector options={formatted} placeholder="Search for a question" onChange={this.handleSearchChange}/>)
      return searchBox
    }

  },

  render: function (){
    const {questions, concepts} = this.props
    return (
      <section className="section">
        <div className="container">
          { this.renderModal() }
          { this.renderSearchBox() }
          <QuestionsList questions={questions} concepts={concepts} baseRoute={"admin"} />
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
