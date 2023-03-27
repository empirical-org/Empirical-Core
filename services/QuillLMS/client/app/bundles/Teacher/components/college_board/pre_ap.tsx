import * as React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import { ALIGNED_TO_PREAP, FEEDBACK_AND_REPORTS, MESSAGE_FROM_COLLEGE_BOARD, PASSAGE_ALIGNED_ACTIVITIES, QUESTIONS_AND_ANSWERS, TOP_SECTION, WRITING_SKILLS_SURVEYS } from './collegeBoardConstants';
import ScrollBox from './scrollBox';

import { PassageAlignedUnit } from '../../../../interfaces/collegeBoard';
import QuestionsAndAnswers from '../../containers/QuestionsAndAnswers';
import { generateLink, getActivityCount, getStartedButton } from '../../helpers/collegeBoard';
import { scrollToTop } from '../../hooks/scrollToTop';
import { ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID, ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID, ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID, PRE_AP_SLUG, PRE_AP_WRITINGS_SKILLS_1_UNIT_TEMPLATE_ID, PRE_AP_WRITINGS_SKILLS_2_UNIT_TEMPLATE_ID } from '../assignment_flow/assignmentFlowConstants';
import ExpandableUnitSection from '../shared/expandableUnit';

interface PreApContainerProps {
  isPartOfAssignmentFlow?: boolean;
  units?: PassageAlignedUnit[]
}

