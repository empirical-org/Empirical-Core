import * as React from 'react'
import moment from 'moment'

import { DataTable } from 'quill-component-library/dist/componentLibrary'

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
    attribute: 'name'
  }, {
    width: '24px',
    name: 'Tool',
    attribute: 'tool',
    noTooltip: true
  }, {
    width: '85px',
    name: 'Due date',
    attribute: 'dueDate',
    noTooltip: true
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
    attribute: 'name'
  }, {
    width: '144px',
    name: 'Score',
    attribute: 'score'
  }, {
    width: '24px',
    name: 'Tool',
    attribute: 'tool'
  }, {
    width: '80px',
    name: 'Due date',
    attribute: 'dueDate'
  }, {
    width: '88px',
    name: '',
    attribute: 'actionButton'
  }
]

export default class StudentProfileUnit extends React.Component {
  actionButton = (act, index) => {
    const { repeatable, max_percentage, locked, marked_complete, activity_classification_id, resume_link, ca_id, activity_id, } = act
    let linkText = 'Start'

    if (repeatable === 'f' && max_percentage) {
      return null
    } else if (max_percentage === null && marked_complete === 't'){
      return null
    } else if (locked === 't') {
      return <span className="needs-teacher">Needs teacher</span>
    } else if (max_percentage) {
      linkText = 'Replay';
    } else if (resume_link === '1') {
      linkText = 'Resume';
    }

    const buttonStyle = index === 0 && !max_percentage ? 'primary contained' : 'secondary outlined'
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
    const { data, } = this.props
    if (!(data.incomplete && data.incomplete.length)) { return null}

    const rows = data.incomplete.map((act, index) => {
      const { name, activity_classification_id, due_date, ua_id, } = act
      return {
        name,
        tool: this.toolIcon(activity_classification_id),
        dueDate: due_date ? moment(due_date).format('MMM D, YYYY') : null,
        actionButton: this.actionButton(act, index),
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
    const { data, } = this.props
    if (!(data.completed && data.completed.length)) { return null}

    return (<div className="activities-container completed-activities">
      <h3>Completed activities</h3>
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
