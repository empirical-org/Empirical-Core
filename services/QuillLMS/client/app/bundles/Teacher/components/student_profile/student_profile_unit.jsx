import * as React from 'react'
import moment from 'moment'

import { DataTable } from '../../../../../../../../packages/quill-component-library/src/components/shared/dataTable'
// import { DataTable } from 'quill-component-library/dist/componentLibrary'

import activityLaunchLink from '../modules/generate_activity_launch_link.js';

const diagnosticSrc = `${process.env.CDN_URL}/images/icons/tool-diagnostic-gray.svg`
const connectSrc = `${process.env.CDN_URL}/images/icons/tool-connect-gray.svg`
const grammarSrc = `${process.env.CDN_URL}/images/icons/tool-grammar-gray.svg`
const proofreaderSrc = `${process.env.CDN_URL}/images/icons/tool-proofreader-gray.svg`
const lessonsSrc = `${process.env.CDN_URL}/images/icons/tool-lessons-gray.svg`

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
    headerClassName: 'score-section',
    rowSectionClassName: 'score-section'
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
  score = (act) => {
    const { activity_classification_id, max_percentage, } = act
    const maxPercentage = Number(max_percentage)
    if (activity_classification_id === "4" || activity_classification_id === "6") {
      return (<div className="score"><div className="unscored" /><span>Unscored</span></div>)
    } else if (maxPercentage > .8) {
      return (<div className="score"><div className="proficient" /><span>Proficient</span></div>)
    } else if (maxPercentage > .6) {
      return (<div className="score"><div className="nearly-proficient" /><span>Nearly proficient</span></div>)
    }

    return (<div className="score"><div className="not-yet-proficient" /><span>Not yet proficient</span></div>)
  }

  actionButton = (act, nextActivitySession) => {
    const { repeatable, max_percentage, locked, marked_complete, activity_classification_id, resume_link, ca_id, activity_id, } = act
    let linkText = 'Start'

    if (repeatable === 'f' && max_percentage) {
      return <span>Completed</span>
    } else if (max_percentage === null && marked_complete === 't'){
      return <span>Missed</span>
    } else if (locked === 't') {
      return <span className="needs-teacher">Needs teacher</span>
    } else if (max_percentage) {
      linkText = 'Replay';
    } else if (resume_link === '1') {
      linkText = 'Resume';
    }

    const buttonStyle = ca_id === nextActivitySession.ca_id && activity_id === nextActivitySession.activity_id ? 'primary contained' : 'secondary outlined'
    return <a className={`quill-button medium focus-on-light ${buttonStyle}`} href={activityLaunchLink(ca_id, activity_id)}>{linkText}</a>;
  }

  toolIcon = (id) => {
    switch(id) {
      case "1":
        return <img alt="Flag representing Quill Proofreader" src={proofreaderSrc} />
      case "2":
        return <img alt="Puzzle piece representing Quill Grammar" src={grammarSrc} />
      case "4":
        return <img alt="Magnifying glass representing Quill Diagnostic" src={diagnosticSrc} />
      case "5":
        return <img alt="Target representing Quill Connect" src={connectSrc} />
      case "6":
        return <img alt="Apple representing Quill Lessons" src={lessonsSrc} />
      default:
        return
    }
  }

  renderIncompleteActivities = () => {
    const { data, nextActivitySession} = this.props
    if (!(data.incomplete && data.incomplete.length)) { return null}

    const rows = data.incomplete.map(act => {
      const { name, activity_classification_id, due_date, ua_id, } = act
      return {
        name,
        tool: this.toolIcon(activity_classification_id),
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

  renderCompletedActivities = () => {
    const { data, nextActivitySession, } = this.props
    if (!(data.complete && data.complete.length)) { return null}

    const rows = data.complete.map(act => {
      const { name, activity_classification_id, max_percentage, ua_id, due_date, } = act
      return {
        name,
        score: this.score(act),
        tool: this.toolIcon(activity_classification_id),
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

  render() {
    const { unitName, } = this.props
    return (<div className="student-profile-unit">
      <div className="unit-name">
        <h2>{unitName}</h2>
      </div>
      {this.renderIncompleteActivities()}
      {this.renderCompletedActivities()}
    </div>)
  }
}
