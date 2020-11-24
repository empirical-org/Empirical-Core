import * as React from 'react';

import QuestionsAndAnswers from '../../containers/QuestionsAndAnswers';
import * as constants from '../assignment_flow/assignmentFlowConstants';
import { generateLink, getStartedButton } from '../../helpers/collegeBoard';
import { scrollToTop } from '../../hooks/scrollToTop';

interface SpringBoardProps {
  isPartOfAssignmentFlow?: boolean;
}

const SpringBoard = ({ isPartOfAssignmentFlow }: SpringBoardProps) => {

  isPartOfAssignmentFlow && scrollToTop();

  return (<div className="college-board-container">
    <div className="section-wrapper">
      <div className="container college-board-header-container">
        <div className="header-left">
          <div className="logo-container">
            <img alt="College Board logo" src="https://assets.quill.org/images/college_board/college-board-logo.svg" />
            <div className="divider" />
            <img alt="Quill logo" src="https://assets.quill.org/images/logos/quill-logo-green.svg" />
          </div>
          <div className="header-text-container">
            <h1>Official SpringBoard® Writing Practice</h1>
            <p>Free SpringBoard English writing practice aligned to a variety of skills addressed through SpringBoard Grades 6-8, with immediate feedback for students and progress reports for you. Additional tools for SpringBoard Grades 9-10 and Grades 11-12 as well! Find out more below.</p>
            {getStartedButton(isPartOfAssignmentFlow)}
          </div>
        </div>
        <img alt="Photograph of a student standing next to some lockers" src="https://assets.quill.org/images/college_board/student-near-lockers.png" />
      </div>
    </div>
    <div className="white-section-wrapper">
      <div className="container college-board-activities-section">
        <div className="header">
          <img alt="Illustration of a pencil drawing a line" src="https://assets.quill.org/images/college_board/sentence-writing-pencil.svg" />
          <div className="text-container">
            <h2>Sentence-Level Writing Practice</h2>
            <p>Identify which sentence-level skills from your students&apos; SpringBoard course need to be practiced with a custom-designed writing skills survey aligned to skills covered in their texts. After students complete a survey, Quill will automatically recommend a series of activity packs for each student based on their needs. Each pack contains four to six activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice on one of the skills addressed in the survey.</p>
          </div>
        </div>
        <div className="activities-subheader">
          <h2>Writing Skills Surveys</h2>
        </div>
        <div className="activity-container">
          <div className="activity-header-container">
            <div className="activity-header-left-container">
              <p className="activity-header springboard-sub-header" id="writing-skills-survey-1">SpringBoard Writing Skills Survey</p>
              <div className="college-board-activity-tag">For SpringBoard 6-8</div>
            </div>
            <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({isPartOfAssignmentFlow, unitTemplateId: constants.SPRING_BOARD_SKILLS_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
          </div>
          <div className="activity-text-container">
            <p className="activity-sub-text">Students complete a twenty-five-item survey to gauge their understanding of key writing skills, fundamental grammatical elements, common editing mistakes, and compound/complex sentence constructions. The skills addressed in this survey are aligned to the grammar instruction featured in the SpringBoard Language and Writer’s Craft and Language Checkpoint lesson components. </p>
            <p className="activity-sub-header">Skills</p>
            <p className="activity-sub-text">Subject-verb agreement; pronoun-antecedent agreement; compound subjects, objects and predicates; coordinating conjunctions in compound sentences; subordinating conjunctions; prepositional phrases; verb tense; subject and object pronouns; commonly confused words</p>
          </div>
        </div>
        <div className="activity-container">
          <div className="activity-header-container">
            <div className="activity-header-left-container">
              <p className="activity-header springboard-sub-header" id="writing-skills-survey-1">Pre-AP Writing Skills Survey 1: Basic of Sentence Patterns</p>
              <div className="college-board-activity-tag">For SpringBoard 9-10</div>
            </div>
            <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({isPartOfAssignmentFlow, unitTemplateId: constants.PRE_AP_WRITINGS_SKILLS_1_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
          </div>
          <div className="activity-text-container">
            <p className="activity-sub-text">Students complete a twelve-item survey to gauge their understanding of key writing skills, fundamental grammatical elements, and compound/complex sentence constructions. The skills addressed in this survey are aligned to the Pre-AP English High School Course Framework for English 1 and English 2. </p>
            <p className="activity-sub-header">Skills</p>
            <p className="activity-sub-text">Subject-verb agreement; pronoun-antecedent agreement; compound subjects, objects and predicates; coordinating conjunctions in compound sentences; subordinating conjunctions</p>
          </div>
        </div>
        <div className="activity-container">
          <div className="activity-header-container">
            <div className="activity-header-left-container">
              <p className="activity-header springboard-sub-header" id="writing-skills-survey-2">Pre-AP Writing Skills Survey 2: Tools for Sentence Expansion</p>
              <div className="college-board-activity-tag">For SpringBoard 9-10</div>
            </div>
            <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({isPartOfAssignmentFlow, unitTemplateId: constants.PRE_AP_WRITINGS_SKILLS_2_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
          </div>
          <div className="activity-text-container">
            <p className="activity-sub-text">Students complete a twelve-item survey to gauge their understanding of key writing skills, focusing on constructions for expanding sentences with description and detail. The skills addressed in this survey are aligned to the Pre-AP English High School Course Framework for English 1 and English 2.</p>
            <p className="activity-sub-header">Skills</p>
            <p className="activity-sub-text">Conjunctive adverbs; appositive phrases; relative clauses; participial phrases; parallel structure</p>
          </div>
        </div>
        <div className="activity-container">
          <div className="activity-header-container">
            <div className="activity-header-left-container">
              <p className="activity-header springboard-sub-header" id="writing-skills-survey">AP Writing Skills Survey</p>
              <div className="college-board-activity-tag">For SpringBoard 11-12</div>
            </div>
            <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({isPartOfAssignmentFlow, unitTemplateId: constants.AP_WRITINGS_SKILLS_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
          </div>
          <div className="activity-text-container">
            <p className="activity-sub-text">Students complete a seventeen-item survey to gauge their understanding of key writing skills that are essential to successful AP- and SAT-level writing.</p>
            <p className="activity-sub-header">Skills</p>
            <p className="activity-sub-text">Complex Sentences; relative clauses; appositive phrases; participial phrases; parallel structure; compound-complex sentences; advanced combining</p>
          </div>
        </div>
      </div>
    </div>
    <div className="white-section-wrapper" id="info-blurbs-1-wrapper">
      <div className="container info-blurbs-section">
        <div className="info-blurb-container">
          <img alt="A list of writing concepts: Subject-Verb Agreement, Pronoun-Antecedent Agreement, Compound Subjects, Objects, Predicates, and more." src="https://assets.quill.org/images/college_board/pre-ap-recommendations.svg" />
          <div className="text-container">
            <p className="info-blurb-header">Personalized Recommendations</p>
            <p className="info-blurb-text">After your students complete a SpringBoard 6-8, Pre-AP, AP, or ELL writing skills survey, Quill will use the results to recommend a set of independent practice activities. You can choose to assign all the practice at once, or you can pick and choose the activities that best fit your instructional and students’ needs. As students complete the practice, they’ll receive instant feedback on their writing that guides them through the revising and editing process.</p>
          </div>
        </div>
        <div className="info-blurb-container">
          <div className="text-container">
            <p className="info-blurb-header">Writing with Targeted Feedback</p>
            <p className="info-blurb-text">Students receive immediate feedback that guides them through the revision process, pushing them to think critically about their writing and make revisions that ultimately lead to strong, sophisticated, and grammatically accurate sentences. The feedback inspires students to strengthen their sentence structure, but also supports them in editing for mechanics such as punctuation and spelling.</p>
          </div>
          <img alt="A recommended activity pack report showing four students being recommended a mixture of activities for relative clauses and parallel structure." src="https://assets.quill.org/images/college_board/pre-ap-additional-practice.svg" />
        </div>
        <div className="info-blurb-container">
          <img alt="An illustration showing a student combining two sentences, getting feedback from Quill, and then getting a correct response." src="https://assets.quill.org/images/college_board/springboard-reports.svg" />
          <div className="text-container">
            <p className="info-blurb-header">Data Reports</p>
            <p className="info-blurb-text">You can monitor the progress of your students and continue to identify areas of need and areas of strength through multiple data reports. Use the analysis report to review your students&apos; work sentence-by-sentence, or use the summary report to get a high-level sense of where your students could use some extra support.</p>
          </div>
        </div>
      </div>
    </div>
    <div className="white-section-wrapper">
      <div className="container college-board-activities-section">
        <div className="header">
          <img alt="Illustration of a pencil drawing a line" src="https://assets.quill.org/images/college_board/english-language-learners-globe.svg" />
          <div className="text-container">
            <h2>Additional Support for ELL Students</h2>
            <p>In addition to the above writing skills surveys, Quill.org also offers dedicated skills surveys for English Language Learners (ELLs). There are two separate skills surveys: one for students in WIDA&apos;s Entering and Emerging stages of language proficiency, and one for students in WIDA&apos;s Developing and Expanding stages.</p>
          </div>
        </div>
        <div className="activities-subheader">
          <h2 id="ell-header">ELL Skills Surveys</h2>
        </div>
        <div className="activity-container">
          <div className="activity-header-container">
            <div className="activity-header-left-container">
              <p className="activity-header springboard-sub-header" id="writing-skills-survey-1">ELL Skills Survey 1: Entering and Emerging</p>
              <div className="college-board-activity-tag">For SpringBoard 6-12</div>
            </div>
            <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({isPartOfAssignmentFlow, unitTemplateId: constants.ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
          </div>
          <div className="activity-text-container">
            <p className="activity-sub-text">Students complete a twenty-two-item placement activity. Directions can be shown in English only, or shown in both English and another selected language.</p>
            <p className="activity-sub-header">Skills</p>
            <p className="activity-sub-text">Simple verb conjugation; articles; subject-verb agreement; simple word order; singular and plural nouns; adjective placement</p>
          </div>
        </div>
        <div className="activity-container">
          <div className="activity-header-container">
            <div className="activity-header-left-container">
              <p className="activity-header springboard-sub-header" id="writing-skills-survey-1">ELL Skills Survey 2: Developing and Expanding</p>
              <div className="college-board-activity-tag">For SpringBoard 6-12</div>
            </div>
            <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({isPartOfAssignmentFlow, unitTemplateId: constants.ELL_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
          </div>
          <div className="activity-text-container">
            <p className="activity-sub-text">Students complete a twenty-two-item placement activity. Directions can be shown in English only, or shown in both English and another selected language.</p>
            <p className="activity-sub-header">Skills</p>
            <p className="activity-sub-text">Fragments; articles; verb tense; adjectives; adverbs; prepositions; compound subjects, objects, and predicates; compound sentences; complex sentences</p>
          </div>
        </div>
      </div>
    </div>
    <div className="section-wrapper">
      <div className="container cb-message-container">
        <p className="cb-message-header">Quill and College Board have partnered to provide students with meaningful practice of their sentence-level writing skills.</p>
        <div className="sub-header-container">
          <p className="cb-message-sub-header">Message from College Board</p>
        </div>
        <div className="quote-container">
          <img alt="Large right quote" id="first-quote" src="https://assets.quill.org/images/college_board/exaggerated-quote-left.svg" />
          <div className="inner-text-container">
            <p>Teaching writing is hard. Even harder can be attempting to pinpoint exactly when we learned how and why to write clearly. That’s why the College Board has worked with Quill.org to ensure that this new, free, comprehensive offering helps students practice targeted sentence construction skills in their writing. Sustained practice and exposure to targeted skills is important to improvement and comfort.</p>
            <p>Teaching writing may always be hard, but student practice in meaningful skills can make the learning that much clearer. Through this practice, students can begin to own the how and why of their writing.</p>
          </div>
          <img alt="Large left quote" id="second-quote" src="https://assets.quill.org/images/college_board/exaggerated-quote-right.svg" />
        </div>
      </div>
    </div>
    <QuestionsAndAnswers questionsAndAnswersFile="springboard" supportLink="" />
  </div>
  )
}

export default SpringBoard
