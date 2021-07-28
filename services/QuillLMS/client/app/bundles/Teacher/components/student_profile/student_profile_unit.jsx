import * as React from 'react'
import moment from 'moment'

import { DataTable, Tooltip } from '../../../Shared/index'
import activityLaunchLink from '../modules/generate_activity_launch_link.js';

const diagnosticSrc = `${process.env.CDN_URL}/images/icons/tool-diagnostic-gray.svg`
const connectSrc = `${process.env.CDN_URL}/images/icons/tool-connect-gray.svg`
const grammarSrc = `${process.env.CDN_URL}/images/icons/tool-grammar-gray.svg`
const proofreaderSrc = `${process.env.CDN_URL}/images/icons/tool-proofreader-gray.svg`
const lessonsSrc = `${process.env.CDN_URL}/images/icons/tool-lessons-gray.svg`
const comprehensionSrc = `${process.env.CDN_URL}/images/icons/tool-comprehension-gray.svg`

const CONNECT_ACTIVITY_CLASSIFICATION_KEY = "connect"
const GRAMMAR_ACTIVITY_CLASSIFICATION_KEY = "sentence"
const PROOFREADER_ACTIVITY_CLASSIFICATION_KEY = "passage"
const LESSONS_ACTIVITY_CLASSIFICATION_KEY = "lessons"
const DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY = "diagnostic"
const COMPREHENSION_ACTIVITY_CLASSIFICATION_KEY = "comprehension"
const UNGRADED_ACTIVITY_CLASSIFICATIONS = [LESSONS_ACTIVITY_CLASSIFICATION_KEY, DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY, COMPREHENSION_ACTIVITY_CLASSIFICATION_KEY]
const PROFICIENT_CUTOFF = 0.8
const NEARLY_PROFICIENT_CUTOFF = 0.6

const incompleteHeaders = [
  {
    width: '633px',
    name: 'Activity',
    attribute: 'name',
    headerClassName: 'name-section',
    rowSectionClassName: 'name-section'
  }, {
    width: '24px',
    name: 'Tool',
    attribute: 'tool',
    noTooltip: true,
    headerClassName: 'tool-icon-section',
    rowSectionClassName: 'tool-icon-section'
  }, {
    width: '85px',
    name: 'Due date',
    attribute: 'dueDate',
    noTooltip: true,
    headerClassName: 'due-date-section',
    rowSectionClassName: 'due-date-section'
  }, {
    width: '88px',
    name: '',
    attribute: 'actionButton',
    noTooltip: true,
    headerClassName: 'action-button-section',
    rowSectionClassName: 'action-button-section'
  }
]

const completeHeaders = [
  {
    width: '465px',
    name: 'Activity',
    attribute: 'name',
    headerClassName: 'name-section',
    rowSectionClassName: 'name-section'
  }, {
    width: '144px',
    name: 'Score',
    attribute: 'score',
    noTooltip: true,
    headerClassName: 'score-section tooltip-section',
    rowSectionClassName: 'score-section tooltip-section'
  }, {
    width: '24px',
    name: 'Tool',
    attribute: 'tool',
    noTooltip: true,
    headerClassName: 'tool-icon-section',
    rowSectionClassName: 'tool-icon-section'
  }, {
    width: '85px',
    name: 'Due date',
    attribute: 'dueDate',
    noTooltip: true,
    headerClassName: 'completed-due-date-section',
    rowSectionClassName: 'completed-due-date-section'
  }, {
    width: '88px',
    name: '',
    attribute: 'actionButton',
    noTooltip: true,
    headerClassName: 'action-button-section',
    rowSectionClassName: 'action-button-section'
  }
]

export default class StudentProfileUnit extends React.Component {
  actionButton = (act, nextActivitySession) => {
    const { isBeingPreviewed, onShowPreviewModal, } = this.props
    const { repeatable, locked, marked_complete, activity_classification_key, resume_link, ca_id, activity_id, finished, } = act
    let linkText = 'Start'

    if (!repeatable && finished) { return <span /> }

    if (!finished && marked_complete) { return <span>Missed</span> }

    if (locked) { return <span className="needs-teacher">Needs teacher</span> }

    if (finished) {
      linkText = 'Replay';
    } else if (resume_link === 1) {
      linkText = 'Resume';
    }

    const isNextActivity = nextActivitySession && ca_id === nextActivitySession.ca_id && activity_id === nextActivitySession.activity_id
    const buttonStyle = isNextActivity ? 'primary contained' : 'secondary outlined'

    if (isBeingPreviewed) {
      const onClick = () => onShowPreviewModal(activity_id)
      return <button className={`quill-button medium focus-on-light ${buttonStyle}`} onClick={onClick} type="button">{linkText}</button>;
    }

    return <a className={`quill-button medium focus-on-light ${buttonStyle}`} href={activityLaunchLink(ca_id, activity_id)}>{linkText}</a>;
  }

