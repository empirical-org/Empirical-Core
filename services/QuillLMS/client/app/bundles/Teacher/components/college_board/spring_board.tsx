import * as React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import { FEEDBACK_AND_REPORTS, MESSAGE_FROM_COLLEGE_BOARD, PASSAGE_ALIGNED_ACTIVITIES, QUESTIONS_AND_ANSWERS, TOP_SECTION, WRITING_SKILLS_SURVEYS } from './collegeBoardConstants';
import ScrollBox from './scrollBox';

import { PassageAlignedUnit } from '../../../../interfaces/collegeBoard';
import QuestionsAndAnswers from '../../containers/QuestionsAndAnswers';
import { generateLink, getActivityCount, getStartedButton } from '../../helpers/collegeBoard';
import { scrollToTop } from '../../hooks/scrollToTop';
import * as constants from '../assignment_flow/assignmentFlowConstants';
import { SPRING_BOARD_SLUG } from '../assignment_flow/assignmentFlowConstants';
import ExpandableUnitSection from '../shared/expandableUnit';

interface SpringBoardProps {
  isPartOfAssignmentFlow?: boolean;
  units?: PassageAlignedUnit[]
}

const SpringBoard = ({ isPartOfAssignmentFlow, units, }: SpringBoardProps) => {

  isPartOfAssignmentFlow && scrollToTop();

  const [activeSection, setActiveSection] = React.useState<string>('');
  const [showScrollBox, setShowScrollBox] = React.useState<string>('');
  const [isScrollingFromClick, setIsScrollingFromClick] = React.useState<boolean>(false);

  const writingSkillsRef = React.useRef(null);
  const feedbackReportsRef = React.useRef(null);
  const passageAlignedRef = React.useRef(null);
  const collegeBoardMessageRef = React.useRef(null);
  const questionAndAnswerRef = React.useRef(null);
  const scrollSections = [
    {
      ref: writingSkillsRef,
      title: WRITING_SKILLS_SURVEYS,
      count: 7
    },
    {
      ref: feedbackReportsRef,
      title: FEEDBACK_AND_REPORTS
    },
    {
      ref: passageAlignedRef,
      title: PASSAGE_ALIGNED_ACTIVITIES,
      count: units ? getActivityCount(units) : null
    },
    {
      ref: collegeBoardMessageRef,
      title: MESSAGE_FROM_COLLEGE_BOARD
    },
    {
      ref: questionAndAnswerRef,
      title: QUESTIONS_AND_ANSWERS
    }
  ];

  const expandableUnits = units.map((u, index) => {
    return (
      <ExpandableUnitSection
        isFirst={index === 0}
        isPartOfAssignmentFlow={isPartOfAssignmentFlow}
        key={u.id}
        learningCycles={u.learning_cycles}
        slug={SPRING_BOARD_SLUG}
        tag={<div className="college-board-activity-tag">For SpringBoard 9</div>}
        title={u.title}
      />
    )
  })

  function handleChange(isVisible: boolean, section: string) {
    if(isVisible && !isScrollingFromClick) {
      setActiveSection(section);
    }
    if(isVisible && section === WRITING_SKILLS_SURVEYS) {
      setShowScrollBox('show');
    } else if(isVisible && section === TOP_SECTION && showScrollBox === 'show') {
      setShowScrollBox('obscure');
    }
  }

  function handleSetIsScrollingFromClick(value: boolean) {
    setIsScrollingFromClick(value);
  }

  function handleScroll() {
    if(showScrollBox !== 'show')  {
      setShowScrollBox('show');
    }
  }

  {/* eslint-disable-next-line react/jsx-no-bind */}
  return (
    <div className="college-board-container" onScroll={() => handleScroll()}>
      <div className="section-wrapper">
        <div className="container college-board-header-container">
          <div className="header-left">
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, TOP_SECTION)}>
              <div className="logo-container">
                <img alt="College Board logo" src="https://assets.quill.org/images/college_board/college-board-logo.svg" />
                <div className="divider" />
                <img alt="Quill logo" src="https://assets.quill.org/images/logos/quill-logo-green.svg" />
              </div>
            </VisibilitySensor>
            <div className="header-text-container">
              <h1>Official SpringBoard Writing Practice</h1>
              <p>Free SpringBoard® English writing practice aligned to a variety of skills addressed through SpringBoard Grades 6-8, with immediate feedback for students and progress reports for you. Additional tools for SpringBoard Grades 9-10 and Grades 11-12 as well! Find out more below.</p>
              {getStartedButton(isPartOfAssignmentFlow)}
            </div>
          </div>
          <img alt="Photograph of a student standing next to some lockers" src="https://assets.quill.org/images/college_board/student-writing-by-laptop.webp" />
        </div>
      </div>
      <ScrollBox activeSection={activeSection} sections={scrollSections} setActiveSection={setActiveSection} setIsScrollingFromClick={handleSetIsScrollingFromClick} showScrollBox={showScrollBox} />
      <div className="white-section-wrapper">
        <div className="container college-board-activities-section">
          <div className="header">
            <img alt="Illustration of a pencil drawing a line" src="https://assets.quill.org/images/college_board/sentence-writing-pencil.svg" />
            <div className="text-container">
              <h2>Sentence-Level Writing Practice</h2>
              <p>Identify which sentence-level skills your students need to practice with a skills survey. Then, assign activities recommended for each student based on their responses so they can practice and improve their proficiency with those skills.</p>
            </div>
          </div>
          <div className="activities-subheader" ref={writingSkillsRef}>
            <h2>Springboard Writing Skills Surveys</h2>
          </div>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, WRITING_SKILLS_SURVEYS)}>
            <div className="activity-container">
              <div className="activity-header-container">
                <div className="activity-header-left-container">
                  <p className="activity-header springboard-sub-header" id="writing-skills-survey-1">SpringBoard Writing Skills Survey</p>
                  <div className="college-board-activity-tag">For SpringBoard 6-8</div>
                </div>
                <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({isPartOfAssignmentFlow, unitTemplateId: constants.SPRING_BOARD_SKILLS_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
              </div>
              <div className="activity-text-container">
                <p className="activity-sub-text">Students complete a 25 item survey to gauge their understanding of key writing skills, fundamental grammatical elements, common editing mistakes, and compound/complex sentence constructions. The skills addressed in this survey are aligned to the grammar instruction featured in the SpringBoard Language and Writer’s Craft and Language Checkpoint lesson components. </p>
                <p className="activity-sub-header">Skills</p>
                <p className="activity-sub-text">Subject-verb agreement; pronoun-antecedent agreement; compound subjects, objects and predicates; coordinating conjunctions in compound sentences; subordinating conjunctions; prepositional phrases; verb tense; subject and object pronouns; commonly confused words</p>
              </div>
            </div>
          </VisibilitySensor>
          <div className="activities-subheader">
            <h2>Pre-AP and AP Writing Skills Surveys</h2>
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
              <p className="activity-sub-text">Students complete a 12 item survey their understanding of key writing skills, fundamental grammatical elements, and compound/complex sentence constructions. The skills addressed in this survey are aligned to the Pre-AP English High School Course Framework for English 1 and English 2. </p>
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
              <p className="activity-sub-text">Students complete a 12 item survey their understanding of key writing skills, focusing on constructions for expanding sentences with description and detail. The skills addressed in this survey are aligned to the Pre-AP English High School Course Framework for English 1 and English 2.</p>
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
              <p className="activity-sub-text">Students complete a 17 item survey to gauge their understanding of key writing skills that are essential to successful AP- and SAT-level writing.</p>
              <p className="activity-sub-header">Skills</p>
              <p className="activity-sub-text">Complex Sentences; relative clauses; appositive phrases; participial phrases; parallel structure; compound-complex sentences; advanced combining</p>
            </div>
          </div>
          <div className="activities-subheader" id="ell-subheader">
            <h2>ELL Writing Skills Surveys</h2>
            <p>If you have ELLs in your courses, you may want to consider assigning them an ELL Skills Surveys before assigning them a writing skills survey.</p>
          </div>
          <div className="activity-container">
            <div className="activity-header-container">
              <p className="activity-header" id="writing-skills-survey">ELL Starter Skills Survey</p>
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: constants.ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
            </div>
            <div className="activity-text-container">
              <p className="activity-sub-text">ELL students complete a 22 item survey to gauge their mastery of foundational English grammar. This survey is most appropriate for students who are in the Entering or Emerging <a className="underlined_link" href="https://wida.wisc.edu/sites/default/files/resource/CanDo-KeyUses-Gr-9-12.pdf" rel="noopener noreferrer" target="_blank">WIDA levels</a>. After students complete the survey, Quill will automatically recommend up to five activity packs for each student based on their needs. Each pack contains a series of activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice with one of the skills covered by the survey.</p>
              <p className="activity-sub-header">Skills</p>
              <p className="activity-sub-text">Simple verb conjugation; articles; simple subject-verb agreement; simple word order; singular and plural nouns; adjective placement</p>
            </div>
          </div>
          <div className="activity-container">
            <div className="activity-header-container">
              <p className="activity-header" id="writing-skills-survey">ELL Intermediate Skills Survey</p>
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: constants.ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
            </div>
            <div className="activity-text-container">
              <p className="activity-sub-text">ELL students complete a 23 item survey to gauge their mastery of English grammar. This survey is most appropriate for students who are in the Emerging or Developing <a className="underlined_link" href="https://wida.wisc.edu/sites/default/files/resource/CanDo-KeyUses-Gr-9-12.pdf" rel="noopener noreferrer" target="_blank">WIDA levels</a>. After students complete the survey, Quill will automatically recommend up to six activity packs for each student based on their needs. Each pack contains a series of activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice with one of the skills covered by the survey.</p>
              <p className="activity-sub-header">Skills</p>
              <p className="activity-sub-text">Subject-verb agreement; singular possessive nouns; possessive pronouns; prepositions; future tense; articles; intermediate questions</p>
            </div>
          </div>
          <div className="activity-container">
            <div className="activity-header-container">
              <p className="activity-header" id="writing-skills-survey">ELL Advanced Skills Survey</p>
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: constants.ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: constants.SPRING_BOARD_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
            </div>
            <div className="activity-text-container">
              <p className="activity-sub-text">ELL students complete a 23 item survey to gauge their mastery of English grammar, specifically in areas that are challenging for non-native English speakers. This survey is most appropriate for students who are in the Developing or Expanding <a className="underlined_link" href="https://wida.wisc.edu/sites/default/files/resource/CanDo-KeyUses-Gr-9-12.pdf" rel="noopener noreferrer" target="_blank">WIDA levels</a>. After students complete the survey, Quill will automatically recommend up to five activity packs for each student based on their needs. Each pack contains a series of activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice with one of the skills covered by the survey.</p>
              <p className="activity-sub-header">Skills</p>
              <p className="activity-sub-text">Regular and irregular past tense; progressive tenses; phrasal verbs; choosing between prepositions; responding to questions; commonly confused words</p>
            </div>
          </div>
        </div>
      </div>
      <div className="white-section-wrapper" id="info-blurbs-1-wrapper" ref={feedbackReportsRef}>
        <div className="container info-blurbs-section">
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, FEEDBACK_AND_REPORTS)}>
            <div className="info-blurb-container">
              <img alt="A list of writing concepts: Subject-Verb Agreement, Pronoun-Antecedent Agreement, Compound Subjects, Objects, Predicates, and more." src="https://assets.quill.org/images/college_board/pre-ap-recommendations.svg" />
              <div className="text-container">
                <p className="info-blurb-header">Personalized Recommendations</p>
                <p className="info-blurb-text">After your students complete a SpringBoard 6-8, Pre-AP, AP, or ELL writing skills survey, Quill will use the results to recommend a set of independent practice activities. You can choose to assign all the practice at once, or you can pick and choose the activities that best fit your instructional and students’ needs. As students complete the practice, they’ll receive instant feedback on their writing that guides them through the revising and editing process.</p>
              </div>
            </div>
          </VisibilitySensor>
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
      <div className="white-section-wrapper" ref={passageAlignedRef}>
        <div className="container college-board-activities-section">
          <div className="header">
            <img alt="Illustration of a book opened" src="https://assets.quill.org/images/college_board/passage-book.svg" />
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, PASSAGE_ALIGNED_ACTIVITIES)}>
              <div className="text-container">
                <h2>Passage-Aligned Activities</h2>
                <p>Twenty custom sentence-combining activities, each one aligned to a unique 9th grade SpringBoard ELA text to give your students the opportunity to practice their sentence construction skills in context.</p>
              </div>
            </VisibilitySensor>
          </div>
          <div className="activities-subheader">
            <h2>Passage-Aligned Activities</h2>
          </div>
          <div className="white-section-wrapper">
            <div className="units-container">
              {expandableUnits}
            </div>
          </div>
        </div>
      </div>
      <div className="section-wrapper">
        <div className="container cb-message-container" ref={collegeBoardMessageRef}>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, MESSAGE_FROM_COLLEGE_BOARD)}>
            <p className="cb-message-header">Quill and College Board have partnered to provide students with meaningful practice of their sentence-level writing skills.</p>
          </VisibilitySensor>
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
      <div ref={questionAndAnswerRef}>
        <QuestionsAndAnswers handleChange={handleChange} questionsAndAnswersFile="springboard" supportLink="" />
      </div>
    </div>
  )
}

export default SpringBoard
