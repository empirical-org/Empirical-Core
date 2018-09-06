import * as React from 'react'

import { Concept } from '../../interfaces/concepts'
const notNecessaryIconSrc = 'http://localhost:45537/images/icons/not_necessary_icon.png'
const incorrectIconSrc = 'http://localhost:45537/images/icons/incorrect_icon.png'
const correctIconSrc = 'http://localhost:45537/images/icons/correct_icon.png'

interface EditProps {
  displayText: string;
  state: string;
  concept: Concept|undefined;
  activeIndex: number;
  index: number;
  numberOfEdits: number;
  next: any;
  incorrectText: string|null;
}

export default class Edit extends React.Component<EditProps, any> {
  constructor(props: EditProps) {
    super(props)

    this.renderTooltip = this.renderTooltip.bind(this)
    this.renderGrammaticalConcept = this.renderGrammaticalConcept.bind(this)
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

  renderTooltip() {
    const { activeIndex, index, state, numberOfEdits, next } = this.props
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
    return <div className={`edit-tooltip ${visible}`}>
      <div className="top-section">
        <div className="header">
          <img src={src}/>
          <h1>{headerText}</h1>
        </div>
        <p>Edit {index + 1} of {numberOfEdits}</p>
      </div>
      <div className="middle-section">
        <div>
          <p className="label">Correct Edit:</p>
          <p>{this.props.displayText}</p>
        </div>
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
    return <div className={`edit ${className} ${state}`}>
      <strong>{this.props.incorrectText || this.props.displayText}</strong>
      {tooltip}
    </div>
  }
}
