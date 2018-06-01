import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

const Diagnostics = React.createClass({
  renderList: function() {
    return (
      <div className="list"></div>
    )
  },
  render: function() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">
            <Link to={"/admin/diagnostics/new"}>
              <button
                className="button is-primary"
              >
                Create New Diagnostic
              </button>
            </Link>
          </h1>
          <div className="columns">
            <div className="column">
              <aside className="menu">
                <p className="menu-label">
                  Diagnostics
                </p>
                <ul className="menu-list">
                  {this.renderList()}
                </ul>
              </aside>
            </div>
            <div className="column">
              {this.props.children}
            </div>
          </div>
        </div>
      </section>

    )
  }
})

function select(state) {
  return {
    concepts: state.concepts,
    routing: state.routing
  }
}

export default connect(select)(Diagnostics)
