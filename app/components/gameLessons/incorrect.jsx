import React from 'react'

export default React.createClass({
  next: function () {
    this.props.next()
  },

  render: function () {
    return (
      <section className="hero section is-fullheight minus-nav">
        <div className="hero-body">
          <div className="container has-text-centered">

            <h2 className="title is-3">
              🏆That's not quite right! Which of these do you think is the best answer?:
            </h2>

            <h4 className="title is-5">
              <button className="button is-primary is-large" onClick={this.next}>Continue</button>
            </h4>
          </div>
        </div>
      </section>
    )
  }
})
