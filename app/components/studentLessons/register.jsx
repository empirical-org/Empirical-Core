import React from 'react'

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
    if (this.props.lesson.introURL) {
      this.setState({showIntro: true})
    } else {
      this.props.startActivity(this.state.name)
    }
  },

  leaveIntro: function () {
    this.props.startActivity(this.state.name)
  },

  renderIntro: function () {
    if (this.state.showIntro) {
      return (
        <div className="container">
          <button className="button is-primary intro-next-button" onClick={this.leaveIntro}>Start Lesson</button>

          <iframe className="intro-slides"  src={this.props.lesson.introURL}/>
        </div>
      )
    } else {
      return (
        <div className="container">
          <h2 className="title is-3 register">
            Welcome to Quill Connect!
          </h2>
          <img style={{maxHeight: '50vh', margin: '0 auto 20px', display: 'block'}} src={"http://i1.wp.com/www.connect.quill.org/wp-content/uploads/2016/04/animation.gif?fit=1100%2C265"}/>
          <div className="register-container">
            <ul className="register-list">
              <li>Combine the sentences together into one sentence.</li>
              <li>You may add or remove words.</li>
              <li>There is often more than one correct answer.</li>
              <li>Remember to use correct spelling, capitalization, and punctuation!</li>
            </ul>
            <button className="button student-begin is-fullwidth" onClick={this.startActivity}>Start</button>
            <br/>
          </div>
        </div>
      )
    }
  },

  render: function () {
    return (
      <section className="student" style={{
        paddingTop: 20
      }}>
        {this.renderIntro()}
      </section>
    )
  }
})
