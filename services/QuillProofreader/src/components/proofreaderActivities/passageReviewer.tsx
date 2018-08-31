import * as React from 'react';

import { Concept } from '../../interfaces/concepts'
import Edit from './edit'

// import * as jsdiff from 'diff'
// import * as _ from 'underscore'

interface PassageReviewerProps {
  text: string;
  concepts: Array<Concept>;
}

interface PassageReviewerState {
  activeIndex: number;
  numberOfEdits: number;
}

export default class PassageReviewer extends React.Component<PassageReviewerProps, PassageReviewerState> {
  constructor(props: PassageReviewerProps) {
    super(props)

    const matches = props.text ? props.text.match(/{\+([^-]+)-([^|]+)\|([^}]+)}/g) : []
    const numberOfEdits = matches ? matches.length : 0

    this.state = {
      activeIndex: 0,
      numberOfEdits: numberOfEdits
    }

    this.next = this.next.bind(this)
    this.renderFormattedText = this.renderFormattedText.bind(this)
  }

  next() {
    this.setState({activeIndex: this.state.activeIndex + 1})
  }

  renderFormattedText() {
    const { text, concepts } = this.props
    const paragraphs = text.split('</p><p>')
    const { activeIndex, numberOfEdits } = this.state
    let index = 0
    return paragraphs.map((paragraph: string) => {
      const parts:Array<string|JSX.Element> = paragraph.replace(/<p>|<\/p>/g, '').split(/{|}/g)
      for (let i = 0; i < parts.length; i ++) {
        if (typeof parts[i] === "string" && parts[i][0] === '+') {
          const plusMatch = parts[i].match(/\+([^-]+)-/)
          const plus = plusMatch ? plusMatch[0].replace(/\+|-/g, '') : ''
          const conceptUIDMatch = parts[i].match(/\|([^}]+)/)
          const conceptUID = conceptUIDMatch ? conceptUIDMatch[0].replace(/\|/, '') : ''
          const concept = this.props.concepts.find(concept => concept.uid === conceptUID)
          const indexToPass = index
          const state = conceptUID === 'unnecessary' ? 'unnecessary' : 'correct'
          index++
          parts[i] = <Edit
            state={state}
            concept={concept}
            displayText={plus}
            index={indexToPass}
            activeIndex={activeIndex}
            next={this.next}
            numberOfEdits={numberOfEdits}
          />
        }
      }
      return <p>{parts}</p>
    })
  }

  render() {
    if (this.props.text) {
      return <div className="reviewer" >
        {this.renderFormattedText()}
      </div>
    } else {
      return <p>No passage</p>
    }
  }

}
