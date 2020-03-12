import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import {getParameterByName} from '../../libs/getParameterByName'

const Navbar = React.createClass({
  getInitialState: function () {
    return {
      expanded: false
    }
  },

  navStyles: function () {
    if (this.state.expanded) {
      return {
        background: '#fff',
        display: 'initial'
      }
    }
  },

  toggle: function () {
    this.setState({expanded: !this.state.expanded})
  },

  reset: function () {
    this.setState({expanded: false})
  },

  renderLinks: function () {
    return (
      <div className="nav-right nav-menu" style={this.navStyles()}>
        <a className="nav-item" href="http://www.connect.quill.org/dwqa-questions/">FAQ</a>
        <Link activeClassName="is-active" className="nav-item" onClick={this.reset} to={'/play'}>Demo</Link>
        <Link activeClassName="is-active" className="nav-item" onClick={this.reset} to={'/results'}>Results</Link>
        <Link activeClassName="is-active" className="nav-item" onClick={this.reset} to={'/lessons'}>Activities</Link>
      </div>
    )
  },

  render: function () {
      return (
        <header className="nav" style={{height: '65px'}}>
          <div className="container">
            <div className="nav-left">
              <a className="nav-item" href="http://www.connect.quill.org">
                <img
                  alt=""
                  src="http://45.55.217.62/wp-content/uploads/2016/04/quill_connect_logo2.png"
                  style={{height: "35px"}}
                />
              </a>
            </div>
            {this.renderLinks()}
            <span className="nav-toggle" onClick={this.toggle}>
              <span />
              <span />
              <span />
            </span>
          </div>
        </header>
    )
  }
})

function select(state) {
  return {
    routing: state.routing
  }
}

export default connect(select)(Navbar)
