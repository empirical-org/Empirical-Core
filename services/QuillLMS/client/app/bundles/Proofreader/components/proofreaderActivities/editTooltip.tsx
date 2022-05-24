import * as React from 'react'

import {
  UNNECESSARY_SPACE,
  MULTIPLE_UNNECESSARY_DELETION,
  SINGLE_UNNECESSARY_DELETION,
  MULTIPLE_UNNECESSARY_ADDITION,
  SINGLE_UNNECESSARY_ADDITION,
  UNNECESSARY_CHANGE
} from '../../helpers/determineUnnecessaryEditType'
import useFocus from '../../../Shared/hooks/useFocus'

const notNecessaryIconSrc = `${process.env.CDN_URL}/images/icons/review-not-necessary.svg`
const incorrectIconSrc = `${process.env.CDN_URL}/images/icons/review-incorrect.svg`
const correctIconSrc = `${process.env.CDN_URL}/images/icons/review-correct.svg`

const renderConceptExplanation = (concept) => {
  if (!(concept && concept.explanation)) { return <span /> }
  return (
    <div className="explanation">
      <p className="label">Explanation</p>
      <p dangerouslySetInnerHTML={{ __html: concept.explanation }} />
    </div>
  )
}

const renderCorrectAnswers = (displayText) => {
  if (!displayText) { return }

  const correctAnswerArray = displayText ? displayText.split('~') : []
  const correctAnswers = correctAnswerArray.map(ca => <span className="correct-answer" key={ca}>{ca}</span>)
  const correctAnswerHTML = <p>{correctAnswers}</p>
  return (
    <div aria-hidden={true}>
      <p className="label">Correct</p>
      {correctAnswerHTML}
    </div>
  )
}

const renderNotNecessaryExplanation = (state) => {
  const unnecessaryArray = [UNNECESSARY_SPACE, MULTIPLE_UNNECESSARY_DELETION, SINGLE_UNNECESSARY_DELETION, MULTIPLE_UNNECESSARY_ADDITION, SINGLE_UNNECESSARY_ADDITION, UNNECESSARY_CHANGE]
  if (!unnecessaryArray.includes(state)) { return }
  let explanation

  switch (state) {
    case UNNECESSARY_SPACE:
      explanation = 'You added an unnecessary space.'
      break
    case MULTIPLE_UNNECESSARY_DELETION:
      explanation = "You took out words that weren't part of an error."
      break
    case SINGLE_UNNECESSARY_DELETION:
      explanation = "You took out a word that wasn't part of an error."
      break
    case MULTIPLE_UNNECESSARY_ADDITION:
      explanation = "You added unnecessary words."
      break
    case SINGLE_UNNECESSARY_ADDITION:
      explanation = "You added an unnecessary word."
      break
    case SINGLE_UNNECESSARY_ADDITION:
      explanation = "You added an unnecessary word."
      break
    case UNNECESSARY_CHANGE:
      explanation = 'You made an unnecessary change.'
      break
  }

  return <p className="unnecessary-explanation">{explanation}</p>
}


const EditTooltip = ({ state, id, tooltipHeight, back, numberOfEdits, next, index, displayText, concept, incorrectText, }) => {
  const [containerRef, setContainerFocus] = useFocus()

  React.useEffect(() => {
    setContainerFocus()
  }, [])

  let src, headerText, altText
  switch (state) {
    case 'correct':
      src = correctIconSrc
      headerText = "Correct"
      break
    case 'incorrect':
      src = incorrectIconSrc
      headerText = "Incorrect"
      break
    case UNNECESSARY_SPACE:
    case MULTIPLE_UNNECESSARY_DELETION:
    case SINGLE_UNNECESSARY_DELETION:
    case MULTIPLE_UNNECESSARY_ADDITION:
    case SINGLE_UNNECESSARY_ADDITION:
    case UNNECESSARY_CHANGE:
      src = notNecessaryIconSrc
      headerText = "Not necessary"
      break
  }
  const parentElement = document.getElementById(id)
  const style = parentElement ? { top: `${parentElement.offsetTop + 5}px`, height: tooltipHeight } : {}
  const backButton = back ? <button className="quill-button medium secondary outlined focus-on-light" onClick={back} type="button">Back</button> : <div className="placeholder" />
  const nextButton = <button className="quill-button medium primary contained focus-on-light" onClick={next} type="button">{index + 1 === numberOfEdits ? 'Done' : 'Next'}</button>
  return (
    <div aria-live="polite" className="edit-tooltip" ref={containerRef} style={style} tabIndex={-1}>
      <div className="top-section">
        <img alt="" src={src} />
        <h2>{headerText}</h2>
      </div>
      <div className="middle-section">
        {renderNotNecessaryExplanation(state)}
        <p className="sr-only">The correct text was {displayText}. {incorrectText && `You submitted ${incorrectText === ' ' ? 'An empty space.' : incorrectText}.`}</p>
        {renderCorrectAnswers(displayText)}å
        {renderConceptExplanation(concept)}
      </div>
      <div className="button-section">
        {backButton}
        <div className="counter">{index + 1} of {numberOfEdits}</div>
        {nextButton}
      </div>
    </div>
  )

}

export default EditTooltip
