import * as React from 'react';
import AssignmentCard from './assignment_card';

const starterDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-starter.svg`
const intermediateDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-intermediate.svg`
const advancedDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-advanced.svg`
const ellDiagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostics-ell.svg`

const minis = [
  (<AssignmentCard
    link={`${process.env.DEFAULT_URL}/diagnostic/-LKX2sTTnPVhTOrWyUx9/stage/3`}
    buttonText="Preview"
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKX2sTTnPVhTOrWyUx9"
    header="Starter Diagnostic"
    imgSrc={starterDiagnosticSrc}
    imgAlt="page with a little writing"
    bodyArray={[
      { key: 'What', text: 'Plural and possessive nouns, pronouns, verbs, adjectives, adverbs of manners, commas, prepositions, and capitalization', },
      { key: 'When', text: 'Your students are working on basic grammar concepts.', }
    ]}
  />),
  (<AssignmentCard
    link={`${process.env.DEFAULT_URL}/diagnostic/-LKbzH_Er916zGjgHk5U/stage/3`}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LKbzH_Er916zGjgHk5U"
    buttonText="Preview"
    header="Intermediate Diagnostic"
    imgSrc={intermediateDiagnosticSrc}
    imgAlt="page with a medium amount of writing"
    bodyArray={[
      { key: 'What', text: 'Compound sentences, complex sentences, conjunctive adverbs, pronouns, and commonly confused words', },
      { key: 'When', text: 'Your students have practiced the basics of grammar and are ready to develop their sentence construction skills.', }
    ]}
  />),
  (<AssignmentCard
    link={`${process.env.DEFAULT_URL}/diagnostic/-LVxlcVPdW5DvAh_xgnj/stage/3`}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/-LVxlcVPdW5DvAh_xgnj"
    buttonText="Preview"
    header="Advanced Diagnostic"
    imgSrc={advancedDiagnosticSrc}
    imgAlt="page with a large amount of writing"
    bodyArray={[
      { key: 'What', text: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure', },
      { key: 'When', text: 'Your students are experienced with Quill, understand sentence combining, and are ready to develop multi-clause sentences.', }
    ]}
  />),
  (<AssignmentCard
    link={`${process.env.DEFAULT_URL}/diagnostic/ell/stage/3`}
    buttonLink="https://diagnostic.quill.org/#/play/diagnostic/ell"
    buttonText="Preview"
    header="ELL Diagnostic"
    imgSrc={ellDiagnosticSrc}
    imgAlt="page with writing that says ELL in the corner"
    bodyArray={[
      { key: 'What', text: 'Subject-verb agreement, verb tense, adjectives, adverbs, articles, and prepositions', },
      { key: 'When', text: 'Built for English Language Learners at the developing, expanding or bridging stages of language proficiency (WIDA Levels 3-5).', }
    ]}
  />)
];

const AssignADiagnostic = () => (
  <div id="assign-a-diagnostic-page" className="text-center">
    <h1>Which diagnostic covers the skills you want to assess?</h1>
    <div className="minis">{minis}</div>
  </div>
);

export default AssignADiagnostic
