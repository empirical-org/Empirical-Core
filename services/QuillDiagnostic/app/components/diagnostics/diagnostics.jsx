import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Diagnostics extends React.Component {
  renderList = () => {
    return (
      <div className="list" />
    )
  };

  render() {
    const { children } = this.props;
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
              {children}
            </div>
          </div>
        </div>
      </section>

    )
  }
}

function select(state) {
  return {
    concepts: state.concepts,
    routing: state.routing
  }
}

export default connect(select)(Diagnostics)
