import * as React from 'react';

import AssignmentCard from './assignment_card';

import AssignmentFlowNavigation from '../assignment_flow_navigation'
import * as constants from '../assignmentFlowConstants'
import ScrollToTop from '../../shared/scroll_to_top'

const STARTER_DIAGNOSTIC = 'Starter Baseline Diagnostic (Pre)'
const STARTER_DIAGNOSTIC_POST = 'Starter Growth Diagnostic (Post)'
const INTERMEDIATE_DIAGNOSTIC = 'Intermediate Baseline Diagnostic (Pre)'
const INTERMEDIATE_DIAGNOSTIC_POST = 'Intermediate Growth Diagnostic (Post)'
const ADVANCED_DIAGNOSTIC = 'Advanced Baseline Diagnostic (Pre)'
const ADVANCED_DIAGNOSTIC_POST = 'Advanced Growth Diagnostic (Post)'
const ELL_STARTER_DIAGNOSTIC = 'ELL Starter Baseline Diagnostic (Pre)'
const ELL_STARTER_DIAGNOSTIC_POST = 'ELL Starter Growth Diagnostic (Post)'
const ELL_INTERMEDIATE_DIAGNOSTIC = 'ELL Intermediate Baseline Diagnostic (Pre)'
const ELL_INTERMEDIATE_DIAGNOSTIC_POST = 'ELL Intermediate Growth Diagnostic (Post)'
const ELL_ADVANCED_DIAGNOSTIC = 'ELL Advanced Baseline Diagnostic (Pre)'
const ELL_ADVANCED_DIAGNOSTIC_POST = 'ELL Advanced Growth Diagnostic (Post)'
const PRE_AP_WRITINGS_SKILLS_1 = 'Pre-AP Writing Skills Survey 1'
const PRE_AP_WRITINGS_SKILLS_2 = 'Pre-AP Writing Skills Survey 2'
const AP_WRITINGS_SKILLS = 'AP Writing Skills Survey'
const SPRING_BOARD_WRITINGS_SKILLS = 'SpringBoard Writing Skills Survey'

const STARTER_DIAGNOSTIC_ACTIVITY_ID = 1663
const STARTER_DIAGNOSTIC_POST_ACTIVITY_ID = 1664
const INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID = 1668
const INTERMEDIATE_DIAGNOSTIC_POST_ACTIVITY_ID = 1669
const ADVANCED_DIAGNOSTIC_ACTIVITY_ID = 1678
const ADVANCED_DIAGNOSTIC_POST_ACTIVITY_ID = 1680
const ELL_STARTER_DIAGNOSTIC_ACTIVITY_ID = 1161
const ELL_STARTER_DIAGNOSTIC_POST_ACTIVITY_ID = 1774
const ELL_INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID = 1568
const ELL_INTERMEDIATE_DIAGNOSTIC_POST_ACTIVITY_ID = 1814
const ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID = 1590
const ELL_ADVANCED_DIAGNOSTIC_POST_ACTIVITY_ID = 1818
const PRE_AP_WRITINGS_SKILLS_1_ACTIVITY_ID = 1229
const PRE_AP_WRITINGS_SKILLS_2_ACTIVITY_ID = 1230
const AP_WRITINGS_SKILLS_ACTIVITY_ID = 992
const SPRING_BOARD_SKILLS_ACTIVITY_ID = 1432

const ALL = 'All'
const GENERAL = 'General'
const ELL = 'ELL'
const COLLEGEBOARD = 'CollegeBoard'

const STARTER_POST_TEST_LOCKED_TEXT = "This is locked because you haven't assigned the Starter Baseline Diagnostic yet. Assign it to unlock the Starter Growth Diagnostic."
const INTERMEDIATE_POST_TEST_LOCKED_TEXT = "This is locked because you haven't assigned the Intermediate Baseline Diagnostic yet. Assign it to unlock the Intermediate Growth Diagnostic."
const ADVANCED_POST_TEST_LOCKED_TEXT = "This is locked because you haven't assigned the Advanced Baseline Diagnostic yet. Assign it to unlock the Advanced Growth Diagnostic."

