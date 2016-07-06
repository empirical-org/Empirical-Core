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
          <h2 className="title is-3">
            Welcome to Quill Connect!
          </h2>
          <h4 className="title is-5">
            In Quill Connect, you will combine sentences together to create compound and complex sentences.
          </h4>
          <h4 className="title is-5">
            There will always be more than one right answer!
          </h4>
          <h4 className="title is-5">
            You are joining the <span style={{fontWeight: '700'}}>{this.getLessonName()}</span> class.
          </h4>
          <p className="control">
            <input className="input" type="text" onChange={this.handleNameChange} placeholder="Enter your name"></input>
          </p>
          <button className="button is-primary" onClick={this.startActivity}>Start</button>
          <br/>
        </div>
      )
    }
  },

  render: function () {
    return (
      <section className="section is-fullheight minus-nav">
        {this.renderIntro()}
      </section>
    )
  }
})
