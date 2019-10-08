import * as React from 'react';
import AssignmentCard from './assignment_card';
import AssignmentFlowNavigation from '../assignment_flow_navigation'
import { UNIT_TEMPLATE_NAME, UNIT_TEMPLATE_ID, ACTIVITY_IDS_ARRAY, } from '../localStorageKeyConstants'
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
  window.localStorage.setItem(ACTIVITY_IDS_ARRAY, activityIdsArray)
  window.localStorage.setItem(UNIT_TEMPLATE_ID, unitTemplateId)
  router.push(`/assign/select-classes?unit_template_id=${unitTemplateId}`)
}

const minis = (props) => [
  (<AssignmentCard
    selectCard={() => selectCard(props.router, STARTER_DIAGNOSTIC, encodeURIComponent([849].toString()), 99)}
    buttonText="Preview"
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKX2sTTnPVhTOrWyUx9"
    header={STARTER_DIAGNOSTIC}
    imgSrc={starterDiagnosticSrc}
    imgAlt="page with a little writing"
    bodyArray={[
      { key: 'What', text: 'Plural and possessive nouns, pronouns, verbs, adjectives, adverbs of manners, commas, prepositions, and capitalization', },
      { key: 'When', text: 'Your students are working on basic grammar concepts.', }
    ]}
  />),
  (<AssignmentCard
    selectCard={() => selectCard(props.router, INTERMEDIATE_DIAGNOSTIC, encodeURIComponent([850].toString()), 100)}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKbzH_Er916zGjgHk5U"
    buttonText="Preview"
    header={INTERMEDIATE_DIAGNOSTIC}
    imgSrc={intermediateDiagnosticSrc}
    imgAlt="page with a medium amount of writing"
    bodyArray={[
      { key: 'What', text: 'Compound sentences, complex sentences, conjunctive adverbs, pronouns, and commonly confused words', },
      { key: 'When', text: 'Your students have practiced the basics of grammar and are ready to develop their sentence construction skills.', }
    ]}
  />),
  (<AssignmentCard
    selectCard={() => selectCard(props.router, ADVANCED_DIAGNOSTIC, encodeURIComponent([888].toString()), 126)}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LVxlcVPdW5DvAh_xgnj"
    buttonText="Preview"
    header={ADVANCED_DIAGNOSTIC}
    imgSrc={advancedDiagnosticSrc}
    imgAlt="page with a large amount of writing"
    bodyArray={[
      { key: 'What', text: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure', },
      { key: 'When', text: 'Your students are experienced with Quill, understand sentence combining, and are ready to develop multi-clause sentences.', }
    ]}
  />),
  (<AssignmentCard
    selectCard={() => selectCard(props.router, ELL_DIAGNOSTIC, encodeURIComponent([447].toString()), 34)}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/ell"
    buttonText="Preview"
    header={ELL_DIAGNOSTIC}
    imgSrc={ellDiagnosticSrc}
    imgAlt="page with writing that says ELL in the corner"
    bodyArray={[
      { key: 'What', text: 'Subject-verb agreement, verb tense, adjectives, adverbs, articles, and prepositions', },
      { key: 'When', text: 'Built for English Language Learners at the developing, expanding or bridging stages of language proficiency (WIDA Levels 3-5).', }
    ]}
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
