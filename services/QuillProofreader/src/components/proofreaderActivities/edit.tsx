import * as React from 'react'

import { Concept } from '../../interfaces/concepts'
const notNecessaryIconSrc = 'https://localhost:45537/images/icons/not_necessary_icon.png'
const incorrectIconSrc = 'https://localhost:45537/images/icons/incorrect_icon.png'
const correctIconSrc = 'https://localhost:45537/images/icons/correct_icon.png'

interface EditProps {
  displayText: string;
  state: string;
  concept: Concept|undefined;
  activeIndex: number;
  index: number;
  numberOfEdits: number;
  next: any;
}

export default class Edit extends React.Component<EditProps> {

  constructor(props: EditProps) {
    super(props)

    this.renderTooltip = this.renderTooltip.bind(this)
  }

  renderTooltip() {
    const { activeIndex, index, state, numberOfEdits, next } = this.props
    const visible = activeIndex === index ? 'visible' : 'invisible'
    let src, headerText
    switch (state) {
      case 'correct':
        src = correctIconSrc;
        headerText = 'Correct'
        return
      case 'incorrect':
        src = incorrectIconSrc;
        headerText = 'Incorrect'
        return
      case 'unnecessary':
        src = notNecessaryIconSrc
        headerText = 'Not Necessary'
        return
    }
    return <div className={`edit-tooltip ${state} ${visible}`}>
      <div className="top-section">
        <div className="header">
          <img src={src}/>
          <h1>{headerText}</h1>
        </div>
        <p>Edit {index} of {numberOfEdits}</p>
      </div>
      <div className="button-section">
        <button onClick={next}>Next Edit ➞</button>
      </div>
    </div>
  }

  render() {
    const { activeIndex, index } = this.props
    const className = activeIndex === index ? 'active' : ''
    return <div className="edit">
      <strong className={className}>{this.props.displayText}</strong>
      {this.renderTooltip()}
    </div>
  }
}
