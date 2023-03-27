import qs from 'qs';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import stripHtml from "string-strip-html";

import {
    fileDocumentIcon
} from './shared';

import { requestGet } from '../../../../../../modules/request/index';
import {
    DataTable,
    Tooltip
} from '../../../../../Shared/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

interface Question {
  instructions: string;
  prompt: string;
  score: number;
  question_id: number;
}

const AVERAGE_FONT_WIDTH = 6.5
const ALLOTTED_WIDTH = 673

const desktopHeaders = (isSortable) => ([
  {
    name: 'Question',
    attribute: 'questionNumber',
    width: '51px',
    rowSectionClassName: 'question-number-section',
    isSortable: true
  },
  {
    name: 'Average score',
    attribute: 'scoreElement',
    sortAttribute: 'score',
    width: '52px',
    noTooltip: true,
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    isSortable
  },
  {
    name: '',
    attribute: 'directionsAndPrompt',
    width: '757px',
    noTooltip: true,
    rowSectionClassName: 'directions-and-prompt-section',
    headerClassName: 'directions-and-prompt-header'
  }
])

const mobileHeaders = (isSortable) => ([
  {
    name: '',
    attribute: 'directionsAndPrompt',
    width: '188px',
    rowSectionClassName: 'directions-and-prompt-section',
    isSortable: true
  },
  {
    name: 'Avg. score',
    attribute: 'scoreElement',
    sortAttribute: 'score',
    width: '52px',
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    noTooltip: true,
    isSortable
  }
])

const scoreToClassName = (score) => {
  if (score >= 80) { return 'proficient' }
  if (score >= 60) { return 'nearly-proficient' }
  return 'not-yet-proficient'
}

const DirectionsAndPrompt = ({ directions, prompt, onMobile, }) => {
  function textOrTooltip(text) {
    if (onMobile) {
      return <p dangerouslySetInnerHTML={{ __html: text }} />
    }

    if ((stripHtml(text).length * AVERAGE_FONT_WIDTH) >= ALLOTTED_WIDTH) {
      return (
        <Tooltip
          tooltipText={text}
          tooltipTriggerText={stripHtml(text)}
          tooltipTriggerTextClass="directions-or-prompt"
        />
      )
    }

    return <p>{stripHtml(text)}</p>
  }

  return (
    <div className="directions-and-prompt">
      <div className="directions">
        <span>Directions</span>
        {textOrTooltip(directions)}
      </div>
      <div className="prompt">
        <span>Prompt</span>
        {textOrTooltip(prompt)}
      </div>
    </div>
  )
}

export const Questions = ({ passedQuestions, match, mobileNavigation, location, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedQuestions);
  const [questions, setQuestions] = React.useState<Question[]>(passedQuestions || []);

  const { activityId, classroomId, } = match.params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `?unit_id=${unitId}` : ''

  React.useEffect(() => {
    getQuestions()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getQuestions()
  }, [activityId, classroomId, unitId])

  function getQuestions() {
    requestGet(`/teachers/progress_reports/question_view/classroom/${classroomId}/activity/${activityId}${unitQueryString}`,
      (data) => {
        setQuestions(data.data);
        setLoading(false)
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }

  const worthSorting = questions.filter(s => s.score).length

  const desktopRows = questions.map(question => {
    const { instructions, prompt, question_id, score, } = question
    return {
      id: question_id,
      questionNumber: question_id,
      directionsAndPrompt: <DirectionsAndPrompt directions={instructions} onMobile={false} prompt={prompt} />,
      score,
      scoreElement: score || score === 0 ? <span className={scoreToClassName(score)}>{score}%</span> : null
    }
  })

  const mobileRows = questions.map(question => {
    const { instructions, prompt, question_id, score, } = question
    return {
      id: question_id,
      questionNumber: question_id,
      directionsAndPrompt: <DirectionsAndPrompt directions={instructions} onMobile={true} prompt={prompt} />,
      score,
      scoreElement: score || score === 0 ? <span className={scoreToClassName(score)}>{score}%</span> : null
    }
  })

  return (
    <main className="questions-index-container">
      <header>
        <h1>Questions analysis</h1>
        <a className="focus-on-light" href="https://support.quill.org/en/articles/5698219-how-do-i-read-the-questions-analysis-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>
      </header>
      {mobileNavigation}
      <div className="data-table-container">
        <DataTable
          className="hide-on-mobile"
          defaultSortAttribute={worthSorting && 'score'}
          defaultSortDirection='asc'
          headers={desktopHeaders(worthSorting)}
          rows={desktopRows}
        />
        <DataTable
          className="hide-on-desktop"
          defaultSortAttribute={worthSorting && 'score'}
          defaultSortDirection='asc'
          headers={mobileHeaders(worthSorting)}
          rows={mobileRows}
        />
      </div>
    </main>
  )
}

export default withRouter(Questions)
