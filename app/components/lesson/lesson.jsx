import React from 'react'
import { connect } from 'react-redux'
import Question from '../question/question.jsx'
import {loadData, nextQuestion, submitResponse} from '../../actions.js'

const Lesson = React.createClass({
  componentWillMount: function () {
    // var data = require('../../libs/femaleTeacher.test.data').default
    // this.setState({question: data,
    //                feedback: undefined,
    //                correct: undefined
    //              })
    const action = loadData('classroom.data')
    this.props.dispatch(action);
    const next = nextQuestion();
    this.props.dispatch(next);
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

  render: function () {
    return (
      <section className="section is-fullheight minus-nav">
        <div className="container">
          <h2 className="title">
            Lesson {this.props.params.id}
          </h2>
          <h4 className="subtitle">
            Ok, let's get started!
          </h4>
          <br/>
          {this.renderQuestionComponent()}
        </div>
      </section>
    )
  }
})

function select(state) {
  return {
    question: state.question,
    routing: state.routing
  }
}

export default connect(select)(Lesson)
