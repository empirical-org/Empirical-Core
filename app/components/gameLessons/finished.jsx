import React from 'react'
import {Link} from 'react-router'
var C = require("../../constants").default
import rootRef from "../../libs/firebase"
const request = require('request')
const sessionsRef = rootRef.child('sessions')

export default React.createClass({
  componentDidMount: function () {
    console.log(this.props.activitySessionID)
    this.getConceptResults();
    const values = {
      name: this.props.data.name || "Anonymous",
      lessonID: this.props.lessonID,
      questions: this.props.data.answeredQuestions
    }
    var sessionRef = sessionsRef.push(values, (error) => {
      console.log("saved");
    })
  },

  getConceptResults: function () {
    console.log("Concept Results")
    const results = this.props.data.answeredQuestions.map((r) => {
      return {
        concept_uid: r.conceptID,
        metadata: {
          correct: 1
        }
      }
    })
    console.log(results)
    request(
      {url: 'http://localhost:3000/api/v1/activity_sessions/' + this.props.activitySessionID,
        method: 'PUT',
        json:
        {
          state: 'finished',
          concept_results: results,
          percentage: 1
        }
      },
      (err,httpResponse,body) => {
        if (httpResponse.statusCode === 200) {
          document.location.href = "http://localhost:3000/activity_sessions/" + this.props.activitySessionID
        }
        console.log(err,httpResponse,body)
      }
    )
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
          <p><Link to={'/play'} className="button is-primary is-outlined">Try Another Question</Link>
          <button onClick={this.getConceptResults}>save</button>
          </p>
        </div>
      </section>
    )
  }
})
