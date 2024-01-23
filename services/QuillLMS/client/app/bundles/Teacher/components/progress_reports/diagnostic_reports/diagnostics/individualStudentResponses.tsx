import qs from 'qs';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import {
  ConceptResults,
} from './interfaces';
import {
  baseDiagnosticImageSrc,
  greenCircleWithCheckIcon,
  fileDocumentIcon,
} from './shared';
import GrowthSkillsTable from './growthSkillsTable';
import SkillsTable from './skillsTable';

import { requestGet } from '../../../../../../modules/request/index';
import { DataTable, } from '../../../../../Shared/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

const incorrectImage = <img alt="Incorrect check icon" src={`${baseDiagnosticImageSrc}/icons-incorrect-gold.svg`} />

const correctTag = <div className="concept-tag correct-tag">{greenCircleWithCheckIcon}<span>Correct</span></div>
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
      width: '83px',
      noTooltip: true
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
      id: directions
    },
    {
      label: 'Prompt',
      value: prompt,
      id: prompt
    },
    {
      label: 'Response',
      value: answer,
      id: answer
    }
  ]

  concepts.forEach(concept => {
    rows.push({
      label: 'Concept',
      value: concept.name,
      conceptTag: concept.correct ? correctTag : incorrectTag,
      id: concept.name
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

export const IndividualStudentResponses = ({ match, passedConceptResults, passedSkillGroupResults, mobileNavigation, location, }) => {
  const [loading, setLoading] = React.useState<boolean>(!(passedConceptResults && passedSkillGroupResults));
  const [name, setName] = React.useState<string>('')
  const [conceptResults, setConceptResults] = React.useState<ConceptResults>(passedConceptResults || {});
  const [skillGroupResults, setSkillGroupResults] = React.useState<Array<any>>(passedSkillGroupResults || {});
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

  React.useEffect(() => {
    if (loading) { return }

    const splitUrl = window.location.href.split('#');
    const id = splitUrl[splitUrl.length - 1]

    // Check if URL has a hash and the page has fully loaded
    if (id) {
      const element = document.getElementById(id);

      // If the element exists, scroll to it
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [loading]); // Empty dependency array ensures this runs once after initial render


  function getData() {
    requestGet(`/teachers/progress_reports/individual_student_diagnostic_responses/${studentId}?activity_id=${activityId}&classroom_id=${classroomId}${unitQueryString}`,
      (data) => {
        setConceptResults(data.concept_results);
        setSkillGroupResults(data.skill_group_results)
        setName(data.name)
        setLoading(false)
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }

  let skillsSection

  if (skillGroupResults?.length) {
    skillsSection = <div className="skills-table-container-wrapper">{skillGroupResults[0] && skillGroupResults[0].pre ? <GrowthSkillsTable isExpandable={true} skillGroupResults={skillGroupResults} /> : <SkillsTable isExpandable={true} skillGroupResults={skillGroupResults} />}</div>
  }

  const questions = conceptResults.pre ? conceptResults[preOrPost].questions : conceptResults.questions

  // Step 1: Create a mapping of question_uid to question_number
  const questionNumberMap = questions.reduce((acc, question) => {
    acc[question.question_uid] = question.question_number;
    return acc;
  }, {});


  // Step 2: Sort the skill groups based on the minimum question number in each group
  const sortedSkillGroups = skillGroupResults.sort((a, b) => {
    const minQuestionNumberA = Math.min(...a.question_uids.map(uid => questionNumberMap[uid]).filter(Boolean));
    const minQuestionNumberB = Math.min(...b.question_uids.map(uid => questionNumberMap[uid]).filter(Boolean));
    return minQuestionNumberA - minQuestionNumberB;
  });

  // Step 3: Map the sorted skill groups to React components
  const skillGroups = sortedSkillGroups.map(skillGroup => {
    const questions = conceptResults.questions.filter(q => skillGroup.question_uids.includes(q.question_uid));
    const percentage = (skillGroup.number_correct / (skillGroup.number_correct + skillGroup.number_incorrect)) * 100;

    return (
      <section className="skill-group-section" id={skillGroup.id} key={skillGroup.id} >
        <div className="skill-group-section-header">
          <h2>
            <span>{skillGroup.skill_group}</span>
            <span>{`${Math.round(percentage)}%`}</span>
          </h2>
          <p>{skillGroup.number_of_correct_questions_text}</p>
        </div>
        {questions.map(question => <QuestionTable key={question.question_number} question={question} />)}
      </section>
    );
  });

  let conceptResultElements = skillGroups

  if (conceptResults.pre) {
    conceptResultElements = (<React.Fragment>
      <div className="tabs">
        <Tab activeTab={preOrPost} label="Pre responses" setPreOrPost={setPreOrPost} value={PRE} />
        <Tab activeTab={preOrPost} label="Post responses" setPreOrPost={setPreOrPost} value={POST} />
      </div>
      {skillGroups}
    </React.Fragment>)
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
