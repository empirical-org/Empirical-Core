import * as React from 'react'

import EditTooltip from './editTooltip'

import {
  UNNECESSARY_SPACE,
  MULTIPLE_UNNECESSARY_DELETION,
  SINGLE_UNNECESSARY_DELETION,
  MULTIPLE_UNNECESSARY_ADDITION,
  SINGLE_UNNECESSARY_ADDITION,
  UNNECESSARY_CHANGE
} from '../../helpers/determineUnnecessaryEditType'
import { Concept } from '../../interfaces/concepts'

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

  renderTooltip() {
    const { mounting, tooltipHeight, } = this.state
    const { activeIndex, index, state, numberOfEdits, next, back, id, displayText, incorrectText, } = this.props
    if (mounting || activeIndex !== index) { return }

    return (
      <EditTooltip
        back={back}
        displayText={displayText}
        id={id}
        incorrectText={incorrectText}
        index={index}
        next={next}
        numberOfEdits={numberOfEdits}
        state={state}
        tooltipHeight={tooltipHeight}
      />
    )
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
    return (
      <div className={`edit ${this.editClassName()}`} id={id}>
        <span className="displayed-text">{incorrectText || displayText}</span>
        {tooltip}
      </div>
    )
  }
}
