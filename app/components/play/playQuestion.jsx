import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
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
import ConceptExplanation from '../feedback/conceptExplanation.jsx'
import generateFeedbackString from '../renderForQuestions/generateFeedbackString.js'
import getResponse from '../renderForQuestions/checkAnswer.js'
import handleFocus from '../renderForQuestions/handleFocus.js'
import submitQuestionResponse from '../renderForQuestions/submitResponse.js'
import updateResponseResource from '../renderForQuestions/updateResponseResource.js'
import submitPathway from '../renderForQuestions/submitPathway.js'
import {loadResponseData} from '../../actions/responses'
import ThankYou from '../renderForQuestions/renderThankYou.jsx'
import AnswerForm from '../renderForQuestions/renderFormForAnswer.jsx'

const feedbackStrings = C.FEEDBACK_STRINGS

const playQuestion = React.createClass({
  getInitialState: function () {
    return {
      editing: false,
      response: ""
    }
  },

  componentWillMount: function () {
    const {questionID} = this.props.params;
    this.props.dispatch(loadResponseData(questionID))
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
      // var sessionRef = sessionsRef.child(this.state.sessionKey + '/attempts').set(nextProps.question.attempts, (error) => {
      //   return
      // })
    }
  },

  getInitialValue: function () {
    if (this.props.prefill) {
      return this.getQuestion().prefilledText
    }
  },

  removePrefilledUnderscores: function () {
    return this.state.response.replace(/_/g, "").replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")
  },

  getQuestion: function () {
    const {data} = this.props.questions, {questionID} = this.props.params;
    const question = data[questionID]
    question.key = questionID
    return question
  },

  getResponses: function () {
    const {questionID} = this.props.params;
    const responses = this.props.responses.data[questionID]
    return responses
  },

  getResponse2: function (rid) {
    const {data} = this.props.responses, {questionID} = this.props.params;
    const response = data[questionID][rid]
    return response
  },

  submitResponse: function(response) {
    submitQuestionResponse(response,this.props,this.state.sessionKey, submitResponseAnon);
  },

  renderSentenceFragments: function () {
    return <RenderSentenceFragments prompt={this.getQuestion().prompt}/>
  },

  renderCues: function () {
    return <RenderQuestionCues
      getQuestion={this.getQuestion}
      displayArrowAndText={true}
    />
  },

  renderFeedback: function () {
    //For the two lines below,
    //The component at renderForQuestions/feedback.jsx is used by 4 components - play lesson, play game,
    //play question and the diagnostic. Some rely on the question prop having an instructions field, Some
    //on it having an attempts array. The code below ensures that both the instructions and attempts are
    //made available to the feedback component.
    const question = this.props.questions.data[this.props.params.questionID]
    question.attempts = this.props.question.attempts
    return <RenderFeedback sentence="Keep writing! Revise your sentence by changing the order of the ideas."
            question={question} getQuestion={this.getQuestion} renderFeedbackStatements={this.renderFeedbackStatements}/>
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES)
  },

  renderFeedbackStatements: function (attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion}/>
  },

  getNegativeConceptResultsForResponse: function (conceptResults) {
    return _.reject(hashToCollection(conceptResults), (cr) => {
      return cr.correct
    })
  },

  getNegativeConceptResultForResponse: function (conceptResults) {
    const negCRs = this.getNegativeConceptResultsForResponse(conceptResults)
    return negCRs.length > 0 ? negCRs[0] : undefined
  },

  renderConceptExplanation: function () {
    const latestAttempt = getLatestAttempt(this.props.question.attempts)
    if (latestAttempt) {
      if (latestAttempt.found && !latestAttempt.response.optimal && latestAttempt.response.conceptResults) {
        const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.conceptResults)
        const data = this.props.conceptsFeedback.data[conceptID.conceptUID]
        if (data) {
          return <ConceptExplanation {...data}/>
        }
      } else if (this.getQuestion().conceptID) {
        const data = this.props.conceptsFeedback.data[this.getQuestion().conceptID]
        if (data) {
          return <ConceptExplanation {...data}/>
        }
      }
    }
  },

  updateResponseResource: function (response) {
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, this.props.dispatch, "play")
  },

  submitPathway: function (response) {
    submitPathway(response, this.props, "play");
  },

  checkAnswer: function () {
    const filteredResponse = this.removePrefilledUnderscores()
    var response = getResponse(this.getQuestion(), filteredResponse, this.getResponses())

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
    this.setState({editing: true,response: e})
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
    return (<button className="button student-next" onClick={this.finish}>Next Question</button>)
  },

  render: function () {
    if(!this.props.itemLevels.hasreceiveddata) {
      return (
        <div>Loading...</div>
      )
    } else {
      const {data} = this.props.questions, {questionID} = this.props.params;
      const question = data[questionID];
      if (question) {
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

        if (this.state.finished) {
          return (
            <ThankYou sessionKey={this.state.sessionKey} />
          )
        }
        if ( this.props.question.attempts.length > 2 ) {
          return (
            <AnswerForm {...sharedProps}
                        handleChange={() => {}} nextQuestionButton={this.renderNextQuestionButton()}
                         disabled={true}/>
          )
        } else if ( this.props.question.attempts.length > 0 ) {
          if (this.readyForNext()) {
            return (
              <AnswerForm {...sharedProps}
                          handleChange={() => {}} nextQuestionButton={this.renderNextQuestionButton()}
                          conceptExplanation={this.renderConceptExplanation}
                          disabled={true}/>
            )
          } else {
            return (
              <AnswerForm {...sharedProps}
                    handleChange={this.handleChange}
                    toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer}
                    conceptExplanation={this.renderConceptExplanation}
                    />
            )
          }
        } else {
          return (
            <AnswerForm {...sharedProps}
                  handleChange={this.handleChange}
                  toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer}
                  />
          )
        }
      } else {
        return (
          <div>Loading...</div>
        )
      }
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
    conceptsFeedback: state.conceptsFeedback,
    questions: state.questions,
    question: state.question,
    responses: state.responses,
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}
export default connect(select)(playQuestion)
