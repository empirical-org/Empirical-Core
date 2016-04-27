import React from 'react'

export default React.createClass({
  getLessonName: function () {
    return this.props.lesson.name
  },

  render: function () {
    return (
      <section className="section is-fullheight minus-nav">
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
            <input className="input" type="text" placeholder="Enter your name"></input>
          </p>
          <button className="button is-primary" onClick={this.startActivity}>Start</button>
          <br/>
        </div>
      </section>
    )
  }
})
