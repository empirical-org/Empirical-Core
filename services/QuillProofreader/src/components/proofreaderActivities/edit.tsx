import * as React from 'react'

import { Concept } from '../../interfaces/concepts'
const notNecessaryIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/not_necessary_icon.png`
const incorrectIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/incorrect_icon.png`
const correctIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/correct_icon.png`

interface EditProps {
  displayText: string;
  state: string;
  concept: Concept|undefined;
  activeIndex: number;
  index: number;
  numberOfEdits: number;
  next: any;
  incorrectText: string|null;
  id: string;
}

export default class Edit extends React.Component<EditProps, {offset: string}> {
  constructor(props: EditProps) {
    super(props)

    this.state = { offset: ''}

    this.renderTooltip = this.renderTooltip.bind(this)
    this.renderGrammaticalConcept = this.renderGrammaticalConcept.bind(this)
    this.renderCorrectAnswers = this.renderCorrectAnswers.bind(this)
  }

  componentDidMount() {
    const { id } = this.props
    const element = document.getElementById(id)
    let tooltipWidth = 340
    if (window.innerWidth <= 900) {
      tooltipWidth = 230
    } else if (window.innerWidth <= 400) {
      tooltipWidth = 185
    }
    let remainingWidth
    let offset = ''
    if (element) {
      // the following line handles the case where the element is split across two lines, because its offsetWidth will be roughly the width of the entire text area
      if (window.innerWidth - 200 < element.offsetWidth) {
        // if that's the case, we want to calculate the remaining width without reference to the element itself
        remainingWidth = window.innerWidth - element.offsetLeft - tooltipWidth
      } else {
        // otherwise, since the tooltip begins where the element does, we can include the element's width as part of the space needed for the tooltip
        remainingWidth = (window.innerWidth - element.offsetLeft - tooltipWidth) + element.offsetWidth
      }
      offset = remainingWidth < tooltipWidth ? 'offset' : ''
    }
    this.setState({ offset })
  }

  renderGrammaticalConcept():JSX.Element|void {
    const { concept } = this.props
    if (concept) {
      return <div>
        <p className="label">Grammatical Concept:</p>
        <p>{concept.name}</p>
      </div>
    }
  }

  renderCorrectAnswers() {
    const { displayText } = this.props
    if (displayText) {
      const correctAnswerArray = displayText ? displayText.split('~') : []
      let correctAnswers
      let correctAnswerHTML
      let labelText
      if (correctAnswerArray.length > 1) {
        correctAnswers = correctAnswerArray.map(ca => <li>{ca}</li>)
        correctAnswerHTML = <ul>{correctAnswers}</ul>
        labelText = 'Correct Edits:'
      } else {
        correctAnswers = correctAnswerArray[0]
        correctAnswerHTML = <p>{correctAnswers}</p>
        labelText = 'Correct Edit:'
      }
      return <div>
        <p className="label">{labelText}</p>
        {correctAnswerHTML}
      </div>
    } else {
      return <span />
    }
  }

  renderTooltip() {
    const { activeIndex, index, state, numberOfEdits, next } = this.props
    const { offset } = this.state
    const visible = activeIndex === index ? 'visible' : 'invisible'
    let src, headerText
    switch (state) {
      case 'correct':
        src = correctIconSrc;
        headerText = 'Correct'
        break
      case 'incorrect':
        src = incorrectIconSrc;
        headerText = 'Incorrect'
        break
      case 'unnecessary':
        src = notNecessaryIconSrc
        headerText = 'Not Necessary'
        break
    }
    return <div className={`edit-tooltip ${visible} ${offset}`}>
      <div className="top-section">
        <div className="header">
          <img src={src} />
          <h1>{headerText}</h1>
        </div>
        <p>Edit {index + 1} of {numberOfEdits}</p>
      </div>
      <div className="middle-section">
        {this.renderCorrectAnswers()}
        {this.renderGrammaticalConcept()}
      </div>
      <div className="button-section">
        <button onClick={next}>Next Edit ➞</button>
      </div>
    </div>
  }

  render() {
    const { activeIndex, index, state, id } = this.props
    const className = activeIndex === index ? 'active' : ''
    const tooltip = this.renderTooltip()
    return <div className={`edit ${className} ${state}`} id={id}>
      <strong>{this.props.incorrectText || this.props.displayText}</strong>
      {tooltip}
    </div>
  }
}
