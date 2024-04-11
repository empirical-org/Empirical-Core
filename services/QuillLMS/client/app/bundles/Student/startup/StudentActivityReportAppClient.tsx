import * as React from 'react';
import _ from 'lodash';
import { stripHtml } from "string-strip-html";

import { HelpfulTips, formatAnswerStringForReports, findFeedbackForReport, } from '../../Shared/index';
import { proficiencyCutoffsAsPercentage } from '../../../modules/proficiency_cutoffs';
import numberSuffixBuilder from '../../Teacher/components/modules/numberSuffixBuilder';

const arrowBackSrc = `${process.env.CDN_URL}/images/icons/arrow-back.svg`

const baseSrc = `${process.env.CDN_URL}/images/pages/student_activity_report`
const feedbackReviseIcon = <img alt="" src={`${baseSrc}/feedback_revise.svg`} />
const feedbackCheckIcon = <img alt="" src={`${baseSrc}/feedback_check.svg`} />
const feedbackMultipleChoiceIcon = <img alt="" src={`${baseSrc}/feedback_multiple_choice.svg`} />
const questionCheckIcon = <img alt="" src={`${baseSrc}/question_check.svg`} />
const questionReviseIcon = <img alt="" src={`${baseSrc}/question_revise.svg`} />
const skillCheckIcon = <img alt="" src={`${baseSrc}/skill_check.svg`} />
const skillReviseIcon = <img alt="" src={`${baseSrc}/skill_revise.svg`} />

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

const StudentActivityReportApp = ({ activity, showExactScore, reportData, classroomId, }) => {
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

  function renderQuestions() {
    return reportData.concept_results.sort((a, b) => parseFloat(a.question_number) - parseFloat(b.question_number)).map(question => renderQuestion(question))
  }

  function renderQuestion(question) {
    return (
      <div className="question-container">
        {renderQuestionLevelInformation(question)}
        <div className="attempts">{renderAttempts(question)}</div>
      </div>
    )
  }

  function renderQuestionLevelInformation(question) {
    const { question_number, questionScore, key_target_skill_concept, directions, prompt, cues, } = question
    const studentReachedOptimal = questionScore > 0

    const parentheticalContentRegex = /\s*\(([^)]+)\)/

    const [directionsForDisplay, cuesString] = directions.split(parentheticalContentRegex);

    const cuesStrippedFromDirections = cuesString?.split(', ')

    const cuesForDisplay = cues || cuesStrippedFromDirections
    const cueElements = cuesForDisplay?.map(cue => <span className="cue" key={cue}>{cue}</span>)

    return (
      <div className={`question-level-information ${studentReachedOptimal ? 'optimal' : 'suboptimal'}`}>
        <h2>
          <span>Question {question_number}</span>
          {studentReachedOptimal ? questionCheckIcon : questionReviseIcon}
        </h2>

        <div className="directions">
          <h3>Directions</h3>
          <p>{directionsForDisplay.trim()}</p>
        </div>

        <div className="prompt">
          <h3>Prompt</h3>
          <div>
            <div className="prompt-text" dangerouslySetInnerHTML={{ __html: prompt, }} />
            {cueElements}
          </div>
        </div>

        <div className="target-skill">
          <h3>Target Skill</h3>
          <div className={`target-skill-indicator ${key_target_skill_concept.correct ? 'correct' : 'incorrect'}`}>
            {key_target_skill_concept.correct ? skillCheckIcon : skillReviseIcon}
            <span>{key_target_skill_concept.name}</span>
          </div>
        </div>
      </div>
    )
  }

  function renderAttempts(question) {
    const groupedAttempts = _.groupBy(question.concepts, (cr) => cr.attempt)
    const groupedAttemptValues = Object.values(groupedAttempts)
    return groupedAttemptValues.map((groupedAttempt, index) => {
      const attempt = groupedAttempt[0]

      let className = "suboptimal"
      let icon = feedbackReviseIcon

      const lastAttempt = index === groupedAttemptValues.length - 1

      if (lastAttempt) {
        className = question.questionScore > 0 ? 'optimal' : 'final-suboptimal'
        icon = question.questionScore > 0 ? feedbackCheckIcon : feedbackMultipleChoiceIcon
      }

      const attemptNumber = attempt.attempt
      const previousAnswer = groupedAttempts[index - 1] ? groupedAttempts[index - 1][0].answer : null

      const feedback = String(findFeedbackForReport(attemptNumber, groupedAttempts))

      return (
        <div className="attempt" key={attemptNumber}>
          <h3>{numberSuffixBuilder(attemptNumber)} attempt</h3>
          <p className="answer">{formatAnswerStringForReports(attempt.answer, previousAnswer, attemptNumber, true)}</p>
          <div className={`feedback ${className}`}>
            <h4>{icon} Feedback</h4>
            <p>{stripHtml(feedback).result}</p>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="student-activity-report">
      <div className="student-profile-header">
        <div className="container">
          <a className="quill-button secondary outlined medium focus-on-light" href={classroomId ? `/classrooms/${classroomId}` : '/'}>
            <img alt="Back arrow icon" src={arrowBackSrc} />
            All activities
          </a>
        </div>
      </div>
      <div className="container">
        <div className="header">
          <h1>{activity.name}</h1>
          {renderScore()}
        </div>
        {helpfulTips}
        {renderQuestions()}
      </div>
    </div>
  )
}

export default StudentActivityReportApp
