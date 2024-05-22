import * as React from 'react'

import { baseSrc, } from './shared'

const questionCheckIcon = <img alt="" src={`${baseSrc}/question_check.svg`} />
const questionReviseIcon = <img alt="" src={`${baseSrc}/question_revise.svg`} />
const skillCheckIcon = <img alt="" src={`${baseSrc}/skill_check.svg`} />
const skillReviseIcon = <img alt="" src={`${baseSrc}/skill_revise.svg`} />

const QuestionLevelInformation = ({ question, }) => {
  const { question_number, questionScore, key_target_skill_concept, directions, prompt, cues, score, } = question
  const studentReachedOptimal = (questionScore || score) > 0

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

export default QuestionLevelInformation
