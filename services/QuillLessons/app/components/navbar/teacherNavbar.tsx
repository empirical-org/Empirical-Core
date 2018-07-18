declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import Tooltip from '../classroomLessons/shared/tooltip'
import { getParameterByName } from '../../libs/getParameterByName';
import {
  setWatchTeacherState,
  removeWatchTeacherState,
  unpinActivityOnSaveAndExit,
  showSignupModal
} from '../../actions/classroomSessions';
import {
  createNewEdition
} from '../../actions/customize';
const watchTeacherIcon = 'https://assets.quill.org/images/icons/watch_teacher_icon.svg'
const exitIcon = 'https://assets.quill.org/images/icons/save_exit_icon.svg'
const projectorIcon = 'https://assets.quill.org/images/icons/projector_icon.svg'
const helpIcon = 'https://assets.quill.org/images/icons/help_icon.svg'
const flagIcon = 'https://assets.quill.org/images/icons/list_flagged_students_icon.svg'
const pdfIcon = 'https://assets.quill.org/images/icons/download_pdf_icon.svg'

class TeacherNavbar extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: '',
      showHelpDropdown: false,
      showFlagDropdown: false,
      showCustomizeDropdown: false
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
    this.toggleCustomizeDropdown = this.toggleCustomizeDropdown.bind(this)
    this.hideCustomizeDropdown = this.hideCustomizeDropdown.bind(this)
    this.flagDropdown = this.flagDropdown.bind(this)
    this.launchProjector = this.launchProjector.bind(this)
    this.renderEditLink = this.renderEditLink.bind(this)
    this.switchOnClick = this.switchOnClick.bind(this)
    this.redirectToEdit = this.redirectToEdit.bind(this)
    this.redirectToSwitchEdition = this.redirectToSwitchEdition.bind(this)
  }

  renderCustomizedEditionsTag() {
    const {editions} = this.props.customize
    const customEdition = Object.keys(editions).find(e => {
      return editions[e].lesson_id === this.props.params.lessonID && editions[e].user_id !== 'quill-staff'
    })
    if (customEdition) {
      return <div className="custom-editions-tag">Customized</div>
    }
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

  toggleCustomizeDropdown() {
    this.setState({showCustomizeDropdown: !this.state.showCustomizeDropdown})
  }

  hideCustomizeDropdown() {
    this.setState({showCustomizeDropdown: false})
  }

  launchProjector() {
    window.open(window.location.href.replace('teach', 'play').concat('&projector=true'), 'newwindow', `width=${window.innerWidth},height=${window.innerHeight}`)
  }

  renderTooltip(icon:string) {
    const { watchTeacherState } = this.props.classroomSessions.data
    // tooltips should not show if either watchTeacherState or showHelpDropdown is true
    if (watchTeacherState) {
      if (icon === 'watchTeacher') {
        return (<Tooltip text={["Watch Teacher - ", <strong key="watch-teacher-on">On</strong>]} className={icon}/>)
      }
    } else if (!this.state.showHelpDropdown && !this.state.showFlagDropdown && !this.state.showCustomizeDropdown) {
      switch (icon) {
        case 'customize':
          if (this.state.tooltip === 'customize') {
            return (this.customizeDropdown())
          }
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
            return (<Tooltip text={["Watch Teacher - ", <strong key="watch-teacher-on">Off</strong>]} className={icon}/>)
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
        case 'pdf':
          if (this.state.tooltip === 'pdf') {
            return <Tooltip text="Download Lesson Plan" className={icon}/>
          }
        default:
          break
      }
    }
  }

  renderPDFLink() {
    if (this.props.classroomSessions.data.supportingInfo) {
      const className = this.state.tooltip === 'pdf' ? 'hover' : ''
      return <a
        target="_blank"
        href={`${process.env.EMPIRICAL_BASE_URL}/activities/${this.props.params.lessonID}/supporting_info`}
        onMouseEnter={(e) => this.showTooltip(e, 'pdf')}
        onMouseLeave={(e) => this.hideTooltip(e)}
        >
          <img className={className} src={pdfIcon}/>
          {this.renderTooltip('pdf')}
      </a>
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
        <a target="_blank" href={`${process.env.EMPIRICAL_BASE_URL}/tutorials/lessons?nocta=true`}><p>Tutorial</p></a>
        <a target="_blank" href="https://support.quill.org/using-quill-tools#quill-lessons"><p>Quill Lessons - Q&A</p></a>
      </div>
    )
  }

  renderCustomizeDropdown() {
    if (this.state.showCustomizeDropdown) {
      return this.customizeDropdown()
    }
  }

  renderEditLink() {
    let action, editText
    const classroomActivityID = getParameterByName('classroom_activity_id')
    if (this.props.customize.user_id && classroomActivityID) {
      const lessonID:string = this.props.params.lessonID
      const editionID:string = this.props.classroomSessions.data.edition_id
      if (editionID && this.props.customize.editions[editionID] && this.props.customize.editions[editionID].user_id === this.props.customize.user_id) {
        action = () => {this.redirectToEdit(lessonID, editionID, classroomActivityID)}
        editText = 'Edit This Edition'
      } else {
        action = () => {createNewEdition(editionID, lessonID, this.props.customize.user_id, classroomActivityID, this.redirectToEdit)}
        editText = 'Make A Copy'
      }
    } else {
      action = () => {this.props.dispatch(showSignupModal())}
      editText = 'Make A Copy'
    }
    return <a onClick={action}><p>{editText}</p></a>
  }

  switchOnClick() {
    if (this.props.customize.user_id) {
      const lessonID: string = this.props.params.lessonID
      const classroomActivityID = getParameterByName('classroom_activity_id')
      if (classroomActivityID) {
        this.redirectToSwitchEdition(lessonID, classroomActivityID)
      }
    } else {
      this.props.dispatch(showSignupModal())
    }
  }

  redirectToEdit(lessonID:string, editionID:string, classroomActivityID:string) {
    window.location.href = `#/customize/${this.props.params.lessonID}/${editionID}?&classroom_activity_id=${classroomActivityID}`
  }

  redirectToSwitchEdition(lessonID:string, classroomActivityID:string) {
    window.location.href =`#/customize/${lessonID}?&classroom_activity_id=${classroomActivityID}`
  }

  customizeDropdown() {
    const editText = this.props.classroomSessions.data.edition_id ? 'Edit This Edition' : 'Make A Copy'
    return (
      <div className='customize-dropdown'>
        <i className="fa fa-caret-up"/>
        {this.renderEditLink()}
        <a onClick={this.switchOnClick}><p>Switch Edition</p></a>
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
      content = <span><p key='no-flagged-students' className="no-flagged-students">No Flagged Students</p><p key="explanation" className="explanation">Flag students based on their performance for small group instruction.</p></span>
    }
    const className = oneRow ? "flag-dropdown one-row" : "flag-dropdown"
    return <div className={className}>
      <i className="fa fa-caret-up"/>
      {content}
    </div>
  }

  exitLesson() {
    if (window.confirm('Are you sure you want to exit the lesson?')) {
      const classroomUnitId: string|null = getParameterByName('classroom_unit_id');
      const activityId = this.props.params.lessonID;

      unpinActivityOnSaveAndExit(activityId, classroomUnitId)
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
        <p><i className="fa fa-eye" />You are previewing the teacher's view of Quill Lessons. <a href={assignLink} target="_blank">Assign Quill Lessons</a> from your dashboard.</p>
        <a href={studentLink} target="_blank" className="student-link">Open Student View<i className="fa fa-external-link"/></a>
      </div>
    }
  }

  render() {
    const { watchTeacherState } = this.props.classroomSessions.data
    let projectorClass, exitClass;
    let customizeClass = this.state.showCustomizeDropdown ? 'hover' : ''
    let helpClass = this.state.showHelpDropdown ? 'hover' : ''
    let flagClass = this.state.showFlagDropdown ? 'hover' : ''
    let watchTeacherClass = watchTeacherState ? 'hover' : ''
    if (!this.state.showHelpDropdown && !watchTeacherState && !this.state.showFlagDropdown)
    switch (this.state.tooltip) {
      case 'customize':
        customizeClass = "hover"
        break
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
          <div className="lesson-title"><p><span>Lesson {this.props.classroomLesson.data.lesson}:</span> {this.props.classroomLesson.data.title}</p> {this.renderCustomizedEditionsTag()}</div>
          <span className="toolbar">
            {this.presentStudentCount()}
            <div
              onMouseEnter={(e) => this.showTooltip(e, 'customize')}
              onMouseLeave={(e) => this.hideTooltip(e)}
              onClick={this.toggleCustomizeDropdown}
              onBlur={this.hideCustomizeDropdown}
              tabIndex={0}
            >
              <i className={`${customizeClass} fa fa-icon fa-magic`}/>
              {this.renderCustomizeDropdown()}
              {this.renderTooltip('customize')}
            </div>
            <div>
              {this.renderPDFLink()}
            </div>
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
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(TeacherNavbar);
