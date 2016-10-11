import React from 'react'
import {Link} from 'react-router'
var C = require("../../constants").default
import rootRef from "../../libs/firebase"
const sessionsRef = rootRef.child('sessions')
import Spinner from '../shared/spinner.jsx'

export default React.createClass({
  getInitialState: function () {
    return {
      sessionKey: ''
    }
  },

  componentDidMount: function () {
    const values = {
      name: this.props.data.name,
      lessonID: this.props.lessonID,
      questions: this.props.data.answeredQuestions
    }
    var sessionRef = sessionsRef.push(values, (error) => {
      this.setState({sessionKey: sessionRef.key})
    })
    this.props.saveToLMS()
  },

  getLessonName: function () {
    return this.props.lesson.name
  },

  endActivity: function () {
    this.props.endActivity()
  },

  render: function () {
    return (
      <div className="landing-page">
        <h1>You've completed the lesson</h1>
        <p>
          Your results are being saved now.
          You'll be redirected automatically once they are saved.
        </p>
        <Spinner/>
      </div>
    )
  }
})
