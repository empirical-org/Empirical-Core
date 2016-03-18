import React from 'react'

export default React.createClass({
  componentDidMount: function () {
    console.log(this.props.params.id)
  },

  render: function () {
    return (
      <section className="section is-fullheight minus-nav">
        <div className="container">
          <h1 className="title">
            Lesson {this.props.params.id}
          </h1>
          <h2 className="subtitle">
            Ok, let's get started!
          </h2>
        </div>
      </section>
    )
  }
})
