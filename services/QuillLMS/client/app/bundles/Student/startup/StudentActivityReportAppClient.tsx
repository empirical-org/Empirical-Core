import * as React from 'react';
import _ from 'lodash';
import moment from 'moment'

import Attempt from '../components/studentActivityReport/attempt'
import QuestionLevelInformation from '../components/studentActivityReport/questionLevelInformation'
import { HelpfulTips, DropdownInput, } from '../../Shared/index';
import { proficiencyCutoffsAsPercentage } from '../../../modules/proficiency_cutoffs';
import NumberSuffix from '../../Teacher/components/modules/numberSuffixBuilder';

const arrowBackSrc = `${process.env.CDN_URL}/images/icons/arrow-back.svg`

const helpfulTips = (
  <HelpfulTips
    header={<h3>Helpful Tips <span>(Expand to show more information)</span></h3>}
    sections={[
      {
        headerText: "You will receive full credit on each question where you reach a strong response by the final attempt.",
        body: (
          <React.Fragment>
            <p>Questions where you reached a strong response by your final attempt will be indicated in green.</p><br />
            <p>Questions where you didn’t reach a strong response by your final attempt will be indicated in yellow.</p><br />
            <p>Your score is calculated by how many strong responses you got out of the total number of questions:</p>
            <ul>
              <li>Green for scoring between 83-100%</li>
              <li>Yellow for scoring between 32%-82%</li>
              <li>Red for scoring between 0-31%</li>
            </ul><br />
            <p>We encourage you to replay activities to get additional practice on skills and <a href="https://www.quill.org/teacher-center/go-for-green" rel="noopener noreferrer" target="_blank">Go for Green.</a></p>
          </React.Fragment>
        )
      },
      {
        headerText: "The bolded text helps you see edits you made to your writing.",
        body: (
          <React.Fragment>
            <p>In each of your responses, we have bolded all of the text that was added or edited from your previous response so that you can quickly see what you changed as you worked through the activity.</p><br />
            <p>This is different from the bolding you see within an activity, which provides hints on what to improve. In the feedback you see below, phrases like “look at the bolded word” refer to the bolding you got as a hint within the activity, not the bolded text you see on this report.</p>
          </React.Fragment>
        )
      }
    ]}
  />
)

const StudentActivityReportApp = ({ activity, showExactScore, reportData, classroomId, activitySessions, }) => {
  function onActivitySessionClick(activitySession) {
    window.location.href = `/activity_sessions/${activitySession.value}/student_activity_report`
  }

  function renderScore() {
    const { score, number_of_questions, number_of_correct_questions, } = reportData;

    if (!showExactScore || (!score && score !== 0)) { return }

    const displaySkills = number_of_questions ? `${number_of_correct_questions} of ${number_of_questions} correct` : ''
    const displayScore = score ? `(${score}%)` : ''

    const cutOff = proficiencyCutoffsAsPercentage();

    let className = 'not-yet-proficient'

    if (score >= cutOff.nearlyProficient) { className = 'nearly-proficient'}

    if (score >= cutOff.proficient) { className = 'proficient'}

    return (
      <div className={`score ${className}`}>
        <span className="score-indicator" />
        <strong>{displaySkills}</strong>&nbsp;
        {displayScore}
      </div>
    )
  }

  function renderDropdown() {
    if (activitySessions.length === 1) { return }

    const activitySessionOptions = activitySessions.map((s, index) => {
      const scoreNumber = `${NumberSuffix(index + 1)} ${showExactScore && s.score ? 'Score' : 'Attempt'}`
      const formattedDate = moment.utc(s.completed_at).format('MMM D[,] h:mma')
      const label = showExactScore && s.score ? `${scoreNumber}: ${s.score}% - ${formattedDate}` : `${scoreNumber} - ${formattedDate}`
      return { value: s.activity_session_id, label, }
    })
    const activitySessionValue = activitySessionOptions.find(s => reportData.activity_session_id === s.value)


    return (
      <DropdownInput className="bordered activity-sessions" handleChange={onActivitySessionClick} options={activitySessionOptions} value={activitySessionValue} />
    )
  }

  function renderQuestions() {
    return reportData.concept_results.sort((a, b) => parseFloat(a.question_number) - parseFloat(b.question_number)).map(question => renderQuestion(question))
  }

  function renderQuestion(question) {
    return (
      <div className="question-container">
        <QuestionLevelInformation
          question={question}
        />
        <div className="attempts">{renderAttempts(question)}</div>
      </div>
    )
  }

  function renderAttempts(question) {
    const groupedAttempts = _.groupBy(question.concepts, (cr) => cr.attempt)
    const groupedAttemptValues = Object.values(groupedAttempts)
    return groupedAttemptValues.map((groupedAttempt, index) => {
      const attempt = groupedAttempt[0]
      const lastAttempt = index === groupedAttemptValues.length - 1
      return (
        <Attempt
          attempt={attempt}
          groupedAttempts={groupedAttempts}
          index={index}
          key={index}
          lastAttempt={lastAttempt}
          studentReachedOptimal={(question.questionScore || question.score) > 0}
        />
      )
    })
  }

  return (
    <div className="student-activity-report">
      <div className="student-profile-header">
        <div className="container">
          <a className="quill-button-archived secondary outlined medium focus-on-light" href={classroomId ? `/classrooms/${classroomId}` : '/'}>
            <img alt="Back arrow icon" src={arrowBackSrc} />
            All activities
          </a>
        </div>
      </div>
      <div className="container">
        <div className="header">
          <h1>{activity.name}</h1>
          <div className="dropdown-and-score">
            {renderDropdown()}
            {renderScore()}
          </div>
        </div>
        {helpfulTips}
        {renderQuestions()}
      </div>
    </div>
  )
}

export default StudentActivityReportApp
