import * as React from 'react'

import { Concept } from '../../interfaces/concepts'
const notNecessaryIconSrc = 'https://assets.quill.org/images/icons/not_necessary_icon.png'
const incorrectIconSrc = 'https://assets.quill.org/images/icons/incorrect_icon.png'
const correctIconSrc = 'https://assets.quill.org/images/icons/correct_icon.png'

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

export default class Edit extends React.Component<EditProps, any> {
  constructor(props: EditProps) {
    super(props)

    this.renderTooltip = this.renderTooltip.bind(this)
    this.renderGrammaticalConcept = this.renderGrammaticalConcept.bind(this)
    this.renderCorrectAnswers = this.renderCorrectAnswers.bind(this)
  }

  renderGrammaticalConcept() {
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
    const correctAnswerArray = displayText ? displayText.split('~') : []
    let correctAnswers
    let correctAnswerHTML
    let labelText
    if (correctAnswerArray.length > 1) {
      correctAnswers = correctAnswerArray.map(ca => <li>{ca}</li>)
      correctAnswerHTML = <ul>{correctAnswers}</ul>
      labelText = 'Correct Edits'
    } else {
      correctAnswers = correctAnswerArray[0]
      correctAnswerHTML = <p>{correctAnswers}</p>
      labelText = 'Correct Edit'
    }
    return <div>
      <p className="label">{labelText}</p>
      {correctAnswerHTML}
    </div>
  }

  renderTooltip() {
    const { activeIndex, index, state, numberOfEdits, next, id } = this.props
    const visible = activeIndex === index ? 'visible' : 'invisible'
    const element = document.getElementById(id)
    const offset = element && ((window.innerWidth - element.offsetLeft) < 350) ? 'offset' : ''
    const correctAnswers = this.props.displayText ? this.props.displayText.split('~') : ''
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
          <img src={src}/>
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
    const { activeIndex, index, state } = this.props
    const className = activeIndex === index ? 'active' : ''
    const tooltip = this.renderTooltip()
    return <div className={`edit ${className} ${state}`} id={this.props.id}>
      <strong>{this.props.incorrectText || this.props.displayText}</strong>
      {tooltip}
    </div>
  }
}
