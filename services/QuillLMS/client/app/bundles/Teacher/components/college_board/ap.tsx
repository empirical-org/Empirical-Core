import * as React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import { FEEDBACK_AND_REPORTS, MESSAGE_FROM_COLLEGE_BOARD, QUESTIONS_AND_ANSWERS, TOP_SECTION, WRITING_SKILLS_SURVEYS } from './collegeBoardConstants';
import ScrollBox from './scrollBox';

import QuestionsAndAnswers from '../../containers/QuestionsAndAnswers';
import { generateLink, getStartedButton } from '../../helpers/collegeBoard';
import { scrollToTop } from '../../hooks/scrollToTop';
import {
  AP_SLUG,
  AP_WRITINGS_SKILLS_UNIT_TEMPLATE_ID, ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID, ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID, ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID
} from '../assignment_flow/assignmentFlowConstants';

interface ApContainerProps {
  isPartOfAssignmentFlow?: boolean;
}

const Ap = ({ isPartOfAssignmentFlow, }: ApContainerProps) => {

  isPartOfAssignmentFlow && scrollToTop();

  const [activeSection, setActiveSection] = React.useState<string>('');
  const [showScrollBox, setShowScrollBox] = React.useState<string>('');
  const [isScrollingFromClick, setIsScrollingFromClick] = React.useState<boolean>(false);

  const writingSkillsRef = React.useRef(null);
  const feedbackReportsRef = React.useRef(null);
  const collegeBoardMessageRef = React.useRef(null);
  const questionAndAnswerRef = React.useRef(null);
  const scrollSections = [
    {
      ref: writingSkillsRef,
      title: WRITING_SKILLS_SURVEYS,
      count: 4
    },
    {
      ref: feedbackReportsRef,
      title: FEEDBACK_AND_REPORTS
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
              <h1>Official AP Writing Practice</h1>
              <p>Free AP® writing practice with comprehensive progress reports for you and immediate feedback for students that guides them towards mastery of sentence-level skills.</p>
              {getStartedButton(isPartOfAssignmentFlow)}
            </div>
          </div>
          <img alt="Photograph of a teacher talking to a classroom of high school students" src="https://assets.quill.org/images/college_board/teaching-english-practice.webp" />
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
            <h2>AP Writing Skills Survey</h2>
          </div>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, WRITING_SKILLS_SURVEYS)}>
            <div className="activity-container">
              <div className="activity-header-container">
                <p className="activity-header" id="writing-skills-survey">AP Writing Skills Survey</p>
                <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: AP_WRITINGS_SKILLS_UNIT_TEMPLATE_ID, slug: AP_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
              </div>
              <div className="activity-text-container">
                <p className="activity-sub-text">Students complete a 17 item survey to gauge their understanding of key writing skills that are essential to successful AP- and SAT-level writing. After students complete the survey, Quill will automatically recommend up to seven activity packs for each student based on their needs. Each pack contains a series of activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice with one of the skills covered by the survey.</p>
                <p className="activity-sub-header">Skills</p>
                <p className="activity-sub-text">Complex Sentences; relative clauses; appositive phrases; participial phrases; parallel structure; compound-complex sentences; advanced combining</p>
              </div>
            </div>
          </VisibilitySensor>
          <div className="activities-subheader" id="ell-subheader">
            <h2>ELL Writing Skills Surveys</h2>
            <p>If you have ELLs in your courses, you may want to consider assigning them an ELL Skills Surveys before assigning them a writing skills survey.</p>
          </div>
          <div className="activity-container">
            <div className="activity-header-container">
              <p className="activity-header" id="writing-skills-survey">ELL Starter Skills Survey</p>
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: AP_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
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
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: AP_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
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
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: AP_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
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
              <img alt="A recommended activity pack report showing four students being recommended a mixture of activities for relative clauses and participial phrases." src="https://assets.quill.org/images/college_board/ap-recommendations.svg" />
              <div className="text-container">
                <p className="info-blurb-header">Personalized Recommendations</p>
                <p className="info-blurb-text">After students complete the AP Writing Skills Survey, you&apos;ll receive recommendations for each student based on their responses and tailored to their individual needs. Each student will be recommended up to 45 sentence combining activities, grouped by concept into seven packs, that provide meaningful, targeted practice. You can assign all the activities with one click, or you can pick and choose.</p>
              </div>
            </div>
          </VisibilitySensor>
          <div className="info-blurb-container">
            <div className="text-container">
              <p className="info-blurb-header">Writing with Targeted Feedback</p>
              <p className="info-blurb-text">Students receive immediate feedback that guides them through the revision process, pushing them to think critically about their writing and make revisions that ultimately lead to strong, sophisticated, and grammatically accurate sentences. The feedback inspires students to strengthen their sentence structure, but also supports them in editing for mechanics such as punctuation and spelling.</p>
            </div>
            <img alt="An illustration showing a student combining two sentences, getting feedback from Quill, and then getting a correct response." src="https://assets.quill.org/images/college_board/ap-additional-practice.svg" />
          </div>
          <div className="info-blurb-container">
            <img alt="A report showing that a student scored 79% on parallel structure, 98% on parallel structure with joining words, and 58% on advanced parallel structure." src="https://assets.quill.org/images/college_board/ap-reports.svg" />
            <div className="text-container">
              <p className="info-blurb-header">Data Reports</p>
              <p className="info-blurb-text" ref={collegeBoardMessageRef}>You can monitor the progress of your students and continue to identify areas of need and areas of strength through multiple data reports. Use the analysis report to review your students&apos; work sentence-by-sentence, or use the summary report to get a high-level sense of where your students could use some extra support.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="section-wrapper">
        <div className="container cb-message-container">
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, MESSAGE_FROM_COLLEGE_BOARD)}>
            <p className="cb-message-header">Quill and College Board have partnered to provide students with meaningful practice of their sentence-level writing skills.</p>
          </VisibilitySensor>
          <div className="sub-header-container">
            <p className="cb-message-sub-header">Message from College Board</p>
          </div>
          <div className="quote-container">
            <img alt="Large left quote" id="first-quote" src="https://assets.quill.org/images/college_board/exaggerated-quote-left.svg" />
            <div className="inner-text-container">
              <p>Teaching writing is hard. Even harder can be attempting to pinpoint exactly when we learned how and why to write clearly. That’s why the College Board has worked with Quill.org to ensure that this new, free, comprehensive offering helps students practice targeted sentence construction skills in their writing. Sustained practice and exposure to targeted skills is important to improvement and comfort.</p>
              <p>Teaching writing may always be hard, but student practice in meaningful skills can make the learning that much clearer. Through this practice, students can begin to own the how and why of their writing.</p>
            </div>
            <img alt="Large right quote" id="second-quote" src="https://assets.quill.org/images/college_board/exaggerated-quote-right.svg" />
          </div>
        </div>
      </div>
      <div ref={questionAndAnswerRef}>
        <QuestionsAndAnswers handleChange={handleChange} questionsAndAnswersFile="ap" supportLink="" />
      </div>
    </div>
  )
}

export default Ap
