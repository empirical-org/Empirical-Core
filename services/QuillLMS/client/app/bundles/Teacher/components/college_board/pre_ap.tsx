import * as React from 'react'
import ExpandableUnitSection from '../shared/expandableUnit'
import QuestionsAndAnswers from '../../containers/QuestionsAndAnswers'
import { COLLEGE_BOARD_SLUG, PRE_AP_SLUG } from '../assignment_flow/assignmentFlowConstants'

interface PreApContainerProps {
  isPartOfAssignmentFlow?: boolean;
  units?: Array<any>
}

const generateLink = (isPartOfAssignmentFlow, unitTemplateId) => {
  if (isPartOfAssignmentFlow) { return `/assign/featured-activity-packs/${unitTemplateId}?${COLLEGE_BOARD_SLUG}=${PRE_AP_SLUG}` }

  return `/activities/packs/${unitTemplateId}`
}

const PreAp = ({ units, isPartOfAssignmentFlow, }: PreApContainerProps) => {
  const expandableUnits = units.map((u, index) => {
    return (
      <ExpandableUnitSection
        generateLink={generateLink}
        isFirst={index === 0}
        isPartOfAssignmentFlow={isPartOfAssignmentFlow}
        key={u.id}
        learningCycles={u.learning_cycles}
        title={u.title}
      />
    )
  })

  const getStartedButton = isPartOfAssignmentFlow ? null : <a className="quill-button large primary contained focus-on-light" href="https://www.quill.org/account/new" rel="noopener noreferrer" target="_blank">Get started</a>

  return (<div className="pre-ap-container">
    <div className="section-wrapper">
      <div className="container pre-ap-header-container">
        <div className="header-left">
          <div className="logo-container">
            <img alt="College Board logo" src="https://assets.quill.org/images/college_board/college-board-logo.svg" />
            <div className="divider" />
            <img alt="Quill logo" src="https://assets.quill.org/images/logos/quill-logo-green.svg" />
          </div>
          <div className="header-text-container">
            <h1>Official Pre-AP English Practice</h1>
            <p>Free Pre-AP® English writing practice aligned to the Pre-AP English High School Course Framework for the English 1 and English 2 courses with immediate feedback for students and progress reports for you.</p>
            {getStartedButton}
          </div>
        </div>
        <img alt="Photograph of a teacher talking to a classroom of high school students" src="https://assets.quill.org/images/college_board/teaching-english-practice.png" />
      </div>
    </div>
    <div className="white-section-wrapper">
      <div className="container pre-ap-activities-section">
        <div className="header">
          <img alt="Illustration of a pencil drawing a line" src="https://assets.quill.org/images/college_board/sentence-writing-pencil.svg" />
          <div className="text-container">
            <h2>Sentence-Level Writing Practice</h2>
            <p>Identify which sentence-level skills from the course framework your students need to practice with two different Pre-AP Writing Skills Surveys. Then, assign up to 40 targeted writing activities so students can practice and improve their proficiency with those skills.</p>
          </div>
        </div>
        <div className="activities-subheader">
          <h2>Pre-AP Writing Skills Surveys</h2>
          <div className="ap-english-tag">For Pre-AP English 1</div>
          <div className="ap-english-tag">For Pre-AP English 2</div>
        </div>
        <div className="activity-container">
          <div className="activity-header-container">
            <p className="activity-header" id="writing-skills-survey-1">Pre-AP Writing Skills Survey 1: Basic of Sentence Patterns</p>
            <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink(isPartOfAssignmentFlow, 194)} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
          </div>
          <div className="activity-text-container">
            <p className="activity-sub-text">Students complete a twelve-item survey to gauge their understanding of key writing skills, fundamental grammatical elements, and compound/complex sentence constructions. After students complete the survey, Quill will automatically recommend up to five activity packs for each student based on their needs. Each pack contains four to six activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice on one of the five skills addressed in the survey.</p>
            <p className="activity-sub-header">Skills</p>
            <p className="activity-sub-text">Subject-verb agreement; pronoun-antecedent agreement; compound subjects, objects and predicates; coordinating conjunctions in compound sentences; subordinating conjunctions</p>
          </div>
        </div>
        <div className="activity-container">
          <div className="activity-header-container">
            <p className="activity-header" id="writing-skills-survey-2">Pre-AP Writing Skills Survey 2: Tools for Sentence Expansion</p>
            <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink(isPartOfAssignmentFlow, 195)} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
          </div>
          <div className="activity-text-container">
            <p className="activity-sub-text">Students complete a twelve-item survey to gauge their understanding of key writing skills, focusing on constructions for expanding sentences with description and detail. After students complete the survey, Quill will automatically recommend up to five activity packs for each student based on their needs. Each pack contains four to six activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice on one of the five skills addressed in the survey.</p>
            <p className="activity-sub-header">Skills</p>
            <p className="activity-sub-text">Conjunctive adverbs; appositive phrases; relative clauses; participial phrases; parallel structure</p>
          </div>
        </div>
      </div>
    </div>
    <div className="white-section-wrapper" id="info-blurbs-1-wrapper">
      <div className="container info-blurbs-section">
        <div className="info-blurb-container">
          <img alt="A list of writing concepts: Subject-Verb Agreement, Pronoun-Antecedent Agreement, Compound Subjects, Objects, Predicates, and more." src="https://assets.quill.org/images/college_board/pre-ap-concepts.svg" />
          <div className="text-container">
            <p className="info-blurb-header">Writing Practice Aligned to Course Frameworks</p>
            <p className="info-blurb-text">Each twelve-item Pre-AP Writing Skills Survey covers five of the ten key grammar skills from the English 1 and English 2 course frameworks. Each survey helps identify which of the five skills your students need to practice most.</p>
          </div>
        </div>
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
              <a className="focus-on-light" href="https://assets.quill.org/documents/additional_practice_packs.pdf" rel="noopener noreferrer" target="_blank">Learn more about the additional activity packs.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="white-section-wrapper">
      <div className="container pre-ap-activities-section">
        <div className="header">
          <img alt="Illustration of a book opened" src="https://assets.quill.org/images/college_board/passage-book.svg" />
          <div className="text-container">
            <h2>Passage-Aligned Activities</h2>
            <p>Twenty custom sentence-combining activities, each one aligned to a unique Pre-AP English 1 text to give your students the opportunity to practice their sentence construction skills in context.</p>
          </div>
        </div>
        <div className="activities-subheader">
          <h2>Passage-Aligned Activities</h2>
          <div className="ap-english-tag">For Pre-AP English 1</div>
        </div>
        <div className="white-section-wrapper">
          <div className="units-container">
            {expandableUnits}
          </div>
        </div>
      </div>
    </div>
    <div className="white-section-wrapper">
      <div className="container info-blurbs-section">
        <div className="info-blurb-container">
          <img alt="An illustration of a bookshelf with the names of Lottery, Lamb to the Slaughter, 1984, The First Day, and Romeo and Juliet on the book spines." src="https://assets.quill.org/images/college_board/pre-ap-bookshelf.svg" />
          <div className="text-container">
            <p className="info-blurb-header">Alignment to Pre-AP English 1 Content</p>
            <p className="info-blurb-text">Each sentence-combining activity is aligned to a different text from the four English 1 instructional units. As students combine sentences and build their writing skills, they also explore key text elements: historical and authorial context, plot, structure, and more. These activities model the kind of analytical thinking they would optimally reflect in their own writing.</p>
          </div>
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
            <p className="info-blurb-text">At least one activity appears in each Learning Cycle of all four instructional units so that this sentence-combining practice can easily be incorporated into your instructional plans. Since these activities include details about the texts and analysis of key elements,  they are best used to reinforce learning after students have read and discussed these texts in class.</p>
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
          <img id="first-quote" src="https://assets.quill.org/images/college_board/exaggerated-quote-left.svg" />
          <div className="inner-text-container">
            <p>Teaching writing is hard. Even harder can be attempting to pinpoint exactly when we learned how and why to write clearly. That’s why the College Board has worked with Quill.org to ensure that this new, free, comprehensive offering helps students practice targeted sentence construction skills in their writing. Sustained practice and exposure to targeted skills is important to improvement and comfort.</p>
            <p>Teaching writing may always be hard, but student practice in meaningful skills can make the learning that much clearer. Through this practice, students can begin to own the how and why of their writing.</p>
          </div>
          <img id="second-quote" src="https://assets.quill.org/images/college_board/exaggerated-quote-right.svg" />
        </div>
      </div>
    </div>
    <QuestionsAndAnswers questionsAndAnswersFile="preap" supportLink="" />
  </div>
  )
}

PreAp.defaultProps = {
  units: []
}

export default PreAp
