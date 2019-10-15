import * as React from 'react';

import { Concept } from '../../interfaces/concepts'
import Edit from './edit'

interface PassageReviewerProps {
  text: string;
  concepts: Concept[];
  finishReview: Function;
}

interface PassageReviewerState {
  activeIndex: number;
  numberOfEdits: number;
}

export default class PassageReviewer extends React.Component<PassageReviewerProps, PassageReviewerState> {
  constructor(props: PassageReviewerProps) {
    super(props)

    const matches = props.text ? props.text.match(/{\+([^-]+)-([^|]*)\|([^}]*)}/g) : []
    const numberOfEdits = matches ? matches.length : 0

    this.state = {
      activeIndex: 0,
      numberOfEdits
    }

    this.next = this.next.bind(this)
    this.renderFormattedText = this.renderFormattedText.bind(this)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  next() {
    const { activeIndex, numberOfEdits } = this.state
    if (activeIndex + 1 === numberOfEdits) {
      this.props.finishReview()
    } else {
      this.setState({
        activeIndex: activeIndex + 1
      })
      const el = document.getElementById(String(activeIndex + 1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  renderFormattedText() {
    const { text, concepts } = this.props
    const paragraphs = text.split('</p><p>')
    const punctuationRegex = /^[.,:;]/
    const { activeIndex, numberOfEdits } = this.state
    let index = 0
    return paragraphs.map((paragraph: string) => {
      const parts: Array<string|JSX.Element> = paragraph.replace(/<p>|<\/p>/g, '').split(/{|}/g)
      for (let i = 0; i < parts.length; i+=1) {
        if (typeof parts[i] === "string" && parts[i][0] === '+') {
          const plusMatch = parts[i].match(/\+([^-]+)-/m)
          const plus = plusMatch ? plusMatch[1] : ''
          const conceptUIDMatch = parts[i].match(/\|([^-]+)/m)
          const conceptUID = conceptUIDMatch ? conceptUIDMatch[1] : ''
          const negativeMatch = parts[i].match(/\-([^-]+)\|/m)
          const negative = negativeMatch ? negativeMatch[1] : null
          const concept = this.props.concepts.find(c => c.uid === conceptUID)
          const indexToPass = index
          let state = 'correct'
          if (conceptUID === 'unnecessary') {
            state = 'unnecessary'
          } else if (negative) {
            state = 'incorrect'
          }
          index+=1
          parts[i] = (<Edit
            activeIndex={activeIndex}
            concept={concept}
            displayText={plus}
            id={`${index}`}
            incorrectText={negative}
            index={indexToPass}
            next={this.next}
            numberOfEdits={numberOfEdits}
            state={state}
                      />)
          if (punctuationRegex.test(parts[i + 1])) {
            parts[i + 1] = `${parts[i + 1]}`
          } else {
            parts[i + 1] = ` ${parts[i + 1]}`
          }
        }
      }
      return <p>{parts}</p>
    })
  }

  render() {
    if (this.props.text) {
      return (<div className="reviewer" >
        {this.renderFormattedText()}
      </div>)
    } else {
      return <p>No passage</p>
    }
  }

}
