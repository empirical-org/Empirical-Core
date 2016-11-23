import React from 'react'
import { connect } from 'react-redux'
import PlayLessonQuestion from './question.jsx'
import PlaySentenceFragment from '../diagnostics/sentenceFragment.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, resumePreviousSession} from '../../actions.js'
import SessionActions from '../../actions/sessions.js'
import {loadResponseData} from '../../actions/responses'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import {getConceptResultsForAllQuestions, calculateScoreForLesson} from '../../libs/conceptResults/lesson'
import Register from './register.jsx'
import Finished from './finished.jsx'


import Spinner from '../shared/spinner.jsx'
const request = require('request');

const Lesson = React.createClass({
  componentWillMount: function() {
    this.props.dispatch(clearData())
  },

  getInitialState: function() {
    return {hasOrIsGettingResponses: false}
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.doesNotHaveAndIsNotGettingResponses() && this.hasQuestionsInQuestionSet(nextProps)) {
      this.getResponsesForEachQuestion(nextProps.playLesson)
    }
    if (nextProps.playLesson.answeredQuestions.length !== this.props.playLesson.answeredQuestions.length ) {
      this.saveSessionData(nextProps.playLesson)
    }
  },

  doesNotHaveAndIsNotGettingResponses: function() {
    return (!this.state.hasOrIsGettingResponses)
  },

  componentDidMount: function(){
    this.saveSessionIdToState();
  },

  getPreviousSessionData: function () {
    return this.props.sessions.data[this.props.location.query.student]
  },

  resumeSession: function (data) {
    if (data) {
      this.props.dispatch(resumePreviousSession(data))
    }
  },

  hasQuestionsInQuestionSet: function(props){
    const pL = props.playLesson
    return (pL && pL.questionSet && pL.questionSet.length)
  },


  saveSessionIdToState: function(){
    var sessionID = this.props.location.query.student
    if (sessionID === "null") {
      sessionID = undefined
    }
    this.setState({sessionID})
  },

  submitResponse: function(response) {
    const action = submitResponse(response);
    this.props.dispatch(action)
  },

  saveToLMS: function () {
    const results = getConceptResultsForAllQuestions(this.props.playLesson.answeredQuestions)
    const score = calculateScoreForLesson(this.props.playLesson.answeredQuestions)
    const {lessonID} = this.props.params
    const sessionID = this.state.sessionID;
    if (sessionID) {
      this.finishActivitySession(sessionID, results, score)
    } else {
      this.createAnonActivitySession(lessonID, results, score)
    }
  },

  finishActivitySession: function (sessionID, results, score) {
    request(
      { url: process.env.EMPIRICAL_BASE_URL + '/api/v1/activity_sessions/' + sessionID,
        method: 'PUT',
        json:
        {
          state: 'finished',
          concept_results: results,
          percentage: score
        }
      },
      (err,httpResponse,body) => {
        if (httpResponse.statusCode === 200) {
          console.log("Finished Saving")
          console.log(err,httpResponse,body)
          this.props.dispatch(SessionActions.delete(this.state.sessionID));
          document.location.href = process.env.EMPIRICAL_BASE_URL + "/activity_sessions/" + this.state.sessionID
          this.setState({saved: true});
        }
      }
    )
  },

  markIdentify: function (bool) {
    const action = updateCurrentQuestion({identified: bool})
    this.props.dispatch(action)
  },

  createAnonActivitySession: function (lessonID, results, score) {
    request(
      { url: process.env.EMPIRICAL_BASE_URL + '/api/v1/activity_sessions/',
        method: 'POST',
        json:
        {
          state: 'finished',
          activity_uid: lessonID,
          concept_results: results,
          percentage: score
        }
      },
      (err,httpResponse,body) => {
        if (httpResponse.statusCode === 200) {
          console.log("Finished Saving")
          console.log(err,httpResponse,body)
          document.location.href = process.env.EMPIRICAL_BASE_URL + "/activity_sessions/" + body.activity_session.uid
          this.setState({saved: true});
        }
      }
    )
  },

  questionsForLesson: function () {
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    return data[lessonID].questions.map((questionItem) => {
      const questionType = questionItem.questionType
      const key = questionItem.key
      const question = this.props[questionType].data[key]
      question.key = key;
      const type = questionType === 'questions' ? 'SC' : 'SF';
      return {type, question}
    })
  },

  startActivity: function (name) {
    this.saveStudentName(name);
    const action = loadData(this.questionsForLesson())
    this.props.dispatch(action);
    const next = nextQuestion();
    this.props.dispatch(next);
  },

  nextQuestion: function () {
    const next = nextQuestion();
    return this.props.dispatch(next);
  },

  getLesson: function () {
    return this.props.lessons.data[this.props.params.lessonID]
  },

  getLessonName: function () {
    return this.props.lessons.data[this.props.params.lessonID].name
  },

  saveStudentName: function (name) {
    this.props.dispatch(updateName(name))
  },

  getProgressPercent: function () {
    if (this.props.playLesson && this.props.playLesson.answeredQuestions && this.props.playLesson.questionSet) {
      return this.props.playLesson.answeredQuestions.length / this.props.playLesson.questionSet.length * 100
    } else {
      return 0
    }
  },

  saveSessionData: function(lessonData){
    if (this.state.sessionID) {
      this.props.dispatch(SessionActions.update(this.state.sessionID, lessonData));
    }
  },

  getResponsesForEachQuestion: function (playLesson) {
    // we need to change the gettingResponses state so that we don't keep hitting this as the props update,
    // otherwise it forms an infinite loop via component will receive props
    this.setState({hasOrIsGettingResponses: true}, ()=> {
      const questionSet = playLesson.questionSet
      questionSet.forEach((q)=>{
        this.props.dispatch(loadResponseData(q.question.key))
      })
    });
  },

  render: function () {
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    var component;
    if (data[lessonID]) {
      if (this.props.playLesson.currentQuestion) {
        const {type, question} = this.props.playLesson.currentQuestion
        if (type === 'SF') {
          component= (
            <PlaySentenceFragment currentKey={question.key} question={question} nextQuestion={this.nextQuestion} key={question.key} marking="diagnostic" updateAttempts={this.submitResponse} markIdentify={this.markIdentify}/>
          )
        } else {
          component = (
            <PlayLessonQuestion key={question.key} question={question} nextQuestion={this.nextQuestion} prefill={this.getLesson().prefill}/>
          )
        }
      }
      else if (this.props.playLesson.answeredQuestions.length > 0 && (this.props.playLesson.unansweredQuestions.length === 0 && this.props.playLesson.currentQuestion === undefined )) {
        component = (
          <Finished
            data={this.props.playLesson}
            name={this.state.sessionID}
            lessonID={this.props.params.lessonID}
            saveToLMS={this.saveToLMS}
          />
        )
      }
      else {
        component = (
          <Register lesson={this.getLesson()} startActivity={this.startActivity} session={this.getPreviousSessionData()} resumeActivity={this.resumeSession}/>
        )
      }

      return (
        <div>
        <progress className="progress diagnostic-progress" value={this.getProgressPercent()} max="100">15%</progress>
        <section className="section is-fullheight minus-nav student">
        <div className="student-container student-container-diagnostic">
            <ReactCSSTransitionGroup
              transitionName="carousel"
              transitionEnterTimeout={350}
              transitionLeaveTimeout={350}
              >
              {component}
            </ReactCSSTransitionGroup>
          </div>
        </section>
        </div>
      )
    }
    else {
      return (<div className="student-container student-container-diagnostic"><Spinner/></div>)
    }
  }
})

function select(state) {
  return {
    lessons: state.lessons,
    questions: state.questions,
    sentenceFragments: state.sentenceFragments,
    playLesson: state.playLesson, //the questionReducer
    routing: state.routing,
    sessions: state.sessions,
    responses: state.responses
  }
}

export default connect(select)(Lesson)
