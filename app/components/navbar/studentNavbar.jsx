import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'

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
        <a href="http://www.quill.org/profile/" className="nav-item" activeClassName="is-active">Save & Exit</a>
      </div>
    )
  },

  render: function () {
    return (
      <header className="nav student-nav" style={{height: '50px'}}>
        <div className="container">
          <div className="nav-left">
            <a href="http://www.connect.quill.org" className="nav-item">
              <img src="https://d2t498vi8pate3.cloudfront.net/assets/home-header-logo-8d37f4195730352f0055d39f7e88df602e2d67bdab1000ac5886c5a492400c9d.png"
                alt=""
                style={{height: "35px"}}/>
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

const rightNav = (<div className="nav-right nav-menu">
  <span className="nav-item">
    <Link to={'/admin'} className="nav-item" activeClassName="is-active">Admin</Link>
  </span>
  <span className="nav-item">
    <a href="#">
      Help
    </a>
  </span>
  <span className="nav-item">
    <a className="button" href="#">Button</a>
  </span>
</div>)

function select(state) {
  return {
    routing: state.routing
  }
}

export default connect(select)(Navbar)
