import qs from 'qs';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import GrowthSkillsTable from './growthSkillsTable';
import {
    ConceptResults, SkillResults
} from './interfaces';
import {
    baseDiagnosticImageSrc, correctImage, fileDocumentIcon
} from './shared';
import SkillsTable from './skillsTable';

import { requestGet } from '../../../../../../modules/request/index';
import { DataTable } from '../../../../../Shared/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

const incorrectImage = <img alt="Incorrect check icon" src={`${baseDiagnosticImageSrc}/icons-incorrect-small.svg`} />

const correctTag = <div className="concept-tag correct-tag">{correctImage}<span>Correct</span></div>
const incorrectTag = <div className="concept-tag incorrect-tag">{incorrectImage}<span>Incorrect</span></div>

const PRE = 'pre'
const POST = 'post'

const QuestionTable = ({ question, }) => {
  const { directions, prompt, answer, concepts, question_number, } = question

  const headers = [
    {
      name: `Question ${question_number}`,
      attribute: 'label',
      width: '66px'
    },
    {
      name: "",
      attribute: 'conceptTag',
      width: '83px'
    },
    {
      name: "",
      attribute: 'value',
      width: '720px'
    }
  ]

  const rows = [
    {
      label: 'Directions',
      value: directions,
    },
    {
      label: 'Prompt',
      value: prompt
    },
    {
      label: 'Response',
      value: answer
    }
  ]

  concepts.forEach(concept => {
    rows.push({
      label: 'Concept',
      value: concept.name,
      conceptTag: concept.correct ? correctTag : incorrectTag
    })
  })

  const mobileRows = rows.map(row => (<div className="mobile-data-table-row" key={row.value}>
    <span>{row.label}</span>
    <span>{row.value}</span>
    <span>{row.conceptTag}</span>
  </div>))

  const mobileTable = (<div className="mobile-data-table">
    <div className="header"><span>Question {question_number}</span></div>
    {mobileRows}
  </div>)

  return (
    <React.Fragment>
      <DataTable headers={headers} rows={rows} />
      {mobileTable}
    </React.Fragment>
  )
}

const Tab = ({ activeTab, label, setPreOrPost, value, }) => {
  function handleClick() { setPreOrPost(value) }

  return (<button className={`${activeTab === value ? 'active' : ''} focus-on-light tab`} onClick={handleClick} type="button">{label}</button>)
}

export const IndividualStudentResponses = ({ match, passedConceptResults, passedSkillResults, mobileNavigation, location, }) => {
  const [loading, setLoading] = React.useState<boolean>(!(passedConceptResults && passedSkillResults));
  const [name, setName] = React.useState<string>('')
  const [conceptResults, setConceptResults] = React.useState<ConceptResults>(passedConceptResults || {});
  const [skillResults, setSkillResults] = React.useState<SkillResults>(passedSkillResults || {});
  const [preOrPost, setPreOrPost] = React.useState<string>(POST)

  const { activityId, classroomId, studentId, } = match.params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `&unit_id=${unitId}` : ''

  React.useEffect(() => {
    getData()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getData()
  }, [activityId, classroomId, unitId, studentId])

  function getData() {
    requestGet(`/teachers/progress_reports/individual_student_diagnostic_responses/${studentId}?activity_id=${activityId}&classroom_id=${classroomId}${unitQueryString}`,
      (data) => {
        setConceptResults(data.concept_results);
        setSkillResults(data.skill_results)
        setName(data.name)
        setLoading(false)
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }

  let conceptResultElements

  let skillsSection

  if (skillResults.skills && skillResults.skills.length) {
    skillsSection = <div className="skills-table-container-wrapper">{skillResults.skills[0] && skillResults.skills[0].pre ? <GrowthSkillsTable isExpandable={true} skillGroup={skillResults} /> : <SkillsTable isExpandable={true} skillGroup={skillResults} />}</div>
  }

  if (conceptResults.pre) {
    conceptResultElements = (<React.Fragment>
      <div className="tabs">
        <Tab activeTab={preOrPost} label="Pre responses" setPreOrPost={setPreOrPost} value={PRE} />
        <Tab activeTab={preOrPost} label="Post responses" setPreOrPost={setPreOrPost} value={POST} />
      </div>
      {conceptResults[preOrPost].questions.map(question => <QuestionTable key={question.question_number} question={question} />)}
    </React.Fragment>)
  } else {
    conceptResultElements = conceptResults.questions.map(question => <QuestionTable key={question.question_number} question={question} />)
  }

  return (
    <main className="individual-student-responses-container">
      <header>
        <h1>{name}&#39;s responses</h1>
        <a className="focus-on-light" href="https://support.quill.org/en/articles/5698167-how-do-i-read-the-student-responses-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>
      </header>
      {mobileNavigation}
      {skillsSection}
      <section className="concept-results-container">{conceptResultElements}</section>
    </main>
  )

}

export default withRouter(IndividualStudentResponses)
