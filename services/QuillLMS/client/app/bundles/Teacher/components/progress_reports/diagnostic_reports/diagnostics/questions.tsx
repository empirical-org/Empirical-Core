import qs from 'qs';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { stripHtml } from "string-strip-html";

import {
  fileDocumentIcon,
  sortSkillGroupsByQuestionNumbers,
} from './shared';
import {
  SkillGroupSummary
} from './interfaces'

import { requestGet } from '../../../../../../modules/request/index';
import {
  DataTable,
  Tooltip,
} from '../../../../../Shared/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

interface Question {
  instructions: string;
  prompt: string;
  score: number;
  question_id: number;
  question_uid: string;
  question_number: number;
}

const AVERAGE_FONT_WIDTH = 6.5
const ALLOTTED_WIDTH = 550

const desktopHeaders = [
  {
    name: 'Question',
    attribute: 'questionNumber',
    width: '112px',
    textAlign: 'center',
    rowSectionClassName: 'question-number-section',
  },
  {
    name: 'Activity Scores',
    attribute: 'scoreElement',
    width: '120px',
    noTooltip: true,
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header'
  },
  {
    name: '',
    attribute: 'directionsAndPrompt',
    width: '644px',
    noTooltip: true,
    rowSectionClassName: 'directions-and-prompt-section',
    headerClassName: 'directions-and-prompt-header'
  }
]

const mobileHeaders = [
  {
    name: '',
    attribute: 'directionsAndPrompt',
    width: '188px',
    rowSectionClassName: 'directions-and-prompt-section',
  },
  {
    name: 'Scores',
    attribute: 'scoreElement',
    width: '52px',
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    noTooltip: true
  }
]

const scoreToClassName = (score) => {
  if (score >= 83) { return 'frequently-demonstrated-skill' }
  if (score >= 32) { return 'sometimes-demonstrated-skill' }
  return 'rarely-demonstrated-skill'
}

const DirectionsAndPrompt = ({ directions, prompt, onMobile, }) => {
  function textOrTooltip(text) {
    if (onMobile) {
      return <p dangerouslySetInnerHTML={{ __html: text }} />
    }

    if ((stripHtml(text).result.length * AVERAGE_FONT_WIDTH) >= ALLOTTED_WIDTH) {
      return (
        <Tooltip
          tooltipText={text}
          tooltipTriggerText={stripHtml(text).result}
          tooltipTriggerTextClass="directions-or-prompt"
        />
      )
    }

    return <p>{stripHtml(text).result}</p>
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

export const Questions = ({ passedQuestions, match, mobileNavigation, location, passedSkillGroupSummaries}) => {
  const [loading, setLoading] = React.useState<boolean>(!passedQuestions);
  const [questions, setQuestions] = React.useState<Question[]>(passedQuestions || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState<SkillGroupSummary[]>(passedSkillGroupSummaries || []);
  const [completedStudentCount, setCompletedStudentCount] = React.useState(null)

  const { activityId, classroomId, } = match.params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `?unit_id=${unitId}` : ''

  React.useEffect(() => {
    getQuestions()
    getResults()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getQuestions()
    getResults()
  }, [activityId, classroomId, unitId])

  React.useEffect(() => {
    if (questions.length && skillGroupSummaries.length && Number.isInteger(completedStudentCount)) {
      setLoading(false)
    }
  }, [questions, skillGroupSummaries, completedStudentCount])

  function getQuestions() {
    requestGet(`/teachers/progress_reports/question_view/classroom/${classroomId}/activity/${activityId}${unitQueryString}`,
      (data) => {
        setQuestions(data.data);
      }
    )
  }

  function getResults() {
    requestGet(`/teachers/progress_reports/diagnostic_results_summary?activity_id=${activityId}&classroom_id=${classroomId}${unitQueryString}`,
      (data) => {
        setCompletedStudentCount(data.student_results.filter(sr => sr.skill_groups).length)
        setSkillGroupSummaries(data.skill_group_summaries);
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }

  const sortedSkillGroups = sortSkillGroupsByQuestionNumbers(skillGroupSummaries, questions)

  const skillGroups = sortedSkillGroups.map(skillGroup => {
    const filteredQuestions = questions.filter(q => skillGroup.question_uids.includes(q.question_uid)).sort((a, b) => a.question_number - b.question_number);
    const proficiencyScoresSum: any = Object.values(skillGroup.proficiency_scores_by_student).reduce((a: number, b: number) => a + b, 0)
    const percentage = Math.round((proficiencyScoresSum/completedStudentCount) * 100)

    const desktopRows = filteredQuestions.map(question => {
      const { instructions, prompt, question_id, score, } = question
      return {
        id: question_id,
        questionNumber: question_id,
        directionsAndPrompt: <DirectionsAndPrompt directions={instructions} onMobile={false} prompt={prompt} />,
        score,
        scoreElement: score || score === 0 ? <span className={scoreToClassName(score)}>{score}%</span> : null
      }
    })

    const mobileRows = filteredQuestions.map(question => {
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
      <section className="skill-group-section" id={skillGroup.id} key={skillGroup.id} >
        <div className="skill-group-section-header">
          <h2>
            <span>{skillGroup.name}</span>
            {completedStudentCount ? (
              <div>
                <span>{percentage}%</span>
                <span className="subheader">Average score</span>
              </div>
            ) : null}
          </h2>
        </div>
        <div className="data-table-container">
          <DataTable
            className="hide-on-mobile"
            headers={desktopHeaders}
            rows={desktopRows}
          />
          <DataTable
            className="hide-on-desktop"
            headers={mobileHeaders}
            rows={mobileRows}
          />
        </div>
      </section>
    );
  });

  return (
    <main className="questions-index-container">
      <header>
        <h1>Questions analysis</h1>
        <a className="focus-on-light" href="https://support.quill.org/en/articles/5698219-how-do-i-read-the-questions-analysis-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>
      </header>
      {mobileNavigation}
      {skillGroups}
    </main>
  )
}

export default withRouter(Questions)