const ELL_STARTER_POST_TEST_LOCKED_TEXT = "This is locked because you haven't assigned the ELL Starter Baseline Diagnostic yet. Assign it to unlock the ELL Starter Growth Diagnostic."
const ELL_INTERMEDIATE_POST_TEST_LOCKED_TEXT = "This is locked because you haven't assigned the ELL Intermediate Baseline Diagnostic yet. Assign it to unlock the ELL Intermediate Growth Diagnostic."
const ELL_ADVANCED_POST_TEST_LOCKED_TEXT = "This is locked because you haven't assigned the ELL Advanced Baseline Diagnostic yet. Assign it to unlock the ELL Advanced Growth Diagnostic."

const selectCard = (history: any, unitTemplateName: string, activityIdsArray: string, unitTemplateId: number) => {
  const unitTemplateIdString = unitTemplateId.toString();
  window.localStorage.setItem(constants.UNIT_TEMPLATE_NAME, unitTemplateName)
  window.localStorage.setItem(constants.UNIT_NAME, unitTemplateName)
  window.localStorage.setItem(constants.ACTIVITY_IDS_ARRAY, activityIdsArray)
  window.localStorage.setItem(constants.UNIT_TEMPLATE_ID, unitTemplateIdString)
  history.push(`/assign/select-classes?diagnostic_unit_template_id=${unitTemplateIdString}`)
}

