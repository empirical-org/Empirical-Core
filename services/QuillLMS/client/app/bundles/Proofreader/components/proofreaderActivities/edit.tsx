import * as React from 'react'

import { Concept } from '../../interfaces/concepts'

import {
  UNNECESSARY_SPACE,
  MULTIPLE_UNNECESSARY_DELETION,
  SINGLE_UNNECESSARY_DELETION,
  MULTIPLE_UNNECESSARY_ADDITION,
  SINGLE_UNNECESSARY_ADDITION,
  UNNECESSARY_CHANGE
} from '../../helpers/determineUnnecessaryEditType'

const notNecessaryIconSrc = `${process.env.CDN_URL}/images/icons/review-not-necessary.svg`
const incorrectIconSrc = `${process.env.CDN_URL}/images/icons/review-incorrect.svg`
const correctIconSrc = `${process.env.CDN_URL}/images/icons/review-correct.svg`

interface EditProps {
  displayText: string;
  state: string;
  concept: Concept|undefined;
  activeIndex: number;
  index: number;
  numberOfEdits: number;
  next: any;
  back?: Function;
  incorrectText: string|null;
  id: string;
}

const OFFSET_FROM_TOP = 74

function calculateHeight() {
  if (window.innerWidth > 800) {
    return '400px'
  }

  return `${window.innerHeight - OFFSET_FROM_TOP}px`
}

export default class Edit extends React.Component<EditProps, {mounting: boolean, tooltipHeight: string}> {
  constructor(props: EditProps) {
    super(props)

    this.state = { mounting: true, tooltipHeight: calculateHeight() }
  }

  componentDidMount() {
    this.handleComponentBeingMounted()

    window.addEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    this.setState({ tooltipHeight: calculateHeight() })
  }

  handleComponentBeingMounted = () => this.setState({ mounting: false, })

  renderConceptExplanation(): JSX.Element {
    const { concept } = this.props
    if (!(concept && concept.explanation)) { return <span /> }
    return (<div className="explanation">
      <p className="label">Explanation</p>
      <p>{concept.explanation}</p>
    </div>)
  }

  renderCorrectAnswers() {
    const { displayText } = this.props
    if (!displayText) { return }

    const correctAnswerArray = displayText ? displayText.split('~') : []
    const correctAnswers = correctAnswerArray.map(ca => <span className="correct-answer" key={ca}>{ca}</span>)
    const correctAnswerHTML = <p>{correctAnswers}</p>
    return (<div>
      <p className="label">Correct</p>
      {correctAnswerHTML}
    </div>)
  }

  renderNotNecessaryExplanation() {
    const { state, } = this.props
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

  renderTooltip() {
    const { mounting, tooltipHeight, } = this.state
    const { activeIndex, index, state, numberOfEdits, next, back, id, } = this.props
    if (mounting || activeIndex !== index) { return }

    let src, headerText, altText
    switch (state) {
      case 'correct':
        src = correctIconSrc
        altText = "Correct icon"
        headerText = "Correct"
        break
      case 'incorrect':
        src = incorrectIconSrc
        altText = "Incorrect icon"
        headerText = "Incorrect"
        break
      case UNNECESSARY_SPACE:
      case MULTIPLE_UNNECESSARY_DELETION:
      case SINGLE_UNNECESSARY_DELETION:
      case MULTIPLE_UNNECESSARY_ADDITION:
      case SINGLE_UNNECESSARY_ADDITION:
      case UNNECESSARY_CHANGE:
        src = notNecessaryIconSrc
        altText = "Not necessary icon"
        headerText = "Not necessary"
        break
    }
    const parentElement = document.getElementById(id)
    const style = parentElement ? { top: `${parentElement.offsetTop + 5}px`, height: tooltipHeight } : {}
    const backButton = back ? <button className="quill-button medium secondary outlined focus-on-light" onClick={back} type="button">Back</button> : <div className="placeholder" />
    const nextButton = <button className="quill-button medium primary contained focus-on-light" onClick={next} type="button">{index + 1 === numberOfEdits ? 'Done' : 'Next'}</button>
    return (<div className="edit-tooltip" style={style}>
      <div className="top-section">
        <img alt={altText} src={src} />
        <h2>{headerText}</h2>
      </div>
      <div className="middle-section">
        {this.renderNotNecessaryExplanation()}
        {this.renderCorrectAnswers()}
        {this.renderConceptExplanation()}
      </div>
      <div className="button-section">
        {backButton}
        <div className="counter">{index + 1} of {numberOfEdits}</div>
        {nextButton}
      </div>
    </div>)
  }

  editClassName() {
    const { activeIndex, index, state, } = this.props
    let className = activeIndex === index ? 'active' : ''
    switch (state) {
      case 'correct':
        className += ' correct'
        break
      case 'incorrect':
        className += ' incorrect'
        break
      case UNNECESSARY_SPACE:
      case MULTIPLE_UNNECESSARY_DELETION:
      case SINGLE_UNNECESSARY_DELETION:
      case MULTIPLE_UNNECESSARY_ADDITION:
      case SINGLE_UNNECESSARY_ADDITION:
      case UNNECESSARY_CHANGE:
        className += ' unnecessary'
        break
    }
    return className
  }

  render() {
    const { id, incorrectText, displayText, } = this.props
    const tooltip = this.renderTooltip()
    return (<div className={`edit ${this.editClassName()}`} id={id}>
      <span className="displayed-text">{incorrectText || displayText}</span>
      {tooltip}
    </div>)
  }
}
