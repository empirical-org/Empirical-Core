import React from 'react'
import beginArrow from '../../img/begin_arrow.svg'
export default React.createClass({
  getInitialState: function () {
    return {
      showIntro: false,
      name: ''
    }
  },

  handleNameChange: function (e) {
    this.setState({name: e.target.value});
  },

  getLessonName: function () {
    return this.props.lesson.name
  },

  startActivity: function () {
    if (this.props.lesson.landingPageHtml) {
      this.setState({showIntro: true})
    } else {
      this.props.begin()
    }
  },

  leaveIntro: function () {
    this.props.begin(this.state.name)
  },


  render: function () {
    if (this.state.showIntro) {
      return (
        <div className="container">
          <div className="landing-page-html" dangerouslySetInnerHTML={{__html: this.props.lesson.landingPageHtml}}></div>
          <button className="button student-begin is-fullwidth" onClick={this.leaveIntro}>Start Lesson</button>
        </div>
      )
    } else {
      return (
        <div className="landing-page">
          <h1>You're testing new Quill Activities </h1>
          <p>
            You're about to answer questions about writing sentences.
            Please answer to the best of your ability.
          </p>
          <button className="button student-begin" onClick={this.startActivity}>
            Begin <img className="begin-arrow" src={beginArrow}/>
          </button>
        </div>
      )
    }
  },

})
