import * as React from 'react';

import AssignmentCard from './assignment_card';

import AssignmentFlowNavigation from '../assignment_flow_navigation'
import * as constants from '../assignmentFlowConstants'
import ScrollToTop from '../../shared/scroll_to_top'

const starterDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-starter.svg`
const intermediateDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-intermediate.svg`
const advancedDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-advanced.svg`
const ellDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/icons-diagnostics-ell-intermediate.svg`
const ellStarterDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/icons-diagnostics-ell-starter.svg`
const preApWritingSkillsSrc = `${process.env.CDN_URL}/images/college_board/icons-diagnostics-preap.svg`
const apWritingSkillsSrc = `${process.env.CDN_URL}/images/college_board/icons-diagnostics-ap.svg`
const springBoardWritingSkillsSrc = `${process.env.CDN_URL}/images/college_board/icons-diagnostics-springboard.svg`

const STARTER_DIAGNOSTIC = 'Starter Diagnostic'
const INTERMEDIATE_DIAGNOSTIC = 'Intermediate Diagnostic'
const ADVANCED_DIAGNOSTIC = 'Advanced Diagnostic'
const ELL_STARTER_DIAGNOSTIC = 'ELL Starter Diagnostic'
const ELL_INTERMEDIATE_DIAGNOSTIC = 'ELL Intermediate Diagnostic'
const ELL_ADVANCED_DIAGNOSTIC = 'ELL Advanced Diagnostic'
const PRE_AP_WRITINGS_SKILLS_1 = 'Pre-AP Writing Skills Survey 1'
const PRE_AP_WRITINGS_SKILLS_2 = 'Pre-AP Writing Skills Survey 2'
const AP_WRITINGS_SKILLS = 'AP Writing Skills Survey'
const SPRING_BOARD_WRITINGS_SKILLS = 'SpringBoard Writing Skills Survey'

const STARTER_DIAGNOSTIC_ACTIVITY_ID = 849
const INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID = 850
const ADVANCED_DIAGNOSTIC_ACTIVITY_ID = 888
const ELL_STARTER_DIAGNOSTIC_ACTIVITY_ID = 1161
const ELL_INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID = 1568
const ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID = 1590
const PRE_AP_WRITINGS_SKILLS_1_ACTIVITY_ID = 1229
const PRE_AP_WRITINGS_SKILLS_2_ACTIVITY_ID = 1230
const AP_WRITINGS_SKILLS_ACTIVITY_ID = 992
const SPRING_BOARD_SKILLS_ACTIVITY_ID = 1432

const selectCard = (history: any, unitTemplateName: string, activityIdsArray: string, unitTemplateId: number) => {
  const unitTemplateIdString = unitTemplateId.toString();
  window.localStorage.setItem(constants.UNIT_TEMPLATE_NAME, unitTemplateName)
  window.localStorage.setItem(constants.UNIT_NAME, unitTemplateName)
  window.localStorage.setItem(constants.ACTIVITY_IDS_ARRAY, activityIdsArray)
  window.localStorage.setItem(constants.UNIT_TEMPLATE_ID, unitTemplateIdString)
  history.push(`/assign/select-classes?diagnostic_unit_template_id=${unitTemplateIdString}`)
}

const minis = ({ history }) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Plural and possessive nouns, pronouns, verbs, adjectives, adverbs of manner, commas, prepositions, and capitalization', },
      { key: 'When', text: 'Your students are working on basic grammar concepts.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${STARTER_DIAGNOSTIC_ACTIVITY_ID}`}
    buttonText="Preview"
    header={STARTER_DIAGNOSTIC}
    imgAlt="page with a little writing"
    imgSrc={starterDiagnosticSrc}
    selectCard={() => selectCard(history, STARTER_DIAGNOSTIC, encodeURIComponent([STARTER_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Compound sentences, complex sentences, conjunctive adverbs, pronouns, and commonly confused words', },
      { key: 'When', text: 'Your students have practiced the basics of grammar and are ready to develop their sentence construction skills.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID}`}
    buttonText="Preview"
    header={INTERMEDIATE_DIAGNOSTIC}
    imgAlt="page with a medium amount of writing"
    imgSrc={intermediateDiagnosticSrc}
    selectCard={() => selectCard(history, INTERMEDIATE_DIAGNOSTIC, encodeURIComponent([INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure', },
      { key: 'When', text: 'Your students are experienced with Quill, understand sentence combining, and are ready to develop multi-clause sentences.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${ADVANCED_DIAGNOSTIC_ACTIVITY_ID}`}
    buttonText="Preview"
    header={ADVANCED_DIAGNOSTIC}
    imgAlt="page with a large amount of writing"
    imgSrc={advancedDiagnosticSrc}
    selectCard={() => selectCard(history, ADVANCED_DIAGNOSTIC, encodeURIComponent([ADVANCED_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Simple verb conjugation, articles, subject-verb agreement, simple word order, singular and plural nouns, and adjective placement', },
      { key: 'When', text: 'Your students are beginning English language learners who are working on foundational grammar skills.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${ELL_STARTER_DIAGNOSTIC_ACTIVITY_ID}`}
    buttonText="Preview"
    header={ELL_STARTER_DIAGNOSTIC}
    imgAlt="page with less writing that says ELL in the corner"
    imgSrc={ellStarterDiagnosticSrc}
    selectCard={() => selectCard(history, ELL_STARTER_DIAGNOSTIC, encodeURIComponent([ELL_STARTER_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Subject-verb agreement, possessives, prepositions, future tense, articles, and intermediate questions.', },
      { key: 'When', text: 'Your students are English language learners who have a foundational understanding of basic English grammar but need more practice with certain concepts.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${ELL_INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID}`}
    buttonText="Preview"
    header={ELL_INTERMEDIATE_DIAGNOSTIC}
    imgAlt="page with writing that says ELL in the corner"
    imgSrc={ellDiagnosticSrc}
    selectCard={() => selectCard(history, ELL_INTERMEDIATE_DIAGNOSTIC, encodeURIComponent([ELL_INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Regular and irregular past tense, progressive tenses, phrasal verbs, choosing between prepositions, responding to questions, and commonly confused words', },
      { key: 'When', text: 'When: Your students are English language learners who need practice with more difficult ELL skills before moving on to the Starter Diagnostic.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID}`}
    buttonText="Preview"
    header={ELL_ADVANCED_DIAGNOSTIC}
    imgAlt="page with writing that says ELL in the corner"
    imgSrc={ellDiagnosticSrc}
    selectCard={() => selectCard(history, ELL_ADVANCED_DIAGNOSTIC, encodeURIComponent([ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID].toString()), constants.ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure', },
      { key: 'When', text: 'Your students are developing their advanced sentence-level writing skills to prepare for writing in an AP® classroom.', }
    ]}
    buttonLink={`/activity_sessions/anonymous?activity_id=${AP_WRITINGS_SKILLS_ACTIVITY_ID}`}
    buttonText="Preview"
    header={AP_WRITINGS_SKILLS}
    imgAlt="page with writing that says AP in corner"
    imgSrc={apWritingSkillsSrc}
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
    imgAlt="page with writing that says Pre-AP on bottom"
    imgSrc={preApWritingSkillsSrc}
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
    imgAlt="page with writing that says Pre-AP on bottom"
    imgSrc={preApWritingSkillsSrc}
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
    imgAlt="page with writing that says SpringBoard on bottom"
    imgSrc={springBoardWritingSkillsSrc}
    selectCard={() => selectCard(history, SPRING_BOARD_WRITINGS_SKILLS, encodeURIComponent([SPRING_BOARD_SKILLS_ACTIVITY_ID].toString()), constants.SPRING_BOARD_SKILLS_UNIT_TEMPLATE_ID)}
  />)
];

const AssignADiagnostic = (props: any) => (
  <div className="assignment-flow-container">
    <AssignmentFlowNavigation />
    <ScrollToTop />
    <div className="diagnostic-page container">
      <h1>Which diagnostic covers the skills you want to assess?</h1>
      <div className="minis">{minis(props)}</div>
    </div>
  </div>
);

export default AssignADiagnostic
