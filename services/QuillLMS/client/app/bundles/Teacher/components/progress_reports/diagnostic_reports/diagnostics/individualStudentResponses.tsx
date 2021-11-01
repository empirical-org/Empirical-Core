import * as React from 'react'
import qs from 'qs'
import { withRouter, Link, } from 'react-router-dom';

import SkillsTable from './skillsTable'
import GrowthSkillsTable from './growthSkillsTable'
import {
  fileDocumentIcon,
} from './shared'

import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import { requestGet } from '../../../../../../modules/request/index';

const IndividualStudentResponses = ({ match, passedConceptResults, passedSkillResults, mobileNavigation, }) => {
  const [loading, setLoading] = React.useState<boolean>(!(passedConceptResults && passedSkillResults));
  const [name, setName] = React.useState('')
  const [conceptResults, setConceptResults] = React.useState(passedConceptResults || []);
  const [skillResults, setSkillResults] = React.useState(passedSkillResults || []);

  const { activityId, classroomId, studentId, } = match.params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `&unit_id=${unitId}` : ''

  React.useEffect(() => {
    getData()
  }, [])

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

  return (<main className="individual-student-responses-container">
    <header>
      <h1>{name}&#39;s responses</h1>
      <a className="focus-on-light" href="/">{fileDocumentIcon}<span>Guide</span></a>
    </header>
    {mobileNavigation}
    {skillResults.skills[0].pre ? <GrowthSkillsTable skillGroup={skillResults} /> : <SkillsTable skillGroup={skillResults} />}
  </main>)

}

export default withRouter(IndividualStudentResponses)
