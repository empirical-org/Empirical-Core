import * as React from 'react';
import ScriptComponent from '../classroomLessons/shared/scriptComponent';
import { getComponent } from './helpers';

export default class Slide extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      showSlide: true,
      showScript: false
    }

    this.toggleShowScript = this.toggleShowScript.bind(this)
    this.toggleShowSlide = this.toggleShowSlide.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.incompletePrompt) {
      this.setState({showSlide: true})
    }
  }

  toggleShowSlide() {
    this.setState({showSlide: !this.state.showSlide})
  }

  toggleShowScript() {
    this.setState({showScript: !this.state.showScript})
  }

  slideTypeName() {
    switch (this.props.question.type) {
      case 'CL-ST':
      case 'CL-EX':
        return 'Static Text'
      case 'CL-MD':
        return 'Teacher Model'
      case 'CL-SA':
      case 'CL-FB':
      case 'CL-FL':
      case 'CL-MS':
        return 'Students Practice'
      default:
        return ''
    }
  }

  numberAndTypeWidth() {
    switch (this.props.question.type) {
      case 'CL-ST':
      case 'CL-EX':
        return '130px'
      case 'CL-MD':
        return '165px'
      case 'CL-SA':
      case 'CL-FB':
      case 'CL-FL':
      case 'CL-MS':
        return '185px'
      default:
        return ''
    }
  }

  renderSlide() {
    if (this.state.showSlide) {
      const Component = getComponent(this.props.question.type)
      const showScriptButtonText = this.state.showScript ? 'Hide Step-By-Step Guide' : 'Show Step-By-Step Guide'
      return (
        <div>
          <Component
            clearSlide={this.props.clearSlide}
            incompletePrompt={this.props.incompletePrompt}
            question={this.props.question.data}
            questionIndex={this.props.questionIndex}
            resetSlide={this.props.resetSlide}
            updateQuestion={this.props.updateQuestion}
          />
          <div className="script-header" onClick={this.toggleShowScript}>
            <img alt="" src="https://assets.quill.org/images/icons/show-steps.svg" />
            <p>{showScriptButtonText}</p>
          </div>
          {this.renderScript()}
        </div>
      )
    }
  }

  renderScript() {
    if (this.state.showScript) {
      const filteredScript = this.props.question.data.teach.script.filter(s => s.type === 'STEP-HTML' || s.type === 'STEP-HTML-TIP')
      return (
        <div className="script">
          <ScriptComponent script={filteredScript} />
        </div>
      )
    }
  }

  render() {
    const showSlideButtonText = this.state.showSlide ? 'Hide' : 'Show'
    return (
      <div className="slide-container" key={this.props.questionIndex}>
        <div className='slide-header'>
          <div className='slide-number-and-type-container' style={{minWidth: `${this.numberAndTypeWidth()}`}}>
            <span className="slide-number">Slide {this.props.questionIndex} - </span>
            <span className="slide-type">{this.slideTypeName()}</span>
          </div>
          <span className="line" />
          <span className="hide" onClick={this.toggleShowSlide}>{showSlideButtonText}</span>
        </div>
        {this.renderSlide()}
      </div>
    )
  }
}
