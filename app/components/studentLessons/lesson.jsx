import React from 'react'
import { connect } from 'react-redux'
import Question from '../question/question.jsx'
import {loadData, nextQuestion, submitResponse} from '../../actions.js'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import Register from './register.jsx'

const Lesson = React.createClass({
  componentWillMount: function () {
    // var data = require('../../libs/femaleTeacher.test.data').default
    // this.setState({question: data,
    //                feedback: undefined,
    //                correct: undefined
    //              })
    // const action = loadData('classroom.data')
    // this.props.dispatch(action);
    // const next = nextQuestion();
    // this.props.dispatch(next);
  },

  submitResponse: function(response) {
    const action = submitResponse(response);
    this.props.dispatch(action)
  },

  renderQuestionComponent: function () {
    if (this.props.question.currentQuestion) {
      return (<Question
                question={this.props.question.currentQuestion}
                submitResponse={this.submitResponse}/>)
    }
  },

  questionsForLesson: function () {
    var questionsCollection = hashToCollection(this.props.questions.data)
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    return data[lessonID].questions.map((id) => {
      return _.find(questionsCollection, {key: id})
    })
  },

  startActivity: function () {
    const action = loadData(this.questionsForLesson())
    this.props.dispatch(action);
    const next = nextQuestion();
    this.props.dispatch(next);
  },

  getLesson: function () {
    return this.props.lessons.data[this.props.params.lessonID]
  },

  getLessonName: function () {
    return this.props.lessons.data[this.props.params.lessonID].name
  },

  render: function () {
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    if (data[lessonID]) {
      return (
        <Register lesson={this.getLesson()}/>
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
    playLesson: state.playLesson,
    routing: state.routing
  }
}

export default connect(select)(Lesson)
