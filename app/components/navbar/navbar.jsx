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

  inLesson: function () {
    return (window.location.href.indexOf('play/lesson') !== -1);
  },

  renderLinks: function () {
    if (this.inLesson()) {
      return (
        <div className="header-right header-menu" style={this.navStyles()}>
          <a href="http://www.connect.quill.org/dwqa-questions/" className="header-tab" activeClassName="is-active">FAQ</a>
          <Link to={'/play'} className="header-tab" activeClassName="is-active" onClick={this.reset}>Demo</Link>
        </div>
      )
    } else {
      return (
        <div className="header-right header-menu" style={this.navStyles()}>
          <a href="http://www.connect.quill.org/dwqa-questions/" className="header-tab" activeClassName="is-active">FAQ</a>
          <Link to={'/play'} className="header-tab" activeClassName="is-active" onClick={this.reset}>Demo</Link>
          <Link to={'/results'} className="header-tab" activeClassName="is-active" onClick={this.reset}>Results</Link>
        </div>
      )
    }
  },

  render: function () {
    return (
      <header className="header" style={{height: '65px'}}>
        <div className="container">
          <div className="header-left">
            <a href="http://www.connect.quill.org" className="header-item">
              <img src="http://45.55.217.62/wp-content/uploads/2016/04/quill_connect_logo2.png"
                alt=""
                style={{height: "35px"}}/>
            </a>
          </div>
          {this.renderLinks()}
          <span className="header-toggle" onClick={this.toggle}>
            <span />
            <span />
            <span />
          </span>
        </div>
      </header>
    )
  }
})

const rightNav = (<div className="header-right header-menu">
  <span className="header-item">
    <Link to={'/admin'} className="header-item" activeClassName="is-active">Admin</Link>
  </span>
  <span className="header-item">
    <a href="#">
      Help
    </a>
  </span>
  <span className="header-item">
    <a className="button" href="#">Button</a>
  </span>
</div>)

function select(state) {
  return {
    routing: state.routing
  }
}

export default connect(select)(Navbar)