const PreAp = ({ units, isPartOfAssignmentFlow, }: PreApContainerProps) => {

  // we need this otherwise the pages will be rendered partially scrolled from preview assignment flow step
  isPartOfAssignmentFlow && scrollToTop();

  const [activeSection, setActiveSection] = React.useState<string>('');
  const [showScrollBox, setShowScrollBox] = React.useState<string>('');
  const [isScrollingFromClick, setIsScrollingFromClick] = React.useState<boolean>(false);

  const writingSkillsRef = React.useRef(null);
  const feedbackReportsRef = React.useRef(null);
  const passageAlignedRef = React.useRef(null);
  const alignedToPreApRef = React.useRef(null);
  const collegeBoardMessageRef = React.useRef(null);
  const questionAndAnswerRef = React.useRef(null);
  const scrollSections = [
    {
      ref: writingSkillsRef,
      title: WRITING_SKILLS_SURVEYS,
      count: 5
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
      ref: alignedToPreApRef,
      title: ALIGNED_TO_PREAP
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
        slug={PRE_AP_SLUG}
        title={u.title}
      />
    )
  });

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
              <h1>Official Pre-AP English Practice</h1>
              <p>Free Pre-AP® English writing practice aligned to the Pre-AP English High School Course Framework for the English 1 and English 2 courses with immediate feedback for students and progress reports for you.</p>
              {getStartedButton(isPartOfAssignmentFlow)}
            </div>
          </div>
          <img alt="Photograph of a teacher talking to a classroom of high school students" src="https://assets.quill.org/images/college_board/teaching-english-practice-2.webp" />
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
            <h2>Pre-AP Writing Skills Surveys</h2>
          </div>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, WRITING_SKILLS_SURVEYS)}>
            <div className="activity-container">
              <div className="activity-header-container">
                <div className="tags-container">
                  <p className="activity-header" id="writing-skills-survey-1">Pre-AP Writing Skills Survey 1: Basic of Sentence Patterns</p>
                  <div className="college-board-activity-tag">For Pre-AP English 1</div>
                  <div className="college-board-activity-tag">For Pre-AP English 2</div>
                </div>
                <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: PRE_AP_WRITINGS_SKILLS_1_UNIT_TEMPLATE_ID, slug: PRE_AP_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
              </div>
              <div className="activity-text-container">
                <p className="activity-sub-text">Students complete a 12 item survey their understanding of key writing skills, fundamental grammatical elements, and compound/complex sentence constructions. After students complete the survey, Quill will automatically recommend up to five activity packs for each student based on their needs. Each pack contains four to six activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice on one of the five skills addressed in the survey.</p>
                <p className="activity-sub-header">Skills</p>
                <p className="activity-sub-text">Subject-verb agreement; pronoun-antecedent agreement; compound subjects, objects and predicates; coordinating conjunctions in compound sentences; subordinating conjunctions</p>
              </div>
            </div>
          </VisibilitySensor>
          <div className="activity-container">
            <div className="activity-header-container">
              <div className="tags-container">
                <p className="activity-header" id="writing-skills-survey-2">Pre-AP Writing Skills Survey 2: Tools for Sentence Expansion</p>
                <div className="college-board-activity-tag">For Pre-AP English 1</div>
                <div className="college-board-activity-tag">For Pre-AP English 2</div>
              </div>
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: PRE_AP_WRITINGS_SKILLS_2_UNIT_TEMPLATE_ID, slug: PRE_AP_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
            </div>
            <div className="activity-text-container">
              <p className="activity-sub-text">Students complete a 12 item survey their understanding of key writing skills, focusing on constructions for expanding sentences with description and detail. After students complete the survey, Quill will automatically recommend up to five activity packs for each student based on their needs. Each pack contains four to six activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice on one of the five skills addressed in the survey.</p>
              <p className="activity-sub-header">Skills</p>
              <p className="activity-sub-text">Conjunctive adverbs; appositive phrases; relative clauses; participial phrases; parallel structure</p>
            </div>
          </div>
          <div className="activities-subheader" id="ell-subheader">
            <h2>ELL Writing Skills Surveys</h2>
            <p>If you have ELLs in your courses, you may want to consider assigning them an ELL Skills Surveys before assigning them a writing skills survey.</p>
          </div>
          <div className="activity-container">
            <div className="activity-header-container">
              <p className="activity-header" id="writing-skills-survey">ELL Starter Skills Survey</p>
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: PRE_AP_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
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
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: PRE_AP_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
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
              <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink({ isPartOfAssignmentFlow, unitTemplateId: ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID, slug: PRE_AP_SLUG })} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
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
              <img alt="A list of writing concepts: Subject-Verb Agreement, Pronoun-Antecedent Agreement, Compound Subjects, Objects, Predicates, and more." src="https://assets.quill.org/images/college_board/pre-ap-concepts.svg" />
              <div className="text-container">
                <p className="info-blurb-header">Writing Practice Aligned to Course Frameworks</p>
                <p className="info-blurb-text">Each 12 item Pre-AP Writing Skills Survey covers five of the ten key grammar skills from the English 1 and English 2 course frameworks. Each survey helps identify which of the five skills your students need to practice most.</p>
              </div>
            </div>
          </VisibilitySensor>
          <div className="info-blurb-container">
            <div className="text-container">
              <p className="info-blurb-header">Personalized Recommendations</p>
              <p className="info-blurb-text">After your students complete a Pre-AP Writing Skills Survey, Quill will use the results to recommend a set of independent practice activities. You can choose to assign all the practice at once, or you can pick and choose the activities that best fit your instructional and students’ needs. As students complete the practice, they’ll receive instant feedback on their writing that guides them through the revising and editing process. </p>
            </div>
            <img alt="A recommended activity pack report showing four students being recommended a mixture of activities for relative clauses and parallel structure." src="https://assets.quill.org/images/college_board/pre-ap-recommendations.svg" />
          </div>
          <div className="info-blurb-container">
            <img alt="An illustration showing a student combining two sentences, getting feedback from Quill, and then getting a correct response." src="https://assets.quill.org/images/college_board/pre-ap-additional-practice.svg" />
            <div className="text-container">
              <p className="info-blurb-header">Additional Practice</p>
              <p className="info-blurb-text">Some of your students may benefit from more opportunities to practice a skill after they have completed the activities recommended based on their writing skills survey results. In that case, you can assign a second set of independent practice activities: same skills, new content.
                <a className="focus-on-light" href="https://support.quill.org/en/articles/4579893-how-do-i-assign-additional-practice-packs-for-pre-ap-skills-surveys" rel="noopener noreferrer" target="_blank">Learn more about the additional activity packs.</a>
              </p>
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
                <p>20 custom sentence-combining activities, each one aligned to a unique Pre-AP English 1 text to give your students the opportunity to practice their sentence construction skills in context.</p>
              </div>
            </VisibilitySensor>
          </div>
          <div className="activities-subheader">
            <h2>Passage-Aligned Activities</h2>
            <div className="college-board-activity-tag">For Pre-AP English 1</div>
          </div>
          <div className="white-section-wrapper">
            <div className="units-container">
              {expandableUnits}
            </div>
          </div>
        </div>
      </div>
      <div className="white-section-wrapper" ref={alignedToPreApRef}>
        <div className="container info-blurbs-section">
          <div className="info-blurb-container">
            <img alt="An illustration of a bookshelf with the names of Lottery, Lamb to the Slaughter, 1984, The First Day, and Romeo and Juliet on the book spines." src="https://assets.quill.org/images/college_board/pre-ap-bookshelf.svg" />
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, ALIGNED_TO_PREAP)}>
              <div className="text-container">
                <p className="info-blurb-header">Alignment to Pre-AP English 1 Content</p>
                <p className="info-blurb-text">Each sentence-combining activity is aligned to a different text from the four English 1 instructional units. As students combine sentences and build their writing skills, they also explore key text elements: historical and authorial context, plot, structure, and more. These activities model the kind of analytical thinking they would optimally reflect in their own writing.</p>
              </div>
            </VisibilitySensor>
          </div>
          <div className="info-blurb-container">
            <div className="text-container">
              <p className="info-blurb-header">Alignment to Pre-AP English High School Course Framework</p>
              <p className="info-blurb-text">In these sentence-combining items, students are free to use any grammatically correct method of combining the sentences they choose. However, each item is written to provide opportunities for students to practice the skills from the course framework. No matter which method students choose to use, they will receive instant, targeted feedback on up to five revisions to help them strengthen their sentence and build their writing skills. </p>
            </div>
            <img alt="An illustration showing a student combining two sentences, getting feedback from Quill, and then getting a correct response." src="https://assets.quill.org/images/college_board/pre-ap-couse-practice.svg" />
          </div>
          <div className="info-blurb-container">
            <img alt="An illustration showing a teacher guide for Lamb to the Slaughter with an arrow pointing to a Quill activity with text from Lamb to the Slaughter being in the questions." src="https://assets.quill.org/images/college_board/pre-ap-teacher-guide.svg" />
            <div className="text-container">
              <p className="info-blurb-header">Opportunities Throughout the Course</p>
              <p className="info-blurb-text" ref={collegeBoardMessageRef}>At least one activity appears in each Learning Cycle of all four instructional units so that this sentence-combining practice can easily be incorporated into your instructional plans. Since these activities include details about the texts and analysis of key elements,  they are best used to reinforce learning after students have read and discussed these texts in class.</p>
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
        <QuestionsAndAnswers handleChange={handleChange} questionsAndAnswersFile="preap" supportLink="" />
      </div>
    </div>
  )
}

PreAp.defaultProps = {
  units: []
}

export default PreAp
