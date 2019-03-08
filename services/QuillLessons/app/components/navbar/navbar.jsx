import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import TeacherLessonsNavbar from './teacherNavbar'
import CustomizeNavbar from './customizeNavbar'
import LaunchEditionNavbar from './launchEditionNavbar'
import CreateCustomizedEditionNavbar from './createCustomizedEditionNavbar'
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

  inLesson: function () {
    return (window.location.href.indexOf('play/lesson') !== -1);
  },

  quillLessons: function() {
    return window.location.href.includes('teach/class-lessons');
  },

  customizeRoute: function() {
    return (window.location.href.indexOf('customize') !== -1);
  },

  customizeNavbar: function() {
    if (this.props.params.editionID) {
      return <CustomizeNavbar params={this.props.params} goToSuccessPage={this.props.goToSuccessPage}/>
    } else if (getParameterByName('classroom_unit_id') || getParameterByName('preview')) {
      return <LaunchEditionNavbar params={this.props.params}/>
    } else {
      return <CreateCustomizedEditionNavbar />
    }
  },

  renderLinks: function () {
    if (this.inLesson()) {
      return (
        <div className="nav-right nav-menu" style={this.navStyles()}>
        </div>
      )
    } else {
      return (
        <div className="nav-right nav-menu" style={this.navStyles()}>
          <a href="http://www.connect.quill.org/dwqa-questions/" className="nav-item">FAQ</a>
          <Link to={'/play'} className="nav-item" activeClassName="is-active" onClick={this.reset}>Demo</Link>
          <Link to={'/results'} className="nav-item" activeClassName="is-active" onClick={this.reset}>Results</Link>
          <Link to={'/lessons'} className="nav-item" activeClassName="is-active" onClick={this.reset}>Activities</Link>
        </div>
      )
    }
  },

  render: function () {
    if (this.quillLessons()) {
      return (<TeacherLessonsNavbar params={this.props.params}/>);
    } else if (this.customizeRoute()) {
      return this.customizeNavbar()
    } else {
      return (
        <header className="nav" style={{height: '65px'}}>
          <div className="container">
            <div className="nav-left">
              <a href="http://www.connect.quill.org" className="nav-item">
              <img src="http://45.55.217.62/wp-content/uploads/2016/04/quill_connect_logo2.png"
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