  score = (act) => {
    const { activity_classification_key, max_percentage, } = act
    const maxPercentage = Number(max_percentage)
    if (UNGRADED_ACTIVITY_CLASSIFICATIONS.includes(activity_classification_key)) {
      return (
        <Tooltip
          tooltipText="This type of activity is not graded."
          tooltipTriggerText={
            <div className="score">
              <div className="completed" />
              <span>Completed</span>
            </div>
          }
        />)
    }

    if (maxPercentage >= PROFICIENT_CUTOFF) {
      return (<div className="score"><div className="proficient" /><span>Proficient</span></div>)
    }

    if (maxPercentage >= NEARLY_PROFICIENT_CUTOFF) {
      return (<div className="score"><div className="nearly-proficient" /><span>Nearly proficient</span></div>)
    }

    return (<div className="score"><div className="not-yet-proficient" /><span>Not yet proficient</span></div>)
  }

  toolIcon = (key) => {
    switch(key) {
      case PROOFREADER_ACTIVITY_CLASSIFICATION_KEY:
        return <img alt="Flag representing Quill Proofreader" src={proofreaderSrc} />
      case GRAMMAR_ACTIVITY_CLASSIFICATION_KEY:
        return <img alt="Puzzle piece representing Quill Grammar" src={grammarSrc} />
      case DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY:
        return <img alt="Magnifying glass representing Quill Diagnostic" src={diagnosticSrc} />
      case CONNECT_ACTIVITY_CLASSIFICATION_KEY:
        return <img alt="Target representing Quill Connect" src={connectSrc} />
      case LESSONS_ACTIVITY_CLASSIFICATION_KEY:
        return <img alt="Apple representing Quill Lessons" src={lessonsSrc} />
      case COMPREHENSION_ACTIVITY_CLASSIFICATION_KEY:
        return <img alt="Book representing Quill Comprehension" src={comprehensionSrc} />
      default:
        return
    }
  }

  renderCompletedActivities = () => {
    const { data, nextActivitySession, } = this.props
    if (!(data.complete && data.complete.length)) { return null}

    const rows = data.complete.map(act => {
      const { name, activity_classification_key, ua_id, due_date, } = act
      return {
        name,
        score: this.score(act),
        tool: this.toolIcon(activity_classification_key),
        actionButton: this.actionButton(act, nextActivitySession),
        dueDate: due_date ? moment(due_date).format('MMM D, YYYY') : null,
        id: ua_id
      }
    })

    return (<div className="activities-container completed-activities">
      <h3>Completed activities</h3>
      <DataTable
        headers={completeHeaders}
        rows={rows}
      />
    </div>)
  }

  renderIncompleteActivities = () => {
    const { data, nextActivitySession} = this.props
    if (!(data.incomplete && data.incomplete.length)) { return null}

    const rows = data.incomplete.map(act => {
      const { name, activity_classification_key, due_date, ua_id, } = act
      return {
        name,
        tool: this.toolIcon(activity_classification_key),
        dueDate: due_date ? moment(due_date).format('MMM D, YYYY') : null,
        actionButton: this.actionButton(act, nextActivitySession),
        id: ua_id
      }
    })

    return (<div className="activities-container incomplete-activities">
      <h3>To-do activities</h3>
      <DataTable
        headers={incompleteHeaders}
        rows={rows}
      />
    </div>)
  }

  render() {
    const { unitName, id, isSelectedUnit, } = this.props
    const className = isSelectedUnit ? "student-profile-unit selected-unit" : "student-profile-unit"
    return (<div className={className} id={id}>
      <div className="unit-name">
        <h2>{unitName}</h2>
      </div>
      {this.renderIncompleteActivities()}
      {this.renderCompletedActivities()}
    </div>)
  }
}
