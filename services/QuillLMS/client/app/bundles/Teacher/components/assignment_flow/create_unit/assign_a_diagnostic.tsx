import * as React from 'react';
import AssignmentCard from './assignment_card';
import AssignmentFlowNavigation from '../assignment_flow_navigation'
import { UNIT_TEMPLATE_NAME, UNIT_TEMPLATE_ID, ACTIVITY_IDS_ARRAY, UNIT_NAME, } from '../localStorageKeyConstants'
import ScrollToTop from '../../shared/scroll_to_top'

const starterDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-starter.svg`
const intermediateDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-intermediate.svg`
const advancedDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-advanced.svg`
const ellDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-ell.svg`

const STARTER_DIAGNOSTIC = 'Starter Diagnostic'
const INTERMEDIATE_DIAGNOSTIC = 'Intermediate Diagnostic'
const ADVANCED_DIAGNOSTIC = 'Advanced Diagnostic'
const ELL_DIAGNOSTIC = 'ELL Diagnostic'

const selectCard = (router, unitTemplateName, activityIdsArray, unitTemplateId) => {
  window.localStorage.setItem(UNIT_TEMPLATE_NAME, unitTemplateName)
  window.localStorage.setItem(UNIT_NAME, unitTemplateName)
  window.localStorage.setItem(ACTIVITY_IDS_ARRAY, activityIdsArray)
  window.localStorage.setItem(UNIT_TEMPLATE_ID, unitTemplateId)
  router.push(`/assign/select-classes?diagnostic_unit_template_id=${unitTemplateId}`)
}

const minis = (props) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Plural and possessive nouns, pronouns, verbs, adjectives, adverbs of manners, commas, prepositions, and capitalization', },
      { key: 'When', text: 'Your students are working on basic grammar concepts.', }
    ]}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKX2sTTnPVhTOrWyUx9"
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKX2sTTnPVhTOrWyUx9"
    buttonText="Preview"
    buttonText="Preview"
    header={STARTER_DIAGNOSTIC}
    header={STARTER_DIAGNOSTIC}
    imgAlt="page with a little writing"
    imgAlt="page with a little writing"
    imgSrc={starterDiagnosticSrc}
    imgSrc={starterDiagnosticSrc}
    link={`${process.env.DEFAULT_URL}/teachers/classrooms/assign_activities/new_unit/students/edit/name/${encodeURIComponent(STARTER_DIAGNOSTIC)}/activity_ids/${encodeURIComponent([849].toString())}?unit_template_id=${99}`}
    selectCard={() => selectCard(props.router, STARTER_DIAGNOSTIC, encodeURIComponent([849].toString()), 99)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Compound sentences, complex sentences, conjunctive adverbs, pronouns, and commonly confused words', },
      { key: 'When', text: 'Your students have practiced the basics of grammar and are ready to develop their sentence construction skills.', }
    ]}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKbzH_Er916zGjgHk5U"
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKbzH_Er916zGjgHk5U"
    buttonText="Preview"
    buttonText="Preview"
    header={INTERMEDIATE_DIAGNOSTIC}
    header={INTERMEDIATE_DIAGNOSTIC}
    imgAlt="page with a medium amount of writing"
    imgAlt="page with a medium amount of writing"
    imgSrc={intermediateDiagnosticSrc}
    imgSrc={intermediateDiagnosticSrc}
    link={`${process.env.DEFAULT_URL}/teachers/classrooms/assign_activities/new_unit/students/edit/name/${encodeURIComponent(INTERMEDIATE_DIAGNOSTIC)}/activity_ids/${encodeURIComponent([850].toString())}?unit_template_id=${100}`}
    selectCard={() => selectCard(props.router, INTERMEDIATE_DIAGNOSTIC, encodeURIComponent([850].toString()), 100)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure', },
      { key: 'When', text: 'Your students are experienced with Quill, understand sentence combining, and are ready to develop multi-clause sentences.', }
    ]}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LVxlcVPdW5DvAh_xgnj"
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LVxlcVPdW5DvAh_xgnj"
    buttonText="Preview"
    buttonText="Preview"
    header={ADVANCED_DIAGNOSTIC}
    header={ADVANCED_DIAGNOSTIC}
    imgAlt="page with a large amount of writing"
    imgAlt="page with a large amount of writing"
    imgSrc={advancedDiagnosticSrc}
    imgSrc={advancedDiagnosticSrc}
    link={`${process.env.DEFAULT_URL}/teachers/classrooms/assign_activities/new_unit/students/edit/name/${encodeURIComponent(ADVANCED_DIAGNOSTIC)}/activity_ids/${encodeURIComponent([888].toString())}?unit_template_id=${126}`}
    selectCard={() => selectCard(props.router, ADVANCED_DIAGNOSTIC, encodeURIComponent([888].toString()), 126)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Subject-verb agreement, verb tense, adjectives, adverbs, articles, and prepositions', },
      { key: 'When', text: 'Built for English Language Learners at the developing, expanding or bridging stages of language proficiency (WIDA Levels 3-5).', }
    ]}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/ell"
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/ell"
    buttonText="Preview"
    buttonText="Preview"
    header={ELL_DIAGNOSTIC}
    header={ELL_DIAGNOSTIC}
    imgAlt="page with writing that says ELL in the corner"
    imgAlt="page with writing that says ELL in the corner"
    imgSrc={ellDiagnosticSrc}
    imgSrc={ellDiagnosticSrc}
    link={`${process.env.DEFAULT_URL}/teachers/classrooms/assign_activities/new_unit/students/edit/name/${encodeURIComponent(ELL_DIAGNOSTIC)}/activity_ids/${encodeURIComponent([447].toString())}?unit_template_id=${34}`}
    selectCard={() => selectCard(props.router, ELL_DIAGNOSTIC, encodeURIComponent([447].toString()), 34)}
  />)
];

const AssignADiagnostic = (props) => (
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
