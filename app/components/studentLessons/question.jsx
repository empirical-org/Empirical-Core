import React from 'react'
var Markdown = require('react-remarkable');
import {connect} from 'react-redux'
import { Link } from 'react-router'
import Question from '../../libs/question'
import Textarea from 'react-textarea-autosize';
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import {submitResponse, clearResponses} from '../../actions.js'
import questionActions from '../../actions/questions'
import pathwayActions from '../../actions/pathways'
var C = require("../../constants").default
import rootRef from "../../libs/firebase"
const sessionsRef = rootRef.child('sessions')
var C = require("../../constants").default
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx'
import RenderQuestionCues from '../renderForQuestions/cues.jsx'
import RenderSentenceFragments from '../renderForQuestions/sentenceFragments.jsx'
import RenderFeedback from '../renderForQuestions/feedback.jsx'
import generateFeedbackString from '../renderForQuestions/generateFeedbackString.js'
import getResponse from '../renderForQuestions/checkAnswer.js'
import handleFocus from '../renderForQuestions/handleFocus.js'
import submitQuestionResponse from '../renderForQuestions/submitResponse.js'
import updateResponseResource from '../renderForQuestions/updateResponseResource.js'
import submitPathway from '../renderForQuestions/submitPathway.js'

import StateFinished from '../renderForQuestions/renderThankYou.jsx'
import AnswerForm from '../renderForQuestions/renderFormForAnswer.jsx'

const feedbackStrings = C.FEEDBACK_STRINGS

const playLessonQuestion = React.createClass({
  getInitialState: function () {
    return {
      editing: false,
      response: ""
    }
  },

  getInitialValue: function () {
    if (this.props.prefill) {
      return this.getQuestion().prefilledText
    }
  },

  removePrefilledUnderscores: function () {
    this.setState({response: this.state.response.replace(/_/g, "")})
  },

  getQuestion: function () {
    return this.props.question
  },

  getResponse2: function (rid) {
    const {data} = this.props.questions, questionID = this.props.question.key;
    return (data[questionID].responses[rid])
  },

  submitResponse: function(response) {
    submitQuestionResponse(response,this.props,this.state.sessionKey,submitResponse);
  },

  renderSentenceFragments: function () {
    return <RenderSentenceFragments getQuestion={this.getQuestion}/>
  },

  listCuesAsString: function (cues) {
    var newCues = cues.slice(0);
    return newCues.splice(0, newCues.length - 1).join(", ") + " or " + newCues.pop() + "."
  },

  renderFeedback: function () {
    return <RenderFeedback question={this.props.question} renderFeedbackStatements = {this.renderFeedbackStatements}
            sentence="We have not seen this sentence before. Could you please try writing it in another way?"
            getQuestion={this.getQuestion} listCuesAsString={this.listCuesAsString} />
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES)
  },

  renderFeedbackStatements: function (attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion}/>
  },

  renderCues: function () {
    return <RenderQuestionCues getQuestion={this.getQuestion}/>
  },

  updateResponseResource: function (response) {
    updateResponseResource(response, this.props, this.getErrorsForAttempt)
  },

  submitPathway: function (response) {
    submitPathway(response, this.props)
  },

  checkAnswer: function (e) {
    if (this.state.editing) {
      this.removePrefilledUnderscores()
      var response = getResponse(this.getQuestion(), this.state.response)
      this.updateResponseResource(response)
      this.submitResponse(response)
      this.setState({editing: false})
    }
  },

  toggleDisabled: function () {
    if (this.state.editing) {
      return "";
    }
    return "is-disabled"
  },

  handleChange: function (e) {
    if (e !== this.state.response) {
      this.setState({editing: true, response: e})
    }
  },

  readyForNext: function () {
    if (this.props.question.attempts.length > 0 ) {
      var latestAttempt = getLatestAttempt(this.props.question.attempts)
      if (latestAttempt.found) {
        var errors = _.keys(this.getErrorsForAttempt(latestAttempt))
        if (latestAttempt.response.optimal && errors.length === 0) {
          return true
        }
      }
    }
    return false
  },

  getProgressPercent: function () {
    return this.props.question.attempts.length / 3 * 100
  },

  finish: function () {
    this.setState({finished: true})
  },

  nextQuestion: function () {
    this.props.nextQuestion()
    this.setState({response: ""})
  },

  renderNextQuestionButton:  function (correct) {
    return (<button className="button student-next" onClick={this.nextQuestion}>Next</button>)
  },

  render: function () {
    const questionID = this.props.question.key;
    if (this.props.question) {
      const sharedProps = {
        value: this.state.response,
        question: this.props.question,
        getResponse: this.getResponse2,
        feedback: this.renderFeedback(),
        initialValue: this.getInitialValue(),
        key: questionID,
        questionID: questionID,
        id: "playQuestion",
        sentenceFragments: this.renderSentenceFragments(),
        cues: this.renderCues(),
      }
      var component;
      if (this.state.finished) {
        component = (
          <StateFinished sessionKey={this.state.sessionKey} />
        )
      }
      if (this.props.question.attempts.length > 2 ) {
        component = (
          <AnswerForm {...sharedProps}
                      handleChange={() => {}}
                      nextQuestionButton={this.renderNextQuestionButton()}
                      disabled={true}
                       />
        )
      } else if (this.props.question.attempts.length > 0 ) {
        var latestAttempt = getLatestAttempt(this.props.question.attempts)
        if (this.readyForNext()) {
          component = (
            <AnswerForm {...sharedProps}
                      handleChange={() => {}}
                      nextQuestionButton={this.renderNextQuestionButton(true)}
                      disabled={true}
                    />
          )
        } else {
          component = (
            <AnswerForm {...sharedProps}
                  handleChange={this.handleChange}
                  toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer} />
          )
        }
      } else {
        component = (
          <AnswerForm {...sharedProps}
                handleChange={this.handleChange}
                toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer} />
        )
      }
      return (
        <div className="student-container-inner-diagnostic">
          {component}
        </div>
      )
    } else {
      return (<p>Loading...</p>)
    }
  }
})

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    routing: state.routing
  }
}
export default connect(select)(playLessonQuestion)
