import * as React from 'react';
import AssignmentCard from './assignment_card';
import AssignmentFlowNavigation from '../assignment_flow_navigation'

const starterDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-starter.svg`
const intermediateDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-intermediate.svg`
const advancedDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-advanced.svg`
const ellDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-ell.svg`

const STARTER_DIAGNOSTIC = 'Starter Diagnostic'
const INTERMEDIATE_DIAGNOSTIC = 'Intermediate Diagnostic'
const ADVANCED_DIAGNOSTIC = 'Advanced Diagnostic'
const ELL_DIAGNOSTIC = 'ELL Diagnostic'

const minis = [
  (<AssignmentCard
    link={`${process.env.DEFAULT_URL}/assign/new_unit/students/edit/name/${encodeURIComponent(STARTER_DIAGNOSTIC)}/activity_ids/${encodeURIComponent([849].toString())}?unit_template_id=${99}`}
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
    link={`${process.env.DEFAULT_URL}/assign/new_unit/students/edit/name/${encodeURIComponent(INTERMEDIATE_DIAGNOSTIC)}/activity_ids/${encodeURIComponent([850].toString())}?unit_template_id=${100}`}
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
    link={`${process.env.DEFAULT_URL}/assign/new_unit/students/edit/name/${encodeURIComponent(ADVANCED_DIAGNOSTIC)}/activity_ids/${encodeURIComponent([888].toString())}?unit_template_id=${126}`}
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
    link={`${process.env.DEFAULT_URL}/assign/new_unit/students/edit/name/${encodeURIComponent(ELL_DIAGNOSTIC)}/activity_ids/${encodeURIComponent([447].toString())}?unit_template_id=${34}`}
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

const AssignADiagnostic = () => (
  <div className="assignment-flow-container">
    <AssignmentFlowNavigation url={window.location.href} />
    <div className="diagnostic-page container">
      <h1>Which diagnostic covers the skills you want to assess?</h1>
      <div className="minis">{minis}</div>
    </div>
  </div>
);

export default AssignADiagnostic
