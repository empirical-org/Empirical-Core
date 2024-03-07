import moment from 'moment';
import * as React from 'react';

import {
  DataTable,
  Tooltip,
  closedLockIcon,
  onMobile,
  openLockIcon,
} from '../../../Shared/index';
import { formatDateTimeForDisplay, } from '../../helpers/unitActivityDates';
import activityLaunchLink from '../modules/generate_activity_launch_link.js';
import ScorebookTooltip from '../general_components/tooltip/scorebook_tooltip'

const diagnosticSrc = `${process.env.CDN_URL}/images/icons/tool-diagnostic-gray.svg`
const connectSrc = `${process.env.CDN_URL}/images/icons/tool-connect-gray.svg`
const grammarSrc = `${process.env.CDN_URL}/images/icons/tool-grammar-gray.svg`
const proofreaderSrc = `${process.env.CDN_URL}/images/icons/tool-proofreader-gray.svg`
const lessonsSrc = `${process.env.CDN_URL}/images/icons/tool-lessons-gray.svg`
const evidenceSrc = `${process.env.CDN_URL}/images/icons/tool-evidence-gray.svg`

const CONNECT_ACTIVITY_CLASSIFICATION_KEY = "connect"
const GRAMMAR_ACTIVITY_CLASSIFICATION_KEY = "sentence"
const PROOFREADER_ACTIVITY_CLASSIFICATION_KEY = "passage"
const LESSONS_ACTIVITY_CLASSIFICATION_KEY = "lessons"
const DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY = "diagnostic"
const EVIDENCE_ACTIVITY_CLASSIFICATION_KEY = "evidence"
const UNGRADED_ACTIVITY_CLASSIFICATIONS = [LESSONS_ACTIVITY_CLASSIFICATION_KEY, DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY, EVIDENCE_ACTIVITY_CLASSIFICATION_KEY]
const FREQUENTLY_DEMONSTRATED_SKILL_CUTOFF = 0.83
const SOMETIMES_DEMONSTRATED_SKILL_CUTOFF = 0.32
export const LOCKED = 'locked'
export const UNLOCKED = 'unlocked'

const incompleteHeaders = [
  {
    width: '823px',
    name: 'Activity',
    attribute: 'name',
    noTooltip: onMobile(), // On mobile we don't want a tooltip wrapper since they basically don't work there
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
    width: '100px',
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
    width: '474px',
    name: 'Activity',
    attribute: 'name',
    noTooltip: true,
    headerClassName: 'name-section',
    rowSectionClassName: 'name-section tooltip-section'
  }, {
    width: '230px',
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
    rowSectionClassName: 'tool-icon-section tooltip-section'
  }, {
    width: '110px',
    name: 'Due date',
    attribute: 'dueDate',
    noTooltip: true,
    headerClassName: 'completed-due-date-section',
    rowSectionClassName: 'completed-due-date-section tooltip-section'
  }, {
    width: '110px',
    name: 'Completed date',
    attribute: 'completedDate',
    noTooltip: true,
    headerClassName: 'completed-date-section',
    rowSectionClassName: 'completed-date-section tooltip-section'
  }, {
    width: '88px',
    name: '',
    attribute: 'actionButton',
    noTooltip: true,
    headerClassName: 'action-button-section tooltip-section',
    rowSectionClassName: 'action-button-section tooltip-section'
  }
]

const TooltipWrapper = ({ activity, exactScoresData, children, }) => {
  const [showTooltip, setShowTooltip] = React.useState(false)

  function handleMouseEnter() { setShowTooltip(true) }
  function handleMouseLeave() { setShowTooltip(false) }

  const relevantExactScore = exactScoresData.find(es => es.ua_id === activity.ua_id && es.classroom_unit_id === activity.classroom_unit_id)
  const tooltipData = { ...activity, ...relevantExactScore, percentage: activity.max_percentage, }

  let tooltip

  if (showTooltip) {
    tooltip = (
      <ScorebookTooltip data={tooltipData} inStudentView={true} />
    )
  }

  return (
    <div
      className="score-tooltip-activator"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {tooltip}
    </div>
  )
}

