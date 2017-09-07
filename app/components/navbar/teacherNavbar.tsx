declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import Tooltip from '../classroomLessons/shared/tooltip'
import { getParameterByName } from '../../libs/getParameterByName';
import {
  setWatchTeacherState,
  removeWatchTeacherState,
} from '../../actions/classroomSessions';
const watchTeacherIcon = require('../../img/watch_teacher_icon.svg')
const exitIcon = require('../../img/exit_icon.svg')
const projectorIcon = require('../../img/projector_icon.svg')
const helpIcon = require('../../img/help_icon.svg')
const flagIcon = require('../../img/flag_icon.svg')

class TeacherNavbar extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: '',
      showHelpDropdown: false,
      showFlagDropdown: false
    }

    this.presentStudentCount = this.presentStudentCount.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
    this.renderTooltip = this.renderTooltip.bind(this)
    this.toggleHelpDropdown = this.toggleHelpDropdown.bind(this)
    this.hideHelpDropdown = this.hideHelpDropdown.bind(this)
    this.toggleWatchTeacherMode = this.toggleWatchTeacherMode.bind(this)
    this.toggleFlagDropdown = this.toggleFlagDropdown.bind(this)
    this.hideFlagDropdown = this.hideFlagDropdown.bind(this)
    this.flagDropdown = this.flagDropdown.bind(this)
    this.launchProjector = this.launchProjector.bind(this)
  }

  presentStudentCount() {
    const presence = this.props.classroomSessions.data.presence
    const numPresent = presence === undefined ? 0 : Object.keys(presence).filter((id) => presence[id] === true ).length
    const circleClassname = numPresent === 0 ? 'offline' : 'online'
    return (
      <p className="present-student-count"><span className={circleClassname}/> {numPresent} Student{numPresent === 1 ? '': 's'} Online</p>
    )
  }

  showTooltip(e, icon:string) {
    this.setState({tooltip: icon})
  }

  hideTooltip(e) {
    this.setState({tooltip: ''})
  }

  toggleHelpDropdown() {
    // helpDropdown should not be toggled if watchTeacherState is true
    if (!this.props.classroomSessions.data.watchTeacherState) {
      this.setState({showHelpDropdown: !this.state.showHelpDropdown})
    }
  }

  hideHelpDropdown() {
    this.setState({showHelpDropdown: false})
  }

  toggleFlagDropdown() {
    this.setState({showFlagDropdown: !this.state.showFlagDropdown})
  }

  hideFlagDropdown() {
    this.setState({showFlagDropdown: false})
  }

  launchProjector() {
    window.open(window.location.href.replace('teach', 'play').concat('&projector=true'), 'newwindow', `width=${window.innerWidth},height=${window.innerHeight}`)
  }

  renderTooltip(icon:string) {
    const { watchTeacherState } = this.props.classroomSessions.data
    // tooltips should not show if either watchTeacherState or showHelpDropdown is true
    if (watchTeacherState) {
      if (icon === 'watchTeacher') {
        return (<Tooltip text={["Watch Teacher (", <strong key="watch-teacher-on">On</strong>,  ")"]} className={icon}/>)
      }
    } else if (!this.state.showHelpDropdown && !this.state.showFlagDropdown) {
      switch (icon) {
        case 'flag':
        if (this.state.tooltip === 'flag') {
          return (this.flagDropdown())
        }
        break
        case 'projector':
        if (this.state.tooltip === 'projector') {
          return (<Tooltip text="Launch Projector" className={icon}/>)
        }
        break
        case 'watchTeacher':
        if (this.state.tooltip === 'watchTeacher') {
          return (<Tooltip text={["Watch Teacher (", <strong key="watch-teacher-on">Off</strong>,  ")"]} className={icon}/>)
        }
        break
        case 'exit':
        if (this.state.tooltip === 'exit') {
          return (<Tooltip text="Save and Exit Lesson" className={icon}/>)
        }
        break
        case 'help':
        if (this.state.tooltip === 'help') {
          return this.helpDropdown()
        }
        break
        default:
        break
      }
    }
  }

  renderHelpDropdown() {
    if (this.state.showHelpDropdown) {
      return this.helpDropdown()
    }
  }

  helpDropdown() {
    return (
      <div className='help-dropdown'>
        <i className="fa fa-caret-up"/>
        <p><a target="_blank" href={`${process.env.EMPIRICAL_BASE_URL}/tutorials/lessons`}>How It Works</a></p>
        <p><a target="_blank" href={`${process.env.EMPIRICAL_BASE_URL}/tools/lessons#q-and-a`}>Quill Lessons - Q&A</a></p>
      </div>
    )
  }

  renderFlagDropdown() {
    if (this.state.showFlagDropdown) {
      return this.flagDropdown()
    }
  }

  flagDropdown() {
    const {flaggedStudents, students} = this.props.classroomSessions.data
    let content
    let oneRow
    if (flaggedStudents) {
      const flaggedStudentIds = Object.keys(flaggedStudents)
      const numberOfStudents = flaggedStudentIds.length
      numberOfStudents === 1 ? oneRow = true : null
      content = flaggedStudentIds.map((studentId, index) => {
        if (numberOfStudents - 1 === index) {
          return (<p key={index}>{students[studentId]}</p>)
        } else {
          return (<span key={index}>
          <p>{students[studentId]}</p>
          <hr/>
          </span>)
        }
      })
    } else {
      oneRow = true
      content = <p key='no-flagged-students' className="no-flagged-students">No Flagged Students</p>
    }
    const className = oneRow ? "flag-dropdown one-row" : "flag-dropdown"
    return <div className={className}>
      <i className="fa fa-caret-up"/>
      {content}
    </div>
  }

  exitLesson() {
    if (window.confirm('Are you sure you want to exit the lesson?')) {
      document.location.href = process.env.EMPIRICAL_BASE_URL || 'https://www.quill.org';
    }
  }

  toggleWatchTeacherMode() {
    const { watchTeacherState } = this.props.classroomSessions.data
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (watchTeacherState) {
      if (ca_id) {
        removeWatchTeacherState(ca_id);
      }
    } else {
      setWatchTeacherState(ca_id);
    }
  }

  previewBar() {
    const { preview } = this.props.classroomSessions.data
    if (preview === true) {
      const assignLink = `${process.env.EMPIRICAL_BASE_URL}/teachers/classrooms/assign_activities/create-unit?tool=lessons`
      const studentLink = window.location.href.replace('teach', 'play').concat('&student=student')
      return <div className="lessons-teacher-preview-bar">
        <p><i className="fa fa-eye" />You are <span>previewing</span> the teacher's view of Quill Lessons. <a href={assignLink}>Assign Quill Lessons</a> from your dashboard.</p>
        <a href={studentLink} target="_blank" className="student-link">Open Student View<i className="fa fa-external-link"/></a>
      </div>
    }
  }

  render() {
    const { watchTeacherState } = this.props.classroomSessions.data
    let projectorClass, exitClass;
    let helpClass = this.state.showHelpDropdown ? 'hover' : ''
    let flagClass = this.state.showFlagDropdown ? 'hover' : ''
    let watchTeacherClass = watchTeacherState ? 'hover' : ''
    if (!this.state.showHelpDropdown && !watchTeacherState && !this.state.showFlagDropdown)
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
      case 'flag':
        flagClass = "hover"
        break
      default:
        break
    }

    return (
      <div>
        {this.previewBar()}
        <div className="lessons-teacher-navbar">
          <p className="lesson-title"><span>Lesson {this.props.classroomLesson.data.lesson}:</span> {this.props.classroomLesson.data.title}</p>
          <span className="toolbar">
            {this.presentStudentCount()}
            <div
              onMouseEnter={(e) => this.showTooltip(e, 'flag')}
              onMouseLeave={(e) => this.hideTooltip(e)}
              onClick={this.toggleFlagDropdown}
              onBlur={this.hideFlagDropdown}
              tabIndex={0}
            >
              <img className={`flag-icon ${flagClass}`} src={flagIcon}/>
              {this.renderTooltip('flag')}
              {this.renderFlagDropdown()}
            </div>
            <div
              onMouseEnter={(e) => this.showTooltip(e, 'projector')}
              onMouseLeave={(e) => this.hideTooltip(e)}
              onClick={this.launchProjector}
            >
              <img src={projectorIcon} className={projectorClass}/>
              {this.renderTooltip('projector')}
            </div>
            <div
              onMouseEnter={(e) => this.showTooltip(e, 'watchTeacher')}
              onMouseLeave={(e) => this.hideTooltip(e)}
              onClick={this.toggleWatchTeacherMode}
            >
              <img src={watchTeacherIcon} className={watchTeacherClass}/>
              {this.renderTooltip('watchTeacher')}
            </div>
            <div
              onMouseEnter={(e) => this.showTooltip(e, 'exit')}
              onMouseLeave={(e) => this.hideTooltip(e)}
              onClick={this.exitLesson}
            >
              <img src={exitIcon} className={exitClass}/>
              {this.renderTooltip('exit')}
            </div>
            <div
              onMouseEnter={(e) => this.showTooltip(e, 'help')}
              onMouseLeave={(e) => this.hideTooltip(e)}
              onClick={this.toggleHelpDropdown}
              onBlur={this.hideHelpDropdown}
              tabIndex={0}
            >
              <img className={`help-icon ${helpClass}`} src={helpIcon}/>
              {this.renderTooltip('help')}
              {this.renderHelpDropdown()}
            </div>
          </span>
        </div>
      </div>
    );
  }

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
  };
}

export default connect(select)(TeacherNavbar);
