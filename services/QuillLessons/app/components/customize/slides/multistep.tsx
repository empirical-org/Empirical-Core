import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/classroomLessons';
import _ from 'lodash'
import StudentMultistep from '../../classroomLessons/play/multistep'
import TitleField from './slideComponents/titleField'
import PromptField from './slideComponents/promptField'

interface CustomizeMultistepProps {
  question: CLIntF.QuestionData,
  updateQuestion: Function,
  clearSlide: Function,
  resetSlide: Function,
  questionIndex: Number,
  incompletePrompt: Boolean
}

class CustomizeMultistep extends Component<CustomizeMultistepProps, {}>{
  constructor(props){
    super(props);

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handlePromptChange = this.handlePromptChange.bind(this)
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this)
    this.handleCuesChange = this.handleCuesChange.bind(this)
    this.updateQuestion = this.updateQuestion.bind(this)
  }

  updateQuestion(newVals, questionIndex) {
    this.props.updateQuestion(newVals, questionIndex)
  }

  handleTitleChange(e) {
    const newVals = _.merge({}, this.props.question)
    _.set(newVals, 'teach.title', e.target.value)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handlePromptChange(e) {
    const newVals = _.merge({}, this.props.question)
    _.set(newVals, 'play.prompt', e)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleInstructionsChange(e) {
    const newVals = _.merge({}, this.props.question)
    _.set(newVals, 'play.instructions', e.target.value)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleCuesChange(e) {
    const newVals = _.merge({}, this.props.question)
    const formattedCues = e.target.value.split(',');
    _.set(newVals, 'play.cues', formattedCues)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleStepLabelChange(e, i) {
    const newVals = _.merge({}, this.props.question)
    const newStepLabels = this.props.question.play.stepLabels.slice()
    newStepLabels[i] = e.target.value
    _.set(newVals, 'play.stepLabels', newStepLabels)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  renderStepLabels() {
    return this.props.question.play.stepLabels.map((sl, i) => {
      return <div className="control" style={{display: 'flex'}} key={i}>
      <input value={sl} onChange={(e) => this.handleStepLabelChange(e, i)} className="input" type="text"/>
      </div>
    }
    )
  }

  render() {
    return (
      <div className="slide">
        <div className="form">
          <TitleField
            clearSlide={this.props.clearSlide}
            questionIndex={this.props.questionIndex}
            resetSlide={this.props.resetSlide}
            title={this.props.question.teach.title}
            handleTitleChange={this.handleTitleChange}
          />
          <PromptField
            incompletePrompt={this.props.incompletePrompt}
            text={this.props.question.play.prompt}
            handleTextChange={(e) => this.handlePromptChange(e)}
            showBlockquote={false}
          />
          <div className="field">
            <label>Instructions <span className="optional">(Optional)</span></label>
            <div className="control">
              <input value={this.props.question.play.instructions} onChange={this.handleInstructionsChange} className="input" type="text"/>
            </div>
          </div>
          <div className="field">
            <div className="spread-label">
              <label>Joining Words <span className="optional">(Optional)</span></label>
              <span>Make sure you separate words with commas “,”</span>
            </div>
            <div className="control">
              <input value={Object.values(this.props.question.play.cues || {}).join(',')} onChange={this.handleCuesChange} className="input" type="text"/>
            </div>
          </div>
          <div className="field">
            <label>Field Labels</label>
            {this.renderStepLabels()}
          </div>
        </div>
        <div className="slide-preview-container">
          <p className="slide-title">{this.props.question.teach.title}</p>
          <div className="preview">
            <div className="scaler">
              <StudentMultistep data={this.props.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default CustomizeMultistep
