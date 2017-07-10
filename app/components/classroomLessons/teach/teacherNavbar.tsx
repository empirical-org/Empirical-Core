import React, { Component } from 'react';
import Tooltip from '../shared/tooltip'
const watchTeacherIcon = require('../../../img/watch_teacher_icon.svg')
const exitIcon = require('../../../img/exit_icon.svg')
const projectorIcon = require('../../../img/projector_icon.svg')
const helpIcon = require('../../../img/help_icon.svg')

class TeacherNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: '',
      showHelpDropdown: false
    }

    this.showTooltip = this.showTooltip.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
    this.renderTooltip = this.renderTooltip.bind(this)
    this.toggleHelpDropdown = this.toggleHelpDropdown.bind(this)
    this.hideHelpDropdown = this.hideHelpDropdown.bind(this)
  }

  presentStudentCount() {
    const presence = this.props.data.presence
    const numPresent = presence === undefined ? 0 : Object.keys(presence).filter((id) => presence[id] === true ).length
    const circleClassname = numPresent === 0 ? 'offline' : 'online'
    return <p className="present-student-count"><div className={circleClassname}/> {numPresent} Student{numPresent === 1 ? '': 's'} Online</p>
    );
  }

  showTooltip(icon:string) {
    this.setState({tooltip: icon})
  }

  hideTooltip(icon:string) {
    this.setState({tooltip: ''})
  }

  toggleHelpDropdown() {
    this.setState({showHelpDropdown: !this.state.showHelpDropdown})
  }

  hideHelpDropdown() {
    this.setState({showHelpDropdown: false})
  }

  renderTooltip(icon:string) {
    switch (icon) {
      case 'projector':
        if (this.state.tooltip === 'projector') {
          return <Tooltip text="Launch Projector" className={icon}/>
        }
        break
      case 'watchTeacher':
        if (this.state.tooltip === 'watchTeacher') {
          return <Tooltip text="Watch Teacher (On)" className={icon}/>
          }
        break
      case 'exit':
        if (this.state.tooltip === 'exit') {
          return <Tooltip text="Exit Lesson" className={icon}/>
        }
        break
      case 'help':
        if (this.state.tooltip === 'help' && !this.state.showHelpDropdown) {
          return <Tooltip text="Help" className={icon}/>
        }
        break
      default:
        break
    }

  }

  renderHelpDropdown() {
    if (this.state.showHelpDropdown) {
      return <div className='help-dropdown'>
        <i className="fa fa-caret-up"/>
        <p>Tutorial</p>
        <hr/>
        <p>How It Works</p>
        <hr/>
        <p>Teacher FAQ</p>
      </div>
    }
  }

  exitLesson() {
    if (window.confirm('Are you sure you want to exit the lesson?')) {
      document.location.href = process.env.EMPIRICAL_BASE_URL;
    }
  }

  render() {
    let projectorClass, watchTeacherClass, exitClass
    let helpClass = this.state.showHelpDropdown ? 'hover' : ''
    switch (this.state.tooltip) {
      case 'projector':
        projectorClass = "hover"
        break
      case 'watchTeacher':
        watchTeacherClass = "hover"
        break
      case 'exit':
        exitClass = "hover"
        break
      case 'help':
        helpClass = "hover"
        break
      default:
        break
    }

    return (
      <div className="lessons-teacher-navbar">
        <p className="lesson-title"><span>Lesson 1:</span> Conjunctions of Time</p>
        <span className="toolbar">
          {this.presentStudentCount()}
          <div
            onMouseEnter={() => this.showTooltip('projector')}
            onMouseLeave={this.hideTooltip}
          >
            <img src={projectorIcon} className={projectorClass}/>
            {this.renderTooltip('projector')}
          </div>
          <div
            onMouseEnter={() => this.showTooltip('watchTeacher')}
            onMouseLeave={this.hideTooltip}
          >
            <img src={watchTeacherIcon} className={watchTeacherClass}/>
            {this.renderTooltip('watchTeacher')}
          </div>
          <div
            onMouseEnter={() => this.showTooltip('exit')}
            onMouseLeave={this.hideTooltip}
            onClick={this.exitLesson}
          >
            <img src={exitIcon} className={exitClass}/>
            {this.renderTooltip('exit')}
          </div>
          <div
            onMouseEnter={() => this.showTooltip('help')}
            onMouseLeave={this.hideTooltip}
            onClick={this.toggleHelpDropdown}
            onBlur={this.hideHelpDropdown}
            tabIndex="0"
          >
            <img className={`help-icon ${helpClass}`} src={helpIcon}/>
            {this.renderTooltip('help')}
            {this.renderHelpDropdown()}
          </div>
        </span>
      </div>
    );
  }

}

export default TeacherNavbar;
