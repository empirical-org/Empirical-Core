import * as React from 'react'

import QuestionsAndAnswers from '../../containers/QuestionsAndAnswers'
import { COLLEGE_BOARD_SLUG, AP_SLUG } from '../assignment_flow/assignmentFlowConstants'

interface ApContainerProps {
  isPartOfAssignmentFlow?: boolean;
}

const generateLink = (isPartOfAssignmentFlow, unitTemplateId) => {
  if (isPartOfAssignmentFlow) { return `/assign/featured-activity-packs/${unitTemplateId}?${COLLEGE_BOARD_SLUG}=${AP_SLUG}` }

  return `/activities/packs/${unitTemplateId}`
}

const Ap = ({ isPartOfAssignmentFlow, }: ApContainerProps) => {
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
            <h1>Official AP Writing Practice</h1>
            <p>Free AP® writing practice with comprehensive progress reports for you and immediate feedback for students that guides them towards mastery of sentence-level skills.</p>
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
            <p>Identify which sentence-level skills your students need to practice with the AP Writing Skills Surveys. Then, assign activities recommended for each student based on their survey responses so they can practice and improve their proficiency with those skills.</p>
          </div>
        </div>
        <div className="activities-subheader">
          <h2>AP Writing Skills Surveys</h2>
          <div className="ap-english-tag">For All AP students</div>
        </div>
        <div className="activity-container">
          <div className="activity-header-container">
            <a className="activity-header" id="writing-skills-survey">AP Writing Skills Survey</a>
            <a className="quill-button medium primary outlined view-button focus-on-light" href={generateLink(isPartOfAssignmentFlow, 193)} rel="noopener noreferrer" target={isPartOfAssignmentFlow ? '' : "_blank"}>View</a>
          </div>
          <div className="activity-text-container">
            <p className="activity-sub-text">Students complete a seventeen-item survey to gauge their understanding of key writing skills that are essential to successful AP- and SAT-level writing. After students complete the survey, Quill will automatically recommend up to seven activity packs for each student based on their needs. Each pack contains a series of activities that each take about 15 minutes to complete and provide scaffolded, sequenced practice with one of the skills covered by the survey.</p>
            <p className="activity-sub-header">Skills</p>
            <p className="activity-sub-text">Complex Sentences; relative clauses; appositive phrases; participial phrases; parallel structure; compound-complex sentences; advanced combining</p>
          </div>
        </div>
      </div>
    </div>
    <div className="white-section-wrapper" id="info-blurbs-1-wrapper">
      <div className="container info-blurbs-section">
        <div className="info-blurb-container">
          <img alt="A recommended activity pack report showing four students being recommended a mixture of activities for relative clauses and participial phrases." src="https://assets.quill.org/images/college_board/ap-recommendations.svg" />
          <div className="text-container">
            <p className="info-blurb-header">Personalized Recommendations</p>
            <p className="info-blurb-text">After students complete the AP Writing Skills Survey, you'll receive recommendations for each student based on their responses and tailored to their individual needs. Each student will be recommended up to 45 sentence combining activities, grouped by concept into seven packs, that provide meaningful, targeted practice. You can assign all the activities with one click, or you can pick and choose.</p>
          </div>
        </div>
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
            <p className="info-blurb-text">You can monitor the progress of your students and continue to identify areas of need and areas of strength through multiple data reports. Use the analysis report to review your students' work sentence-by-sentence, or use the summary report to get a high-level sense of where your students could use some extra support.</p>
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
    <QuestionsAndAnswers questionsAndAnswersFile="ap" supportLink="" />
  </div>
  )
}

export default Ap
