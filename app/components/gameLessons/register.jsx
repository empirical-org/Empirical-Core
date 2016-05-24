import React from 'react'

export default React.createClass({
  getLessonName: function () {
    return this.props.lesson.name
  },

  startActivity: function () {
    this.props.startActivity()
  },

  renderNameInput: function () {
    return (
      <p className="control">
        <input className="input" type="text" ref="name" placeholder="Enter your name"></input>
      </p>
    )
  },

  render: function () {
    return (
      <section className="hero section is-fullheight minus-nav">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h2 className="title is-3">
              Welcome to Quill Connect!
            </h2>
            <h4 className="title is-5">
              In Quill Connect, you will combine sentences together to create compound and complex sentences.
            </h4>
            <h4 className="title is-5">
              There will always be more than one right answer!
            </h4>
            <img style={{maxHeight: '50vh', margin: '0 auto 20px'}} src={"http://i1.wp.com/www.connect.quill.org/wp-content/uploads/2016/04/animation.gif?fit=1100%2C265"}/>
            <h4 className="title is-5">
              <button className="button is-primary is-large" onClick={this.startActivity}>Start</button>
            </h4>
          </div>
        </div>
      </section>
    )
  }
})
