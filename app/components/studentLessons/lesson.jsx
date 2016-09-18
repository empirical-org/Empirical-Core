import React from 'react'
import { connect } from 'react-redux'
import PlayLessonQuestion from './question.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {clearData, loadData, nextQuestion, submitResponse, updateName} from '../../actions.js'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import Register from './register.jsx'
import Finished from './finished.jsx'

const Lesson = React.createClass({
  componentWillMount: function() {
    this.props.dispatch(clearData())
  },

  submitResponse: function(response) {
    const action = submitResponse(response);
    this.props.dispatch(action)
  },

  renderQuestionComponent: function () {
    if (this.props.question.currentQuestion) {
      return (<Question
                question={this.props.question.currentQuestion}
                submitResponse={this.submitResponse}
                prefill={this.getLesson().prefill}/>)
    }
  },

  questionsForLesson: function () {
    var questionsCollection = hashToCollection(this.props.questions.data)
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    return data[lessonID].questions.map((id) => {
      return _.find(questionsCollection, {key: id})
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
    this.props.dispatch(next);
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
    console.log("hey: ", this.props)
    if (this.props.playLesson && this.props.playLesson.answeredQuestions && this.props.playLesson.questionSet) {
      return this.props.playLesson.answeredQuestions.length / this.props.playLesson.questionSet.length * 100
    } else {
      0
    }

  },

  render: function () {
    // console.log("In the lesson.jsx file.")
    // console.log(this.props)
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    var component;
    var key;
    if (data[lessonID]) {
      if (this.props.playLesson.currentQuestion) {
        key = this.props.playLesson.currentQuestion
        component = (
          <PlayLessonQuestion key={this.props.playLesson.currentQuestion.key} question={this.props.playLesson.currentQuestion} nextQuestion={this.nextQuestion} prefill={this.getLesson().prefill}/>
        )
      }
      else if (this.props.playLesson.answeredQuestions.length > 0 && (this.props.playLesson.unansweredQuestions.length === 0 && this.props.playLesson.currentQuestion === undefined )) {
        component = (<Finished data={this.props.playLesson} lessonID={this.props.params.lessonID}/>)
      }
      else {
        component = (
          <Register lesson={this.getLesson()} startActivity={this.startActivity}/>
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
      return (<p>Loading...</p>)
    }
  }
})

function select(state) {
  return {
    lessons: state.lessons,
    questions: state.questions,
    playLesson: state.playLesson, //the questionReducer
    routing: state.routing
  }
}

export default connect(select)(Lesson)
