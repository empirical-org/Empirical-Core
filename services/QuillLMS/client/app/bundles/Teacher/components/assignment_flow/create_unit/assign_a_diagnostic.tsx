import * as React from 'react';

import AssignmentCard from './assignment_card';

import ScrollToTop from '../../shared/scroll_to_top';
import * as constants from '../assignmentFlowConstants';
import AssignmentFlowNavigation from '../assignment_flow_navigation';

const ALL = 'All'
const GENERAL = 'General'
const ELL = 'ELL'
const COLLEGEBOARD = 'CollegeBoard'

const selectCard = (history: any, unitTemplateName: string, activityIdsArray: string, unitTemplateId: number) => {
  const unitTemplateIdString = unitTemplateId.toString();
  window.localStorage.setItem(constants.UNIT_TEMPLATE_NAME, unitTemplateName)
  window.localStorage.setItem(constants.UNIT_NAME, unitTemplateName)
  window.localStorage.setItem(constants.ACTIVITY_IDS_ARRAY, activityIdsArray)
  window.localStorage.setItem(constants.UNIT_TEMPLATE_ID, unitTemplateIdString)
  history.push(`/assign/select-classes?diagnostic_unit_template_id=${unitTemplateIdString}`)
}

interface Diagnostic {
  activityId: number;
  name: string;
  unitTemplateId: number;
  what: string;
  when: string;
  lockedText?: string
}

const DiagnosticAssignmentCard = ({ history, diagnostic, lockedText, showNewTag, }: { history: any, diagnostic: Diagnostic, lockedText?: string, showNewTag?: boolean, }) => {
  function onSelectCard() { selectCard(history, diagnostic.name, encodeURIComponent([diagnostic.activityId].toString()), diagnostic.unitTemplateId) }

  return (
    <AssignmentCard
      bodyArray={[
        { key: 'What', text: diagnostic.what, },
        { key: 'When', text: diagnostic.when, }
      ]}
      buttonLink={`/activity_sessions/anonymous?activity_id=${diagnostic.activityId}`}
      buttonText="Preview"
      header={diagnostic.name}
      lockedText={lockedText}
      selectCard={onSelectCard}
      showNewTag={showNewTag}
    />
  )
}

const generalDiagnosticMinis = ({ history, assignedPreTests, }) => {
  function isLocked(postTestActivityId) {
    const assignedPreTest = assignedPreTests.find(pretest => pretest.post_test_id === postTestActivityId)
    return assignedPreTest && !assignedPreTest.assigned_classroom_ids.length
  }

  return [
    (<div className="grouped-minis" key="starter">
      <DiagnosticAssignmentCard diagnostic={constants.starterPreTest} history={history} />
      <DiagnosticAssignmentCard diagnostic={constants.starterPostTest} history={history} lockedText={isLocked(constants.starterPostTest.activityId) && constants.starterPostTest.lockedText} showNewTag={true} />
    </div>),
    (<div className="grouped-minis" key="intermediate">
      <DiagnosticAssignmentCard diagnostic={constants.intermediatePreTest} history={history} />
      <DiagnosticAssignmentCard diagnostic={constants.intermediatePostTest} history={history} lockedText={isLocked(constants.intermediatePostTest.activityId) && constants.intermediatePostTest.lockedText} showNewTag={true} />
    </div>),
    (<div className="grouped-minis" key="advanced">
      <DiagnosticAssignmentCard diagnostic={constants.advancedPreTest} history={history} />
      <DiagnosticAssignmentCard diagnostic={constants.advancedPostTest} history={history} lockedText={isLocked(constants.advancedPostTest.activityId) && constants.advancedPostTest.lockedText} showNewTag={true} />
    </div>)
  ]
}

const ellDiagnosticMinis = ({ history, assignedPreTests, }) => {
  function isLocked(postTestActivityId) {
    const assignedPreTest = assignedPreTests.find(pretest => pretest.post_test_id === postTestActivityId)
    return assignedPreTest && !assignedPreTest.assigned_classroom_ids.length
  }

  return [
    (<div className="grouped-minis" key="ell-starter">
      <DiagnosticAssignmentCard diagnostic={constants.ellStarterPreTest} history={history} />
      <DiagnosticAssignmentCard diagnostic={constants.ellStarterPostTest} history={history} lockedText={isLocked(constants.ellStarterPostTest.activityId) && constants.ellStarterPostTest.lockedText} showNewTag={true} />
    </div>),
    (<div className="grouped-minis" key="ell-intermediate">
      <DiagnosticAssignmentCard diagnostic={constants.ellIntermediatePreTest} history={history} />
      <DiagnosticAssignmentCard diagnostic={constants.ellIntermediatePostTest} history={history} lockedText={isLocked(constants.ellIntermediatePostTest.activityId) && constants.ellIntermediatePostTest.lockedText} showNewTag={true} />
    </div>),
    (<div className="grouped-minis" key="ell-advanced">
      <DiagnosticAssignmentCard diagnostic={constants.ellAdvancedPreTest} history={history} />
      <DiagnosticAssignmentCard diagnostic={constants.ellAdvancedPostTest} history={history} lockedText={isLocked(constants.ellAdvancedPostTest.activityId) && constants.ellAdvancedPostTest.lockedText} showNewTag={true} />
    </div>)
  ]
}

const collegeBoardDiagnosticMinis = ({ history }) => [
  <DiagnosticAssignmentCard diagnostic={constants.apWritingSkills} history={history} key="ap" />,
  <DiagnosticAssignmentCard diagnostic={constants.preAPWritingSkills1} history={history} key="pre-ap-1" />,
  <DiagnosticAssignmentCard diagnostic={constants.preAPWritingSkills2} history={history} key="pre-ap-2" />,
  <DiagnosticAssignmentCard diagnostic={constants.springboardWritingSkills} history={history} key="springboard" />
];

const FilterTab = ({ activeFilter, filter, setFilter, number, }) => {
  function handleClick() { setFilter(filter) }
  const className = activeFilter === filter ? 'active filter-tab focus-on-light' : 'filter-tab focus-on-light'
  return <button className={className} onClick={handleClick} type="button">{filter} ({number})</button>
}

const AssignADiagnostic = ({ history, assignedPreTests, }) => {
  const [filter, setFilter] = React.useState(ALL)

  const general = generalDiagnosticMinis({ history, assignedPreTests, })
  const ell = ellDiagnosticMinis({ history, assignedPreTests, })
  const collegeBoard = collegeBoardDiagnosticMinis({ history, })
  const all = [general, ell, collegeBoard].flat()
  let minis = all
  switch(filter) {
    case GENERAL:
      minis = general;
      break;
    case ELL:
      minis = ell;
      break;
    case COLLEGEBOARD:
      minis = collegeBoard;
      break;
  }

  return (
    <div className="assignment-flow-container">
      <AssignmentFlowNavigation />
      <ScrollToTop />
      <div className="diagnostic-page container">
        <h1>Which diagnostic covers the skills you want to assess?</h1>
        <section className="filter-tabs">
          <FilterTab activeFilter={filter} filter={ALL} number={16} setFilter={setFilter} />
          <FilterTab activeFilter={filter} filter={GENERAL} number={6} setFilter={setFilter} />
          <FilterTab activeFilter={filter} filter={ELL} number={6} setFilter={setFilter} />
          <FilterTab activeFilter={filter} filter={COLLEGEBOARD} number={4} setFilter={setFilter} />
        </section>
        <div className="minis">{minis}</div>
      </div>
    </div>
  )
};

export default AssignADiagnostic