const generalDiagnosticMinis = ({ history, assignedPreTests, }) => {
  function isLocked(postTestActivityId) {
    const assignedPreTest = assignedPreTests.find(pretest => pretest.post_test_id === postTestActivityId)
    return assignedPreTest && !assignedPreTest.assigned_classroom_ids.length
  }

  return [
    (<div className="grouped-minis" key="starter">
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'Plural and possessive nouns, verbs, adjectives, adverbs of manner, commas, prepositions, basic capitalization, and commonly confused words', },
          { key: 'When', text: 'Your students are working on basic grammar concepts.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${STARTER_DIAGNOSTIC_ACTIVITY_ID}`}
        buttonText="Preview"
        header={STARTER_DIAGNOSTIC}
        selectCard={() => selectCard(history, STARTER_DIAGNOSTIC, encodeURIComponent([STARTER_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
      />
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'The Starter Growth Diagnostic has different questions but covers the same skills as the Starter Baseline Diagnostic.', },
          { key: 'When', text: "Your students have completed the Starter Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.", }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${STARTER_DIAGNOSTIC_POST_ACTIVITY_ID}`}
        buttonText="Preview"
        header={STARTER_DIAGNOSTIC_POST}
        lockedText={isLocked(STARTER_DIAGNOSTIC_POST_ACTIVITY_ID) && STARTER_POST_TEST_LOCKED_TEXT}
        selectCard={() => selectCard(history, STARTER_DIAGNOSTIC_POST, encodeURIComponent([STARTER_DIAGNOSTIC_POST_ACTIVITY_ID].toString()), constants.STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID)}
        showNewTag={true}
      />
    </div>),
    (<div className="grouped-minis" key="intermediate">
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'Compound sentences, complex sentences, conjunctive adverbs, pronouns, and advanced capitalization', },
          { key: 'When', text: 'Your students have practiced the basics of grammar and are ready to develop their sentence construction skills.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID}`}
        buttonText="Preview"
        header={INTERMEDIATE_DIAGNOSTIC}
        selectCard={() => selectCard(history, INTERMEDIATE_DIAGNOSTIC, encodeURIComponent([INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
      />
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'The Intermediate Growth Diagnostic has different questions but covers the same skills as the Intermediate Baseline Diagnostic.', },
          { key: 'When', text: 'Your students have completed the Intermediate Baseline Diagnostic, you\'ve assigned the recommended practice, and now you\'re ready to measure their growth.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${INTERMEDIATE_DIAGNOSTIC_POST_ACTIVITY_ID}`}
        buttonText="Preview"
        header={INTERMEDIATE_DIAGNOSTIC_POST}
        lockedText={isLocked(INTERMEDIATE_DIAGNOSTIC_POST_ACTIVITY_ID) && INTERMEDIATE_POST_TEST_LOCKED_TEXT}
        selectCard={() => selectCard(history, INTERMEDIATE_DIAGNOSTIC_POST, encodeURIComponent([INTERMEDIATE_DIAGNOSTIC_POST_ACTIVITY_ID].toString()), constants.INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID)}
        showNewTag={true}
      />
    </div>),
    (<div className="grouped-minis" key="advanced">
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure', },
          { key: 'When', text: 'Your students are experienced with Quill, understand sentence combining, and are ready to develop multi-clause sentences.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${ADVANCED_DIAGNOSTIC_ACTIVITY_ID}`}
        buttonText="Preview"
        header={ADVANCED_DIAGNOSTIC}
        selectCard={() => selectCard(history, ADVANCED_DIAGNOSTIC, encodeURIComponent([ADVANCED_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
      />
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'The Advanced Growth Diagnostic has different questions but covers the same skills as the Advanced Baseline Diagnostic.', },
          { key: 'When', text: 'Your students have completed the Advanced Baseline Diagnostic, you\'ve assigned the recommended practice, and now you\'re ready to measure their growth.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${ADVANCED_DIAGNOSTIC_ACTIVITY_ID}`}
        buttonText="Preview"
        header={ADVANCED_DIAGNOSTIC_POST}
        lockedText={isLocked(ADVANCED_DIAGNOSTIC_POST_ACTIVITY_ID) && ADVANCED_POST_TEST_LOCKED_TEXT}
        selectCard={() => selectCard(history, ADVANCED_DIAGNOSTIC_POST, encodeURIComponent([ADVANCED_DIAGNOSTIC_POST_ACTIVITY_ID].toString()), constants.ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID)}
        showNewTag={true}
      />
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
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'Simple verb conjugation, articles, subject-verb agreement, simple word order, singular and plural nouns, and adjective placement', },
          { key: 'When', text: 'Your students are beginning English language learners who are working on foundational grammar skills.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${ELL_STARTER_DIAGNOSTIC_ACTIVITY_ID}`}
        buttonText="Preview"
        header={ELL_STARTER_DIAGNOSTIC}
        selectCard={() => selectCard(history, ELL_STARTER_DIAGNOSTIC, encodeURIComponent([ELL_STARTER_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
      />
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'The ELL Starter Growth Diagnostic has different questions but covers the same skills as the ELL Starter Baseline Diagnostic.', },
          { key: 'When', text: "Your students have completed the ELL Starter Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.", }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${STARTER_DIAGNOSTIC_POST_ACTIVITY_ID}`}
        buttonText="Preview"
        header={ELL_STARTER_DIAGNOSTIC_POST}
        lockedText={isLocked(ELL_STARTER_DIAGNOSTIC_POST_ACTIVITY_ID) && ELL_STARTER_POST_TEST_LOCKED_TEXT}
        selectCard={() => selectCard(history, ELL_STARTER_DIAGNOSTIC_POST, encodeURIComponent([ELL_STARTER_DIAGNOSTIC_POST_ACTIVITY_ID].toString()), constants.ELL_STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID)}
        showNewTag={true}
      />
    </div>),
    (<div className="grouped-minis" key="ell-intermediate">
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'Subject-verb agreement, possessives, prepositions, future tense, articles, and intermediate questions', },
          { key: 'When', text: 'Your students are English language learners who have a foundational understanding of basic English grammar but need more practice with certain concepts.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${ELL_INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID}`}
        buttonText="Preview"
        header={ELL_INTERMEDIATE_DIAGNOSTIC}
        selectCard={() => selectCard(history, ELL_INTERMEDIATE_DIAGNOSTIC, encodeURIComponent([ELL_INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
      />
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'The ELL Intermediate Growth Diagnostic has different questions but covers the same skills as the ELL Intermediate Baseline Diagnostic.', },
          { key: 'When', text: 'Your students have completed the ELL Intermediate Baseline Diagnostic, you\'ve assigned the recommended practice, and now you\'re ready to measure their growth.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${INTERMEDIATE_DIAGNOSTIC_POST_ACTIVITY_ID}`}
        buttonText="Preview"
        header={ELL_INTERMEDIATE_DIAGNOSTIC_POST}
        lockedText={isLocked(ELL_INTERMEDIATE_DIAGNOSTIC_POST_ACTIVITY_ID) && ELL_INTERMEDIATE_POST_TEST_LOCKED_TEXT}
        selectCard={() => selectCard(history, ELL_INTERMEDIATE_DIAGNOSTIC_POST, encodeURIComponent([ELL_INTERMEDIATE_DIAGNOSTIC_POST_ACTIVITY_ID].toString()), constants.ELL_INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID)}
        showNewTag={true}
      />
    </div>),
    (<div className="grouped-minis" key="ell-advanced">
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'Regular and irregular past tense, progressive tenses, phrasal verbs, choosing between prepositions, responding to questions, and commonly confused words', },
          { key: 'When', text: 'Your students are English language learners who need practice with more difficult ELL skills before moving on to the Starter Diagnostic.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID}`}
        buttonText="Preview"
        header={ELL_ADVANCED_DIAGNOSTIC}
        selectCard={() => selectCard(history, ELL_ADVANCED_DIAGNOSTIC, encodeURIComponent([ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
      />
      <AssignmentCard
        bodyArray={[
          { key: 'What', text: 'The ELL Advanced Growth Diagnostic has different questions but covers the same skills as the ELL Advanced Baseline Diagnostic.', },
          { key: 'When', text: 'Your students have completed the ELL Advanced Baseline Diagnostic, you\'ve assigned the recommended practice, and now you\'re ready to measure their growth.', }
        ]}
        buttonLink={`/activity_sessions/anonymous?activity_id=${ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID}`}
        buttonText="Preview"
        header={ELL_ADVANCED_DIAGNOSTIC_POST}
        lockedText={isLocked(ELL_ADVANCED_DIAGNOSTIC_POST_ACTIVITY_ID) && ELL_ADVANCED_POST_TEST_LOCKED_TEXT}
        selectCard={() => selectCard(history, ELL_ADVANCED_DIAGNOSTIC_POST, encodeURIComponent([ELL_ADVANCED_DIAGNOSTIC_POST_ACTIVITY_ID].toString()), constants.ELL_ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID)}
        showNewTag={true}
      />
    </div>)
  ]
}


const collegeBoardDiagnosticMinis = ({ history }) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure', },
      { key: 'When', text: 'Your students are developing their advanced sentence-level writing skills to prepare for writing in an AP® classroom.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${AP_WRITINGS_SKILLS_ACTIVITY_ID}`}
    buttonText="Preview"
    header={AP_WRITINGS_SKILLS}
    selectCard={() => selectCard(history, AP_WRITINGS_SKILLS, encodeURIComponent([AP_WRITINGS_SKILLS_ACTIVITY_ID].toString()), constants.AP_WRITINGS_SKILLS_UNIT_TEMPLATE_ID)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Subject-verb agreement, pronouns, and coordinating and subordinating conjunctions', },
      { key: 'When', text: 'Your students are working on basic sentence patterns and the skills outlined in the Pre-AP® English High School Course Framework.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${PRE_AP_WRITINGS_SKILLS_1_ACTIVITY_ID}`}
    buttonText="Preview"
    header={PRE_AP_WRITINGS_SKILLS_1}
    selectCard={() => selectCard(history, PRE_AP_WRITINGS_SKILLS_1, encodeURIComponent([PRE_AP_WRITINGS_SKILLS_1_ACTIVITY_ID].toString()), constants.PRE_AP_WRITINGS_SKILLS_1_UNIT_TEMPLATE_ID)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Conjunctive adverbs, relative clauses, appositive phrases, participial phrases, and parallel structure', },
      { key: 'When', text: 'Your students are working on basic sentence patterns and the skills outlined in the Pre-AP® English High School Course Framework.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${PRE_AP_WRITINGS_SKILLS_2_ACTIVITY_ID}`}
    buttonText="Preview"
    header={PRE_AP_WRITINGS_SKILLS_2}
    selectCard={() => selectCard(history, PRE_AP_WRITINGS_SKILLS_2, encodeURIComponent([PRE_AP_WRITINGS_SKILLS_2_ACTIVITY_ID].toString()), constants.PRE_AP_WRITINGS_SKILLS_2_UNIT_TEMPLATE_ID)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Subject-verb agreement, pronouns, coordinating and subordinating conjunctions, prepositional phrases, and commonly confused words', },
      { key: 'When', text: 'Your students are working on basic sentence patterns and the grammar skills covered in the SpringBoard grades 6-8 materials.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${SPRING_BOARD_SKILLS_ACTIVITY_ID}`}
    buttonText="Preview"
    header={SPRING_BOARD_WRITINGS_SKILLS}
    selectCard={() => selectCard(history, SPRING_BOARD_WRITINGS_SKILLS, encodeURIComponent([SPRING_BOARD_SKILLS_ACTIVITY_ID].toString()), constants.SPRING_BOARD_SKILLS_UNIT_TEMPLATE_ID)}
  />)
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

  return (<div className="assignment-flow-container">
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
  </div>)
};

export default AssignADiagnostic
