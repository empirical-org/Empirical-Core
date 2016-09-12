import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/questions'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'
import Question from '../../libs/question'
import QuestionsList from './questionsList.jsx'
import QuestionSelector from 'react-select-search'
import {push} from 'react-router-redux';

const Questions = React.createClass({
  getInitialState: function() {
    return {
      displayNoConceptQuestions: false
    }
  },

  createNew: function () {
    this.props.dispatch(actions.toggleNewQuestionModal())
  },

  submitNewQuestion: function () {
    var newQuestion = {name: this.refs.newQuestionName.value}
    this.props.dispatch(actions.submitNewQuestion(newQuestion))
    this.refs.newQuestionName.value = ""
    // this.props.dispatch(actions.toggleNewQuestionModal())
  },

  updateRematchedResponse: function (qid, rid, vals) {
    this.props.dispatch(actions.submitResponseEdit(qid, rid, vals))
  },

  getErrorsForAttempt: function (attempt) {
    return attempt.feedback
  },

  generateFeedbackString: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    return errors
  },

  getMatchingResponse: function (quest, response) {
    var fields = {
      responses: _.filter(this.responsesWithStatus(quest), (resp) => {
        return resp.statusCode < 2
      }),
      focusPoints: quest.focusPoints ? hashToCollection(quest.focusPoints) : []
    }
    var question = new Question(fields);
    return question.checkMatch(response.text);
  },

  // Functions for rematching all Responses
  mapConceptsToList: function () {
    const concepts = hashToCollection(this.props.concepts.data['0']);
    const questions = hashToCollection(this.props.questions.data);
    const conceptsWithQuestions = concepts.map((concept) => {
      return _.where(questions, {conceptID: concept.uid})
    })
    return _.flatten(conceptsWithQuestions)
  },

  responsesWithStatus: function (question) {
    var responses = hashToCollection(question.responses)
    return responses.map((response) => {
      var statusCode;
      if (!response.feedback) {
        statusCode = 4;
      } else if (!!response.parentID) {
        // var parentResponse = this.getResponse(response.parentID)
        statusCode = 3;
      } else {
        statusCode = (response.optimal ? 0 : 1);
      }
      response.statusCode = statusCode
      return response
    })
  },

  rematchAllQuestions: function () {
    console.log("Rematching All Questions")
    _.each(this.mapConceptsToList(), (question) => {
      console.log("Rematching Question: ", question.key)
      this.rematchAllResponses(question)
    })
    console.log("Finished Rematching All Questions")
  },

  rematchAllResponses: function (question) {
    console.log("Rematching All Responses")
    const weak = _.filter(this.responsesWithStatus(question), (resp) => {
      return resp.statusCode > 1
    })
    weak.forEach((resp) => {
      this.rematchResponse(resp, question)
    })
    console.log("Finished Rematching All Responses")
  },

  rematchResponse: function (response, question) {
    var newResponse = this.getMatchingResponse(question, response)
    if (!newResponse.found) {
      console.log("No response match")
      var newValues = {
        weak: false,
        text: response.text,
        count: response.count
      }
      this.props.dispatch(
        actions.setUpdatedResponse(question.key, response.key, newValues)
      )
      return
    }
    if (newResponse.response.key === response.parentID) {
      console.log("Same response  match")
      if (newResponse.author) {
        var newErrorResp = {
          weak: false,
          author: newResponse.author,
          feedback: this.generateFeedbackString(newResponse)
        }
        this.updateRematchedResponse(question.key, response.key, newErrorResp)
      }
    }
    else {
      console.log("New response  match")
      var newErrorResp = {
        weak: false,
        parentID: newResponse.response.key,
        author: newResponse.author,
        feedback: this.generateFeedbackString(newResponse)
      }
      this.updateRematchedResponse(question.key, response.key, newErrorResp)
    }
    // this.updateReponseResource(response)
    // this.submitResponse(response)
    // this.setState({editing: false})
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

  toggleNoConceptQuestions: function() {
    this.setState({
      displayNoConceptQuestions: !this.state.displayNoConceptQuestions
    })
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

  render: function () {
    const {questions, concepts} = this.props
    if(this.props.questions.hasreceiveddata && this.props.concepts.hasreceiveddata) {
      return (
        <section className="section">
          <div className="container">
            <button onClick={this.rematchAllQuestions}>Rematch all Questions</button>
            { this.renderModal() }
            { this.renderSearchBox() }
            <br />
            <label className="checkbox">
              <input type="checkbox" checked={this.state.displayNoConceptQuestions} onClick={this.toggleNoConceptQuestions}/>
              Display questions with no valid concept
            </label>
            <br />
            <br />
            <QuestionsList displayNoConceptQuestions={this.state.displayNoConceptQuestions} questions={questions} concepts={concepts} baseRoute={"admin"} />
          </div>
        </section>
      )
    } else {
      return (
        <div>Loading...</div>
      )
    }
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
