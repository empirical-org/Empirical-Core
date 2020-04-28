import * as React from 'react';
import AssignmentCard from './assignment_card';
import AssignmentFlowNavigation from '../assignment_flow_navigation'
import { UNIT_TEMPLATE_NAME, UNIT_TEMPLATE_ID, ACTIVITY_IDS_ARRAY, UNIT_NAME, } from '../localStorageKeyConstants'
import ScrollToTop from '../../shared/scroll_to_top'

const starterDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-starter.svg`
const intermediateDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-intermediate.svg`
const advancedDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-advanced.svg`
const ellDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-ell.svg`
const ellStarterDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-ell-starter.svg`

const STARTER_DIAGNOSTIC = 'Starter Diagnostic'
const INTERMEDIATE_DIAGNOSTIC = 'Intermediate Diagnostic'
const ADVANCED_DIAGNOSTIC = 'Advanced Diagnostic'
const ELL_DIAGNOSTIC = 'ELL Diagnostic'
const ELL_STARTER_DIAGNOSTIC = 'ELL Starter Diagnostic'

const selectCard = (history: any, unitTemplateName: string, activityIdsArray: string, unitTemplateId: number) => {
  const unitTemplateIdString = unitTemplateId.toString();
  window.localStorage.setItem(UNIT_TEMPLATE_NAME, unitTemplateName)
  window.localStorage.setItem(UNIT_NAME, unitTemplateName)
  window.localStorage.setItem(ACTIVITY_IDS_ARRAY, activityIdsArray)
  window.localStorage.setItem(UNIT_TEMPLATE_ID, unitTemplateIdString)
  history.push(`/assign/select-classes?diagnostic_unit_template_id=${unitTemplateIdString}`)
}

const minis = (props: any) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Plural and possessive nouns, pronouns, verbs, adjectives, adverbs of manners, commas, prepositions, and capitalization', },
      { key: 'When', text: 'Your students are working on basic grammar concepts.', }
    ]}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKX2sTTnPVhTOrWyUx9"
    buttonText="Preview"
    header={STARTER_DIAGNOSTIC}
    imgAlt="page with a little writing"
    imgSrc={starterDiagnosticSrc}
    selectCard={() => selectCard(props.history, STARTER_DIAGNOSTIC, encodeURIComponent([849].toString()), 99)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Compound sentences, complex sentences, conjunctive adverbs, pronouns, and commonly confused words', },
      { key: 'When', text: 'Your students have practiced the basics of grammar and are ready to develop their sentence construction skills.', }
    ]}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKbzH_Er916zGjgHk5U"
    buttonText="Preview"
    header={INTERMEDIATE_DIAGNOSTIC}
    imgAlt="page with a medium amount of writing"
    imgSrc={intermediateDiagnosticSrc}
    selectCard={() => selectCard(props.history, INTERMEDIATE_DIAGNOSTIC, encodeURIComponent([850].toString()), 100)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure', },
      { key: 'When', text: 'Your students are experienced with Quill, understand sentence combining, and are ready to develop multi-clause sentences.', }
    ]}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LVxlcVPdW5DvAh_xgnj"
    buttonText="Preview"
    header={ADVANCED_DIAGNOSTIC}
    imgAlt="page with a large amount of writing"
    imgSrc={advancedDiagnosticSrc}
    selectCard={() => selectCard(props.history, ADVANCED_DIAGNOSTIC, encodeURIComponent([888].toString()), 126)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Simple verb conjugation, articles, subject verb agreement, simple word order, singular vs plural nouns, and adjective placement', },
      { key: 'When', text: 'Built for beginning English Language Learners who are working on foundational grammar skills.', }
    ]}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LyFRZvbHAmooTTIIVE2"
    buttonText="Preview"
    header={ELL_STARTER_DIAGNOSTIC}
    imgAlt="page with less writing that says ELL in the corner"
    imgSrc={ellStarterDiagnosticSrc}
    selectCard={() => selectCard(props.history, ELL_STARTER_DIAGNOSTIC, encodeURIComponent([1161].toString()), 154)}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Subject-verb agreement, verb tense, adjectives, adverbs, articles, and prepositions', },
      { key: 'When', text: 'Built for English Language Learners at the developing, expanding or bridging stages of language proficiency (WIDA Levels 3-5).', }
    ]}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/ell"
    buttonText="Preview"
    header={ELL_DIAGNOSTIC}
    imgAlt="page with writing that says ELL in the corner"
    imgSrc={ellDiagnosticSrc}
    selectCard={() => selectCard(props.history, ELL_DIAGNOSTIC, encodeURIComponent([447].toString()), 34)}
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
