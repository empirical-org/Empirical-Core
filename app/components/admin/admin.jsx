import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render: function () {
    return (
      <section className="section is-fullheight minus-nav">
        <div className="container">
          <h1 className="title">
            Welcome to the Admin panel
          </h1>
          <h2 className="subtitle">
            Do you belong here?
          </h2>
        </div>
      </section>
    )
  }
})
