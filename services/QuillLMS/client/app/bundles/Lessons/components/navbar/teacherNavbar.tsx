declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

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
import {
  ClassroomSessionId,
  ClassroomUnitId
} from '../classroomLessons/interfaces'

const watchTeacherIcon = 'https://assets.quill.org/images/icons/watch_teacher_icon.svg'
const exitIcon = 'https://assets.quill.org/images/icons/save_exit_icon.svg'
const projectorIcon = 'https://assets.quill.org/images/icons/projector_icon.svg'
const helpIcon = 'https://assets.quill.org/images/icons/help_icon.svg'
const flagIcon = 'https://assets.quill.org/images/icons/list_flagged_students_icon.svg'
const pdfIcon = 'https://assets.quill.org/images/icons/download_pdf_icon.svg'

const CUSTOMIZE = 'customize'
const FLAG = 'flag'
const PROJECTOR = 'projector'
const WATCH_TEACHER = 'watch_teacher'
const EXIT = 'exit'
const HELP = 'help'
const PDF = 'pdf'

const HOVER = 'hover'

class TeacherNavbar extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.match.params.lessonID

    this.state = {
      tooltip: '',
      showHelpDropdown: false,
      showFlagDropdown: false,
      showCustomizeDropdown: false,
      classroomUnitId,
      classroomSessionId: classroomUnitId ? classroomUnitId.concat(activityUid) : null
    }

    this.presentStudentCount = this.presentStudentCount.bind(this)
    this.renderTooltip = this.renderTooltip.bind(this)
    this.flagDropdown = this.flagDropdown.bind(this)
    this.renderEditLink = this.renderEditLink.bind(this)
    this.redirectToEdit = this.redirectToEdit.bind(this)
    this.redirectToSwitchEdition = this.redirectToSwitchEdition.bind(this)
    this.handleExitLessonClick = this.handleExitLessonClick.bind(this)
  }

  renderCustomizedEditionsTag() {
    const { match, customize, } = this.props
    const { params, } = match
    const { editions, } = customize
    const customEdition = Object.keys(editions).find(e => {
      return editions[e].lesson_id === params.lessonID && editions[e].user_id !== 'quill-staff'
    })
    if (customEdition) {
      return (<div className="custom-editions-tag">Customized</div>)
    }
  }

  presentStudentCount() {
    const { classroomSessions, } = this.props
    const { presence } = classroomSessions.data
    const numPresent = presence === undefined ? 0 : Object.keys(presence).filter((id) => presence[id] === true ).length
    const circleClassname = numPresent === 0 ? 'offline' : 'online'
    return (
      <p className="present-student-count"><span className={circleClassname} /> {numPresent} Student{numPresent === 1 ? '': 's'} Online</p>
    )
  }

  showTooltip = (icon:string) => this.setState({tooltip: icon})

  handleMouseLeaveTooltip = () => this.setState({tooltip: ''})

  handleMouseEnterPDFIcon = () => this.showTooltip(PDF)

  handleMouseEnterFlagIcon = () => this.showTooltip(FLAG)

  handleMouseEnterProjectorIcon = () => this.showTooltip(PROJECTOR)

  handleMouseEnterWatchTeacherIcon = () => this.showTooltip(WATCH_TEACHER)

  handleMouseEnterExitIcon = () => this.showTooltip(EXIT)

  handleMouseEnterHelpIcon = () => this.showTooltip(HELP)

  handleMouseEnterCustomizeIcon = () => this.showTooltip(CUSTOMIZE)

  handleHelpDropdownClick = () => {
    const { classroomSessions, } = this.props
    // helpDropdown should not be toggled if watchTeacherState is true
    if (!classroomSessions.data.watchTeacherState) {
      this.setState(prevState => ({showHelpDropdown: !prevState.showHelpDropdown}));
    }
  }

  handleHelpDropdownBlur = () => this.setState({showHelpDropdown: false})

  handleFlagDropdownClick = () => this.setState(prevState => ({showFlagDropdown: !prevState.showFlagDropdown}));

  handleFlagDropdownBlur = () => this.setState({showFlagDropdown: false})

  handleCustomizeDropdownClick = () => this.setState(prevState => ({showCustomizeDropdown: !prevState.showCustomizeDropdown}));

  handleCustomizeDropdownBlur = () => this.setState({showCustomizeDropdown: false})

  handleProjectorClick = () => window.open(window.location.href.replace('teach', 'play').concat('&projector=true'), 'newwindow', `width=${window.innerWidth},height=${window.innerHeight}`)

  renderTooltip(icon:string) {
    const { tooltip, showHelpDropdown, showFlagDropdown, showCustomizeDropdown, } = this.state
    const { classroomSessions, } = this.props
    const { watchTeacherState } = classroomSessions.data
    // tooltips should not show if either watchTeacherState or showHelpDropdown is true
    if (watchTeacherState) {
      if (icon === WATCH_TEACHER) {
        return (<Tooltip className={icon} text={["Watch Teacher - ", <strong key="watch-teacher-on">On</strong>]} />)
      }
    } else if (!showHelpDropdown && !showFlagDropdown && !showCustomizeDropdown) {
      switch (icon) {
        case CUSTOMIZE:
          if (tooltip === CUSTOMIZE) {
            return (this.customizeDropdown())
          }
        case FLAG:
          if (tooltip === FLAG) {
            return (this.flagDropdown())
          }
          break
        case PROJECTOR:
          if (tooltip === PROJECTOR) {
            return (<Tooltip className={icon} text="Launch Projector" />)
          }
          break
        case WATCH_TEACHER:
          if (tooltip === WATCH_TEACHER) {
            return (<Tooltip className={icon} text={["Watch Teacher - ", <strong key="watch-teacher-on">Off</strong>]} />)
          }
          break
        case EXIT:
          if (tooltip === EXIT) {
            return (<Tooltip className={icon} text="Save and Exit Lesson" />)
          }
          break
        case HELP:
          if (tooltip === HELP) {
            return this.helpDropdown()
          }
          break
        case PDF:
          if (tooltip === PDF) {
            return <Tooltip className={icon} text="Download Lesson Plan" />
          }
        default:
          break
      }
    }
  }

  renderPDFLink() {
    const { classroomSessions, match, } = this.props
    const { params, } = match
    const { tooltip, } = this.state

    if (classroomSessions.data.supportingInfo) {
      const className = tooltip === PDF ? HOVER : ''
      /* eslint-disable react/jsx-no-target-blank */
      return (
        <a
          href={`${process.env.DEFAULT_URL}/activities/${params.lessonID}/supporting_info`}
          onMouseEnter={this.handleMouseEnterPDFIcon}
          onMouseLeave={this.handleMouseLeaveTooltip}
          target="_blank"
        >
          <img alt="" className={className} src={pdfIcon} />
          {this.renderTooltip(PDF)}
        </a>
      )
      /* eslint-enable react/jsx-no-target-blank */
    }
  }

  renderHelpDropdown() {
    const { showHelpDropdown, } = this.state
    if (!showHelpDropdown) { return}

    return this.helpDropdown()
  }

  helpDropdown() {
    /* eslint-disable react/jsx-no-target-blank */
    return (
      <div className='help-dropdown'>
        <i className="fa fa-caret-up" />
        <a href={`${process.env.DEFAULT_URL}/tutorials/lessons?nocta=true`} target="_blank"><p>Tutorial</p></a>
        <a href="https://support.quill.org/using-quill-tools#quill-lessons" target="_blank"><p>Quill Lessons - Q&A</p></a>
      </div>
    )
    /* eslint-enable react/jsx-no-target-blank */
  }

  renderCustomizeDropdown() {
    const { showCustomizeDropdown, } = this.state
    if (!showCustomizeDropdown) { return}

    return this.customizeDropdown()
  }

  renderEditLink() {
    const { customize, match, classroomSessions, dispatch, } = this.props
    const { params, } = match
    let action, editText
    const classroomUnitId = getParameterByName('classroom_unit_id')
    if (customize.user_id && classroomUnitId) {
      const lessonID:string = params.lessonID
      const editionID:string = classroomSessions.data.edition_id
      if (editionID && customize.editions[editionID] && customize.editions[editionID].user_id === customize.user_id) {
        action = () => {this.redirectToEdit(lessonID, editionID, classroomUnitId)}
        editText = 'Edit This Edition'
      } else {
        action = () => {
          createNewEdition(
            editionID,
            lessonID,
            customize.user_id,
            classroomUnitId,
            this.redirectToEdit
          )
        }
        editText = 'Make A Copy'
      }
    } else {
      action = () => dispatch(showSignupModal())
      editText = 'Make A Copy'
    }
    return <button className="interactive-wrapper focus-on-light" onClick={action} type="button"><p>{editText}</p></button>
  }

  handleSwitchEditionClick = () => {
    const { customize, match, dispatch, } = this.props
    const { params, } = match

    if (customize.user_id) {
      const lessonID: string = params.lessonID
      const classroomUnitId = getParameterByName('classroom_unit_id')
      if (classroomUnitId) {
        this.redirectToSwitchEdition(lessonID, classroomUnitId)
      }
    } else {
      dispatch(showSignupModal())
    }
  }

  redirectToEdit(lessonID:string, editionID:string, classroomUnitId:string) {
    const { match, } = this.props
    const { params, } = match
    window.location.href = `#/customize/${params.lessonID}/${editionID}?&classroom_unit_id=${classroomUnitId}`
  }

  redirectToSwitchEdition(lessonID:string, classroomUnitId:string) {
    window.location.href =`#/customize/${lessonID}?&classroom_unit_id=${classroomUnitId}`
  }

  customizeDropdown() {
    return (
      <div className='customize-dropdown'>
        <i className="fa fa-caret-up" />
        {this.renderEditLink()}
        <button className="interactive-wrapper focus-on-light" onClick={this.handleSwitchEditionClick} type="button"><p>Switch Edition</p></button>
      </div>
    )
  }

  renderFlagDropdown() {
    const { showFlagDropdown, } = this.state
    if (!showFlagDropdown) { return }
    return this.flagDropdown()
  }

  flagDropdown() {
    const { classroomSessions, } = this.props
    const { flaggedStudents, students } = classroomSessions.data
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
          return (
            <span key={index}>
              <p>{students[studentId]}</p>
              <hr />
            </span>
          )
        }
      })
    } else {
      oneRow = true
      content = <span><p className="no-flagged-students" key='no-flagged-students'>No Flagged Students</p><p className="explanation" key="explanation">Flag students based on their performance for small group instruction.</p></span>
    }
    const className = oneRow ? "flag-dropdown one-row" : "flag-dropdown"
    return (
      <div className={className}>
        <i className="fa fa-caret-up" />
        {content}
      </div>
    )
  }

  handleExitLessonClick = () => {
    const { match, } = this.props
    const { params, } = match
    const classroomUnitId = getParameterByName('classroom_unit_id') || '';
    const shouldExit = window.confirm('Are you sure you want to exit the lesson?')

    if (shouldExit) {
      unpinActivityOnSaveAndExit(params.lessonID, classroomUnitId)
      document.location.href = process.env.DEFAULT_URL || 'https://www.quill.org';
    }
  }

  handleWatchTeacherClick = () => {
    const { classroomSessionId, } = this.state
    const { classroomSessions, } = this.props
    const { watchTeacherState } = classroomSessions.data

    if (watchTeacherState) {
      if (classroomSessionId) {
        removeWatchTeacherState(classroomSessionId);
      }
    } else {
      setWatchTeacherState(classroomSessionId);
    }
  }

  previewBar() {
    const { classroomSessions, } = this.props
    const { preview } = classroomSessions.data
    if (preview === true) {
      const assignLink = `${process.env.DEFAULT_URL}/assign/activity-library?activityClassificationFilters[]=lessons`
      const studentLink = window.location.href.replace('teach', 'play').concat('&student=student')
      /* eslint-disable react/jsx-no-target-blank */
      return (
        <div className="lessons-teacher-preview-bar">
          <p><i className="fa fa-eye" />You are previewing the teacher&#39;s view of Quill Lessons. <a href={assignLink} target="_blank">Assign Quill Lessons</a> from your dashboard.</p>
          <a className="student-link" href={studentLink} target="_blank">Open Student View<i className="fa fa-external-link" /></a>
        </div>
      )
      /* eslint-enable react/jsx-no-target-blank */
    }
  }

  render() {
    const { showHelpDropdown, tooltip, showFlagDropdown, showCustomizeDropdown, } = this.state
    const { classroomSessions, classroomLesson, } = this.props
    const { watchTeacherState } = classroomSessions.data
    let projectorClass, exitClass;
    let customizeClass = showCustomizeDropdown ? HOVER : ''
    let helpClass = showHelpDropdown ? HOVER : ''
    let flagClass = showFlagDropdown ? HOVER : ''
    let watchTeacherClass = watchTeacherState ? HOVER : ''

    if (!showHelpDropdown && !watchTeacherState && !showFlagDropdown) {
      switch (tooltip) {
        case CUSTOMIZE:
          customizeClass = HOVER
          break
        case PROJECTOR:
          projectorClass = HOVER
          break
        case WATCH_TEACHER:
          watchTeacherClass = HOVER
          break
        case EXIT:
          exitClass = HOVER
          break
        case HELP:
          helpClass = HOVER
          break
        case FLAG:
          flagClass = HOVER
          break
        default:
          break
      }
    }

    return (
      <div>
        {this.previewBar()}
        <div className="lessons-teacher-navbar">
          <div className="lesson-title"><p><span>Lesson {classroomLesson.data.lesson}:</span> {classroomLesson.data.title}</p> {this.renderCustomizedEditionsTag()}</div>
          <span className="toolbar">
            {this.presentStudentCount()}
            <button
              className="interactive-wrapper focus-on-dark"
              onBlur={this.handleCustomizeDropdownBlur}
              onClick={this.handleCustomizeDropdownClick}
              onMouseEnter={this.handleMouseEnterCustomizeIcon}
              onMouseLeave={this.handleMouseLeaveTooltip}
              type="button"
            >
              <i className={`${customizeClass} fa fa-icon fa-magic`} />
              {this.renderCustomizeDropdown()}
              {this.renderTooltip(CUSTOMIZE)}
            </button>
            <div>
              {this.renderPDFLink()}
            </div>
            <button
              className="interactive-wrapper focus-on-dark"
              onBlur={this.handleFlagDropdownBlur}
              onClick={this.handleFlagDropdownClick}
              onMouseEnter={this.handleMouseEnterFlagIcon}
              onMouseLeave={this.handleMouseLeaveTooltip}
              type="button"
            >
              <img alt="" className={`flag-icon ${flagClass}`} src={flagIcon} />
              {this.renderTooltip(FLAG)}
              {this.renderFlagDropdown()}
            </button>
            <button
              className="interactive-wrapper focus-on-dark"
              onClick={this.handleProjectorClick}
              onMouseEnter={this.handleMouseEnterProjectorIcon}
              onMouseLeave={this.handleMouseLeaveTooltip}
              type="button"
            >
              <img alt="" className={projectorClass} src={projectorIcon} />
              {this.renderTooltip(PROJECTOR)}
            </button>
            <button
              className="interactive-wrapper focus-on-dark"
              onClick={this.handleWatchTeacherClick}
              onMouseEnter={this.handleMouseEnterWatchTeacherIcon}
              onMouseLeave={this.handleMouseLeaveTooltip}
              type="button"
            >
              <img alt="" className={watchTeacherClass} src={watchTeacherIcon} />
              {this.renderTooltip(WATCH_TEACHER)}
            </button>
            <button
              className="interactive-wrapper focus-on-dark"
              onClick={this.handleExitLessonClick}
              onMouseEnter={this.handleMouseEnterExitIcon}
              onMouseLeave={this.handleMouseLeaveTooltip}
              type="button"
            >
              <img alt="" className={exitClass} src={exitIcon} />
              {this.renderTooltip(EXIT)}
            </button>
            <button
              className="interactive-wrapper focus-on-dark"
              onBlur={this.handleHelpDropdownBlur}
              onClick={this.handleHelpDropdownClick}
              onMouseEnter={this.handleMouseEnterHelpIcon}
              onMouseLeave={this.handleMouseLeaveTooltip}
              type="button"
            >
              <img alt="" className={`help-icon ${helpClass}`} src={helpIcon} />
              {this.renderTooltip(HELP)}
              {this.renderHelpDropdown()}
            </button>
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
