import React from 'react'

export default React.createClass({
  startQuestion: function () {
    this.props.startQuestion()
  },

  strongComponent: function () {
    if (this.props.strongSentenceCount() > 0) {
      return (
        <h2 className="title is-3">
          ⚡⚡ You've written {this.props.strongSentenceCount()} strong sentences. ⚡⚡
        </h2>
      )
    }
  },

  render: function () {
    return (
      <section className="hero section is-fullheight minus-nav">
        <div className="hero-body">
          <div className="container has-text-centered">
            {this.strongComponent()}
            <h2 className="title is-3">
              🎯 Your Goal is to write {this.props.lesson.questions.length} strong sentences. 🎯
            </h2>
            <h4 className="title is-5">
              <button className="button is-primary is-large" onClick={this.startQuestion}>Continue</button>
            </h4>
          </div>
        </div>
      </section>
    )
  }
})
