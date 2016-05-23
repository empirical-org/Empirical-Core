import React from 'react'
import {Link} from 'react-router'
var C = require("../../constants").default,
  Firebase = require("firebase")
const sessionsRef = new Firebase(C.FIREBASE).child('sessions')


export default React.createClass({
  componentDidMount: function () {
    const values = {
      name: this.props.data.name,
      lessonID: this.props.lessonID,
      questions: this.props.data.answeredQuestions
    }
    var sessionRef = sessionsRef.push(values, (error) => {
      console.log("saved");
    })
  },

  getLessonName: function () {
    return this.props.lesson.name
  },

  endActivity: function () {
    this.props.endActivity()
  },

  render: function () {
    return (
      <section className="section is-fullheight minus-nav">
        <div className="container">
          <h4>Thank you for playing</h4>
          <p>Thank you for alpha testing Quill Connect, an open source tool that helps students become better writers.</p>
          <p><Link to={'/play'} className="button is-primary is-outlined">Try Another Question</Link></p>
        </div>
      </section>
    )
  }
})