export default class StudentProfileUnit extends React.Component {
  actionButton = (act, nextActivitySession) => {
    const { isBeingPreviewed, onShowPreviewModal, } = this.props
    const { repeatable, locked, marked_complete, resume_link, classroom_unit_id, activity_id, finished, pre_activity_id, completed_pre_activity_session, activity_classification_key, name, closed, } = act
    let linkText = 'Start'

    if (activity_classification_key === DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY && pre_activity_id && !completed_pre_activity_session) { return <span className="complete-baseline">Complete Baseline first</span>}

    if (!repeatable && finished) { return <span /> }

    if (!finished && marked_complete) { return <span>Missed</span> }

    if (locked) {
      return (
        <Tooltip
          tooltipText="This is a Quill Lessons activity. Your teacher launches a Quill Lesson from their dashboard, and you complete the lesson together. To join the lesson, your teacher first needs to launch the lesson."
          tooltipTriggerText={<span className="needs-teacher">Needs teacher</span>}
        />
      )
    }

    if (closed) {
      return (
        <Tooltip
          tooltipText="Sorry, you can't replay this activity. Your teacher closed this activity pack."
          tooltipTriggerText="Replay"
          tooltipTriggerTextClass="quill-button disabled medium secondary outlined"
        />
      )
    }

    if (finished) {
      linkText = `Replay`;
    } else if (resume_link > 0) {
      linkText = `Resume`;
    }

    const isNextActivity = nextActivitySession && classroom_unit_id === nextActivitySession.classroom_unit_id && activity_id === nextActivitySession.activity_id
    const buttonStyle = isNextActivity ? 'primary contained' : 'secondary outlined'

    if (isBeingPreviewed) {
      const onClick = () => onShowPreviewModal(activity_id)

      return (
        <button
          aria-label={`${linkText} ${name}`}
          className={`quill-button medium focus-on-light ${buttonStyle}`}
          onClick={onClick}
          type="button"
        >
          {linkText}
        </button>
      )
    }

    return (
      <a
        aria-label={`${linkText} ${name}`}
        className={`quill-button medium focus-on-light ${buttonStyle}`}
        href={activityLaunchLink(classroom_unit_id, activity_id)}
      >
        {linkText}
      </a>
    )
  }

