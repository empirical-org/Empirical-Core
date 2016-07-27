import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import Question from '../../libs/question'
import Textarea from 'react-textarea-autosize';
var Markdown = require('react-remarkable');
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import {submitResponseAnon, clearResponsesAnon} from '../../actions.js'
import questionActions from '../../actions/questions'
import pathwayActions from '../../actions/pathways'
var C = require("../../constants").default
import rootRef from "../../libs/firebase"
const sessionsRef = rootRef.child('sessions')

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

import ThankYou from '../renderForQuestions/renderThankYou.jsx'
import AnswerForm from '../renderForQuestions/renderFormForAnswer.jsx'

const feedbackStrings = {
  punctuationError: "There may be an error. How could you update the punctuation?",
  typingError: "Try again. There may be a spelling mistake.",
  caseError: "Try again. There may be a capitalization error.",
  minLengthError: "Try again. Do you have all of the information from the prompt?",
  maxLengthError: "Try again. How could this sentence be shorter and more concise?"
}

const playQuestion = React.createClass({
  getInitialState: function () {
    return {
      editing: false,
      response: ""
    }
  },

  componentDidMount: function() {
    this.props.dispatch(clearResponsesAnon())
    const {questionID} = this.props.params
    var sessionRef = sessionsRef.push({questionID}, (error) => {
      this.setState({sessionKey: sessionRef.key})
    })
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.question.attempts.length > 0) {
      var sessionRef = sessionsRef.child(this.state.sessionKey + '/attempts').set(nextProps.question.attempts, (error) => {
        return
      })
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
    const {data} = this.props.questions, {questionID} = this.props.params;
    return (data[questionID])
  },

  submitResponse: function(response) {
    submitQuestionResponse(response,this.props,this.state.sessionKey, submitResponseAnon);
  },

  renderSentenceFragments: function () {
    return <RenderSentenceFragments getQuestion={this.getQuestion}/>
  },

  renderCues: function () {
    return <RenderQuestionCues getQuestion={this.getQuestion}/>
  },

  renderFeedback: function () {
    return <RenderFeedback sentence="Try Again. What’s another way you could write this sentence?"
            question={this.props.question} renderFeedbackStatements={this.renderFeedbackStatements}/>
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, 'typingError', 'caseError', 'punctuationError', 'minLengthError', 'maxLengthError')
  },

  renderFeedbackStatements: function (attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion}/>
  },

  updateResponseResource: function (response) {
    updateResponseResource(response, this.props, this.getErrorsForAttempt, "play")
  },

  submitPathway: function (response) {
    submitPathway(response, this.props, "play");
  },

  checkAnswer: function () {
    this.removePrefilledUnderscores()

    var response = getResponse(this.getQuestion(), this.state.response)

    this.updateResponseResource(response)
    this.submitResponse(response)
    this.setState({editing: false})
  },

  toggleDisabled: function () {
    if (this.state.editing) {
      return "";
    }
    return "is-disabled"
  },

  handleChange: function (e) {
    this.setState({editing: true,response: e.target.value})
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

  renderNextQuestionButton:  function (correct) {
    if (correct) {
      return (<button className="button is-outlined is-success" onClick={this.finish}>Next</button>)
    } else {
      return (<button className="button is-outlined is-warning" onClick={this.finish}>Next</button>)
    }
  },

  render: function () {
    console.log("initialValue: ", this.getInitialValue())
    const {data} = this.props.questions, {questionID} = this.props.params; //DIFFERENCE
    if (data[questionID]) {
      if (this.state.finished) {
        return (
          <ThankYou sessionKey={this.state.sessionKey} />
        )
      }
      if (this.props.question.attempts.length > 2 ) {
        return (
          <AnswerForm sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                      feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                      handleChange={this.handleChange} nextQuestionButton={this.renderNextQuestionButton()}
                      questionID={questionID} id="playQuestion" textAreaClass="textarea  is-disabled"/>
        )
      } else if (this.props.question.attempts.length > 0 ) {
        if (this.readyForNext()) {
          return (
            <AnswerForm sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                        feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                        handleChange={this.handleChange} nextQuestionButton={this.renderNextQuestionButton()}
                        questionID={questionID} id="playQuestion" textAreaClass="textarea is-question submission"/>
          )
        } else {
          return (
            <AnswerForm sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                  feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                  handleChange={this.handleChange} textAreaClass="textarea is-question submission"
                  toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer}
                  id="playQuestion" questionID={questionID}/>
          )
        }

      } else {
        return (
          <AnswerForm sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                handleChange={this.handleChange} textAreaClass="textarea is-question submission"
                toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer}
                id="playQuestion" questionID={questionID}/>
        )
      }
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
    question: state.question,
    routing: state.routing
  }
}
export default connect(select)(playQuestion)
