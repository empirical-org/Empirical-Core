import * as React from 'react';

import Edit from './edit'
import { isAnEditRegex, negativeMatchRegex } from './sharedRegexes'

import { Concept } from '../../interfaces/concepts'
import {
  UNNECESSARY_SPACE,
  MULTIPLE_UNNECESSARY_DELETION,
  SINGLE_UNNECESSARY_DELETION,
  MULTIPLE_UNNECESSARY_ADDITION,
  SINGLE_UNNECESSARY_ADDITION,
  UNNECESSARY_CHANGE
} from '../../helpers/determineUnnecessaryEditType'

const unnecessaryArray = [UNNECESSARY_SPACE, MULTIPLE_UNNECESSARY_DELETION, SINGLE_UNNECESSARY_DELETION, MULTIPLE_UNNECESSARY_ADDITION, SINGLE_UNNECESSARY_ADDITION, UNNECESSARY_CHANGE]

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

    const matches = props.text ? props.text.match(isAnEditRegex) : []
    const numberOfEdits = matches ? matches.length : 0

    this.state = {
      activeIndex: 0,
      numberOfEdits
    }
  }

  componentDidMount() {
    this.scrollToActiveIndex()
  }

  next = () => {
    const { activeIndex, numberOfEdits } = this.state
    const { finishReview, } = this.props
    if (activeIndex + 1 === numberOfEdits) {
      finishReview()
    } else {
      this.setState(prevState => ({ activeIndex: prevState.activeIndex + 1}), this.scrollToActiveIndex)
    }
  }

  back = () => {
    const { activeIndex, } = this.state
    if (activeIndex === 0) { return }

    this.setState(prevState => ({ activeIndex: prevState.activeIndex - 1}), this.scrollToActiveIndex)
  }

  scrollToActiveIndex() {
    const { activeIndex, } = this.state
    const el = document.getElementById(String(activeIndex))
    if (el) {
      window.scrollTo(0, window.pageYOffset + el.getBoundingClientRect().top - 34)
    }
  }

  renderFormattedText() {
    const { text, concepts } = this.props
    const paragraphs = text.split('</p><p>')
    const { activeIndex, numberOfEdits } = this.state
    let index = 0
    return paragraphs.map((paragraph: string, paragraphIndex: number) => {
      const parts: Array<string|JSX.Element> = paragraph.replace(/<p>|<\/p>/g, '').split(/{|}/g)
      for (let i = 0; i < parts.length; i +=1) {
        if (typeof parts[i] === "string" && parts[i][0] === '+') {
          const plusMatch = parts[i].match(/\+([^-]+)-/m)
          const plus = plusMatch ? plusMatch[1] : ''
          const conceptUIDMatch = parts[i].match(/\|(.+)/m)
          const conceptUID = conceptUIDMatch ? conceptUIDMatch[1] : ''
          const negativeMatch = parts[i].match(negativeMatchRegex)
          const negative = negativeMatch ? negativeMatch[1] : null
          const concept = concepts.find(c => c.uid === conceptUID)
          const indexToPass = index
          let state = 'correct'
          if (unnecessaryArray.includes(conceptUID)) {
            state = conceptUID
          } else if (negative) {
            state = 'incorrect'
          }
          index+=1
          parts[i] = (<Edit
            activeIndex={activeIndex}
            back={indexToPass ? this.back : null}
            concept={concept}
            displayText={plus}
            id={`${indexToPass}`}
            incorrectText={negative}
            index={indexToPass}
            next={this.next}
            numberOfEdits={numberOfEdits}
            state={state}
          />)
          parts[i + 1] = `${parts[i + 1]}`
        }
      }
      return <p key={paragraphIndex}>{parts}</p>
    })
  }

  render() {
    const { text, } = this.props

    if (text) {
      return (
        <div className="reviewer-container">
          <div className="reviewer" >
            {this.renderFormattedText()}
          </div>
        </div>
      )
    } else {
      return <p>No passage</p>
    }
  }

}