  score = (act) => {
    const { exactScoresData, showExactScores, } = this.props
    const { activity_classification_key, max_percentage, ua_id, classroom_unit_id, } = act
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
        />
      )
    }

    let exactScoreCopy

    if (showExactScores) {
      const relevantExactScore = exactScoresData.find(es => es.ua_id === ua_id && es.classroom_unit_id === classroom_unit_id)
      const bestSession = relevantExactScore.sessions.reduce(
        (a, b) => {
          return a.percentage < b.percentage ? a : b
        }
      )
      const { number_of_questions, number_of_correct_questions, percentage, } = bestSession

      exactScoreCopy = (<span>{number_of_correct_questions} of {number_of_questions} ({percentage * 100}%)</span>)
    }

    if (maxPercentage >= FREQUENTLY_DEMONSTRATED_SKILL_CUTOFF) {
      return (<div className="score"><div className="frequently-demonstrated-skill" /><span>{exactScoreCopy || 'Frequently demonstrated skill'}</span></div>)
    }

    if (maxPercentage >= SOMETIMES_DEMONSTRATED_SKILL_CUTOFF) {
      return (<div className="score"><div className="sometimes-demonstrated-skill" /><span>{exactScoreCopy || 'Sometimes demonstrated skill'}</span></div>)
    }

    return (<div className="score"><div className="rarely-demonstrated-skill" /><span>{exactScoreCopy || 'Rarely demonstrated skill'}</span></div>)

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
      case EVIDENCE_ACTIVITY_CLASSIFICATION_KEY:
        return <img alt="Book representing Quill Reading for Evidence" src={evidenceSrc} />
      default:
        return
    }
  }

  renderCompletedActivities = () => {
    const { data, nextActivitySession, showExactScores, exactScoresData, } = this.props
    if (!(data.complete && data.complete.length)) { return null}

    const rows = data.complete.map(act => {
      const { name, activity_classification_key, ua_id, due_date, completed_date, } = act

      if (showExactScores && !UNGRADED_ACTIVITY_CLASSIFICATIONS.includes(activity_classification_key)) {
        return {
          name: <TooltipWrapper activity={act} exactScoresData={exactScoresData}>{name}</TooltipWrapper>,
          score: <TooltipWrapper activity={act} exactScoresData={exactScoresData}>{this.score(act)}</TooltipWrapper>,
          tool: <TooltipWrapper activity={act} exactScoresData={exactScoresData}>{this.toolIcon(activity_classification_key)}</TooltipWrapper>,
          actionButton: <TooltipWrapper activity={act} exactScoresData={exactScoresData}>{this.actionButton(act, nextActivitySession)}</TooltipWrapper>,
          dueDate: <TooltipWrapper activity={act} exactScoresData={exactScoresData}>{due_date ? formatDateTimeForDisplay(moment.utc(due_date)) : null}</TooltipWrapper>,
          completedDate: <TooltipWrapper activity={act} exactScoresData={exactScoresData}>{completed_date ? formatDateTimeForDisplay(moment.utc(completed_date)) : null}</TooltipWrapper>,
          id: <TooltipWrapper activity={act} exactScoresData={exactScoresData}>{ua_id}</TooltipWrapper>
        }

      }

      return {
        name,
        score: this.score(act),
        tool: this.toolIcon(activity_classification_key),
        actionButton: this.actionButton(act, nextActivitySession),
        dueDate: due_date ? formatDateTimeForDisplay(moment.utc(due_date)) : null,
        completedDate: completed_date ? formatDateTimeForDisplay(moment.utc(completed_date)) : null,
        id: ua_id
      }
    })

    return (
      <div className="activities-container completed-activities">
        <DataTable
          headers={completeHeaders}
          rows={rows}
        />
      </div>
    )
  }

  renderIncompleteActivities = () => {
    const { data, nextActivitySession} = this.props
    if (!(data.incomplete && data.incomplete.length)) { return null}

    const rows = data.incomplete.map(act => {
      const { name, activity_classification_key, due_date, ua_id, } = act
      return {
        name,
        tool: this.toolIcon(activity_classification_key),
        dueDate: due_date ? formatDateTimeForDisplay(moment.utc(due_date)) : null,
        actionButton: this.actionButton(act, nextActivitySession),
        id: ua_id
      }
    })

    return (
      <div className="activities-container incomplete-activities">
        <DataTable
          headers={incompleteHeaders}
          rows={rows}
        />
      </div>
    )
  }

  render() {
    const { unitName, id, isSelectedUnit, staggeredReleaseStatus, } = this.props
    const className = isSelectedUnit ? `student-profile-unit selected-unit ${staggeredReleaseStatus}` : `student-profile-unit ${staggeredReleaseStatus}`

    let activityContent = (
      <React.Fragment>
        {this.renderIncompleteActivities()}
        {this.renderCompletedActivities()}
      </React.Fragment>
    )

    let staggeredReleaseElement = <span />

    if (staggeredReleaseStatus === LOCKED) {
      activityContent = null
      staggeredReleaseElement = (
        <Tooltip
          tooltipText="The activity pack is locked because your teacher selected staggered release.<br/><br/>When you complete the unlocked activity pack, the next activity pack will unlock."
          tooltipTriggerText={<img alt={closedLockIcon.alt} src={closedLockIcon.src} />}
        />
      )
    } else if (staggeredReleaseStatus === UNLOCKED) {
      staggeredReleaseElement = (
        <Tooltip
          tooltipText="This activity pack is unlocked."
          tooltipTriggerText={<img alt={openLockIcon.alt} src={openLockIcon.src} />}
        />
      )
    }

    return (
      <div className={className} id={id}>
        <div className="unit-name-and-staggered-release-status">
          <h2 className="unit-name">{unitName}</h2>
          {staggeredReleaseElement}
        </div>
        {activityContent}
      </div>
    )
  }
}
