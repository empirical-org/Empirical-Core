import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'

class Navbar extends React.Component {
  state = {
    expanded: false
  };

  inLesson = () => {
    return (window.location.href.indexOf('play/lesson') !== -1);
  };

  navStyles = () => {
    if (this.state.expanded) {
      return {
        background: '#fff',
        display: 'initial'
      }
    }
  };

  reset = () => {
    this.setState({expanded: false})
  };

  toggle = () => {
    this.setState({expanded: !this.state.expanded})
  };

  renderLinks = () => {
    if (this.inLesson()) {
      return (
        <div className="nav-right nav-menu" style={this.navStyles()} />
      )
    } else {
      return (
        <div className="nav-right nav-menu" style={this.navStyles()}>
          <a className="nav-item" href="http://www.connect.quill.org/dwqa-questions/">FAQ</a>
          <Link activeClassName="is-active" className="nav-item" onClick={this.reset} to={'/play'}>Demo</Link>
          <Link activeClassName="is-active" className="nav-item" onClick={this.reset} to={'/results'}>Results</Link>
          <Link activeClassName="is-active" className="nav-item" onClick={this.reset} to={'/lessons'}>Activities</Link>
        </div>
      )
    }
  };

  render() {
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
}

function select(state) {
  return {
    routing: state.routing
  }
}

export default connect(select)(Navbar)
