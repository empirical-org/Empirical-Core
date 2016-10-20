import React from 'react'
import _ from 'underscore'

export default React.createClass({
  getInitialState: function (){
    return {
      selected: undefined
    }
  },

  selectAnswer: function (key) {
    if ( true || !this.state.selected) {
      this.setState({selected: key})
    }
  },

  getSelectedAnswer: function () {
    return _.find(this.props.answers, (answer) => {
      return answer.key === this.state.selected
    })
  },

  next: function () {
    this.props.next()
  },

  buttonClasses: function(answer) {
    if (!this.state.selected) {
      return " is-outlined"
    }
    if (answer.optimal) {
      return " is-info"
    }
    return " is-danger"
  },

  renderSubmission: function (answer) {
    if (this.state.selected) {
      if (this.state.selected === answer.key) {
        if (answer.optimal) {
          return (
            <span style={{marginLeft: 10}}>✓</span>
          )
        } else {
          return (
            <span style={{marginLeft: 10}}>✗</span>
          )
        }
      }
    }
  },

  renderOptions: function () {
    const components = this.props.answers.map((answer) => {
      return (
        <li key={answer.key}>
          <a
            className={"button lesson-multiple-choice-button" + this.buttonClasses(answer)}
            onClick={this.selectAnswer.bind(null, answer.key)}>
            {answer.text} {this.renderSubmission(answer)}
          </a>
        </li>
      )
    })
    return (
      <ul className="lesson-multiple-choice">
        {components}
      </ul>
    )
  },

  renderContinueButton: function () {
    if (this.state.selected) {
      const buttonClass = this.getSelectedAnswer().optimal ? " is-primary" : " is-warning"
      return (
        <h4 className="title is-5">
          <button className={"button is-large" + buttonClass} onClick={this.next}>Continue </button>
        </h4>
      )
    }
  },

  render: function () {
    return (
      <section className="student-container">
        <div className="content multiple-choice-content">
          {this.props.prompt}

          <p className="multiple-choice-prompt">
            There are two strong sentences below. Which one do you think is the strongest?
          </p>
          {this.renderOptions()}
          {this.renderContinueButton()}
        </div>
      </section>
    )
  }
})
