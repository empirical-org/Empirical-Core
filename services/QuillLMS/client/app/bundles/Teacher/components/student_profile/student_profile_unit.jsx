import moment from 'moment';
import * as React from 'react';

import {
  DataTable,
  Tooltip,
  closedLockIcon,
  onMobile,
  openLockIcon,
  DarkButtonLoadingSpinner,
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

const HAS_SEEN_EVIDENCE_SCORING_MODAL_LOCAL_STORAGE_KEY = 'hasSeenEvidenceScoringModal'

const CONNECT_ACTIVITY_CLASSIFICATION_KEY = "connect"
const GRAMMAR_ACTIVITY_CLASSIFICATION_KEY = "sentence"
const PROOFREADER_ACTIVITY_CLASSIFICATION_KEY = "passage"
const LESSONS_ACTIVITY_CLASSIFICATION_KEY = "lessons"
const DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY = "diagnostic"
const EVIDENCE_ACTIVITY_CLASSIFICATION_KEY = "evidence"

const FREQUENTLY_DEMONSTRATED_SKILL_CUTOFF = 0.83
const SOMETIMES_DEMONSTRATED_SKILL_CUTOFF = 0.32

export const LOCKED = 'locked'
export const UNLOCKED = 'unlocked'

const incompleteHeaders = [
  {
    width: '24px',
    name: 'Tool',
    attribute: 'tool',
    noTooltip: true,
    headerClassName: 'tool-icon-section',
    rowSectionClassName: 'tool-icon-section'
  }, {
    width: '866px',
    name: 'Activity',
    attribute: 'name',
    noTooltip: onMobile(), // On mobile we don't want a tooltip wrapper since they basically don't work there
    headerClassName: 'name-section',
    rowSectionClassName: 'name-section'
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
    width: '24px',
    name: 'Tool',
    attribute: 'tool',
    noTooltip: true,
    headerClassName: 'tool-icon-section',
    rowSectionClassName: 'tool-icon-section tooltip-section'
  }, {
    width: '432px',
    name: 'Activity',
    attribute: 'name',
    noTooltip: true,
    headerClassName: 'name-section',
    rowSectionClassName: 'name-section tooltip-section'
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
    width: '130px',
    name: 'Score',
    attribute: 'score',
    noTooltip: true,
    headerClassName: 'score-section tooltip-section',
    rowSectionClassName: 'score-section tooltip-section'
  },
  {
    width: '118px',
    name: '',
    attribute: 'viewResultsButton',
    noTooltip: true,
    headerClassName: 'tooltip-section view-results-section',
    rowSectionClassName: 'tooltip-section view-results-section'
  },
  {
    width: '88px',
    name: '',
    attribute: 'actionButton',
    noTooltip: true,
    headerClassName: 'action-button-section tooltip-section',
    rowSectionClassName: 'action-button-section tooltip-section'
  }
]

const TooltipWrapper = ({ activity, exactScoresData, children, showExactScores, }) => {
  const [showTooltip, setShowTooltip] = React.useState(false)

  function handleMouseEnter() { setShowTooltip(true) }
  function handleMouseLeave() { setShowTooltip(false) }

  const { ua_id, classroom_unit_id, max_percentage, unit_activity_created_at, publish_date, } = activity

  const relevantExactScore = exactScoresData.find(es => es.ua_id === ua_id && es.classroom_unit_id === classroom_unit_id)
  const tooltipData = { ...activity, ...relevantExactScore, percentage: max_percentage, unitActivityCreatedAt: unit_activity_created_at, publishDate: publish_date, }

  let tooltip

  if (showTooltip) {
    tooltip = (
      <ScorebookTooltip data={tooltipData} inStudentView={true} showExactScores={showExactScores} />
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
  viewResultsButton = (act) => {
    const { activity_session_id, activity_classification_key, name, } = act

    if ([DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY, LESSONS_ACTIVITY_CLASSIFICATION_KEY].includes(activity_classification_key)) { return }

    return (
      <a
        aria-label={`View results for ${name}`}
        className="quill-button-archived medium focus-on-light secondary outlined"
        href={`/activity_sessions/${activity_session_id}/student_activity_report`}
      >
        View results
      </a>

    )
  }

  handleShowEvidenceScoringModal = (launchLink) => {
    const { onShowEvidenceScoringModal, } = this.props

    window.localStorage.setItem(HAS_SEEN_EVIDENCE_SCORING_MODAL_LOCAL_STORAGE_KEY, 'true')
    onShowEvidenceScoringModal(launchLink)
  }

  actionButton = (act, nextActivitySession) => {
    const { isBeingPreviewed, onShowPreviewModal, completedEvidenceActivityPriorToScoring, } = this.props
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
          tooltipTriggerTextClass="quill-button-archived disabled medium secondary outlined"
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

    const launchLink = activityLaunchLink(classroom_unit_id, activity_id)

    if (completedEvidenceActivityPriorToScoring && activity_classification_key === EVIDENCE_ACTIVITY_CLASSIFICATION_KEY && !window.localStorage.getItem(HAS_SEEN_EVIDENCE_SCORING_MODAL_LOCAL_STORAGE_KEY)) {
      const onClick = () => this.handleShowEvidenceScoringModal(launchLink)

      return (
        <button
          aria-label={`${linkText} ${name}`}
          className={`quill-button-archived medium focus-on-light ${buttonStyle}`}
          onClick={onClick}
          type="button"
        >
          {linkText}
        </button>
      )
    }

    if (isBeingPreviewed) {
      const onClick = () => onShowPreviewModal(activity_id)

      return (
        <button
          aria-label={`${linkText} ${name}`}
          className={`quill-button-archived medium focus-on-light ${buttonStyle}`}
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
        className={`quill-button-archived medium focus-on-light ${buttonStyle}`}
        href={launchLink}
      >
        {linkText}
      </a>
    )
  }

  score = (act) => {
    const { exactScoresData, showExactScores, exactScoresDataPending, } = this.props
    const { activity_classification_key, max_percentage, ua_id, classroom_unit_id, completed_attempt_count, } = act
    const maxPercentage = Number(max_percentage)

    const attemptCountIndicator = completed_attempt_count > 1 ? (
      <span>
        <img alt="" className="attempt-symbol" src="https://assets.quill.org/images/scorebook/blue-circle-solid.svg" />
        <span className="attempt-count">{completed_attempt_count}</span>
      </span>
    ) : null

    if (EVIDENCE_ACTIVITY_CLASSIFICATION_KEY === activity_classification_key && max_percentage === null) {
      return (<div className="score"><div className="completed">{attemptCountIndicator}</div><span>Completed</span></div>)
    }

    if ([DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY, LESSONS_ACTIVITY_CLASSIFICATION_KEY].includes(activity_classification_key)) {
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

    if (showExactScores && exactScoresDataPending) {
      exactScoreCopy = (<span><DarkButtonLoadingSpinner /> ({Math.round(max_percentage * 100)}%)</span>)
    } else if (showExactScores) {
      const relevantExactScore = exactScoresData.find(es => es.ua_id === ua_id && es.classroom_unit_id === classroom_unit_id)
      const bestSession = relevantExactScore.sessions.reduce(
        (a, b) => {
          return a.percentage > b.percentage ? a : b
        }
      )
      const { number_of_questions, number_of_correct_questions, percentage, } = bestSession

      exactScoreCopy = (<span>{number_of_correct_questions} of {number_of_questions} ({Math.round(percentage * 100)}%)</span>)
    }

    if (maxPercentage >= FREQUENTLY_DEMONSTRATED_SKILL_CUTOFF) {
      return (<div className="score"><div className="frequently-demonstrated-skill">{attemptCountIndicator}</div><span>{exactScoreCopy}</span></div>)
    }

    if (maxPercentage >= SOMETIMES_DEMONSTRATED_SKILL_CUTOFF) {
      return (<div className="score"><div className="sometimes-demonstrated-skill">{attemptCountIndicator}</div><span>{exactScoreCopy}</span></div>)
    }

    return (<div className="score"><div className="rarely-demonstrated-skill">{attemptCountIndicator}</div><span>{exactScoreCopy}</span></div>)

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
    const { data, nextActivitySession, showExactScores, exactScoresData, exactScoresDataPending, } = this.props
    if (!(data.complete && data.complete.length)) { return null}

    const rows = data.complete.map(act => {
      const { name, activity_classification_key, ua_id, due_date, completed_date, } = act

      const dueDate = due_date ? formatDateTimeForDisplay(moment.utc(due_date)) : '—'
      const completedDate = completed_date ? formatDateTimeForDisplay(moment.utc(completed_date)) : null

      const shared = {
        actionButton: this.actionButton(act, nextActivitySession),
        viewResultsButton: this.viewResultsButton(act)
      }

      const sharedTooltipWrapperProps = {
        activity: act,
        exactScoresData,
        showExactScores,
      }

      if (![DIAGNOSTIC_ACTIVITY_CLASSIFICATION_KEY, LESSONS_ACTIVITY_CLASSIFICATION_KEY].includes(activity_classification_key) && !exactScoresDataPending) {
        return {
          ...shared,
          name: <TooltipWrapper {...sharedTooltipWrapperProps}>{name}</TooltipWrapper>,
          score: <TooltipWrapper {...sharedTooltipWrapperProps}>{this.score(act)}</TooltipWrapper>,
          tool: <TooltipWrapper {...sharedTooltipWrapperProps}>{this.toolIcon(activity_classification_key)}</TooltipWrapper>,
          dueDate: <TooltipWrapper {...sharedTooltipWrapperProps}>{dueDate}</TooltipWrapper>,
          completedDate: <TooltipWrapper {...sharedTooltipWrapperProps}>{completedDate}</TooltipWrapper>,
          id: <TooltipWrapper {...sharedTooltipWrapperProps}>{ua_id}</TooltipWrapper>,
        }

      }

      return {
        ...shared,
        name,
        dueDate,
        completedDate,
        score: this.score(act),
        tool: this.toolIcon(activity_classification_key),
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
        dueDate: due_date ? formatDateTimeForDisplay(moment.utc(due_date)) : '—',
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
    const { unitName, id, isSelectedUnit, staggeredReleaseStatus, data, } = this.props
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
        <div className="subheader">
          <h3>{data.complete?.length ? 'Completed activities' : 'To-do activities'}</h3>
        </div>
        {activityContent}
      </div>
    )
  }
}
