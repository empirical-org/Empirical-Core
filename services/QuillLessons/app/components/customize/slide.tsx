import * as React from 'react';
import { connect } from 'react-redux';
import { getComponent } from './helpers'
import _ from 'lodash'
import ScriptComponent from '../classroomLessons/shared/scriptComponent'

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

  componentWillReceiveProps(nextProps) {
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
      return <div>
        <Component
          question={this.props.question.data}
          questionIndex={this.props.questionIndex}
          updateQuestion={this.props.updateQuestion}
          clearSlide={this.props.clearSlide}
          resetSlide={this.props.resetSlide}
          incompletePrompt={this.props.incompletePrompt}
          />
          <div className="script-header" onClick={this.toggleShowScript}>
            <img src="http://assets.quill.org/images/icons/show-steps.svg"/>
            <p>{showScriptButtonText}</p>
          </div>
          {this.renderScript()}
        </div>
    }
  }

  renderScript() {
    if (this.state.showScript) {
      const filteredScript = this.props.question.data.teach.script.filter(s => s.type === 'STEP-HTML' || s.type === 'STEP-HTML-TIP')
      return <div className="script">
        <ScriptComponent script={filteredScript} />
      </div>
    }
  }

  render() {
    const showSlideButtonText = this.state.showSlide ? 'Hide' : 'Show'
    return <div className="slide-container" key={this.props.questionIndex}>
      <div className='slide-header'>
      <div style={{minWidth: `${this.numberAndTypeWidth()}`}} className='slide-number-and-type-container'>
        <span className="slide-number">Slide {this.props.questionIndex} - </span>
        <span className="slide-type">{this.slideTypeName()}</span>
      </div>
      <span className="line"></span>
      <span onClick={this.toggleShowSlide} className="hide">{showSlideButtonText}</span>
      </div>
      {this.renderSlide()}
    </div>
  }
}
