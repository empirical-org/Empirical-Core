import _ from 'lodash';
import React, { Component } from 'react';
import * as CLIntF from '../../../interfaces/classroomLessons';
import StudentMultistep from '../../classroomLessons/play/multistep';
import PromptField from './slideComponents/promptField';
import TitleField from './slideComponents/titleField';

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
      return (
        <div className="control" key={i} style={{display: 'flex'}}>
          <input className="input" onChange={(e) => this.handleStepLabelChange(e, i)} type="text" value={sl} />
        </div>
      )
    }
    )
  }

  render() {
    return (
      <div className="slide">
        <div className="form">
          <TitleField
            clearSlide={this.props.clearSlide}
            handleTitleChange={this.handleTitleChange}
            questionIndex={this.props.questionIndex}
            resetSlide={this.props.resetSlide}
            title={this.props.question.teach.title}
          />
          <PromptField
            handleTextChange={(e) => this.handlePromptChange(e)}
            incompletePrompt={this.props.incompletePrompt}
            reset={this.props.question.reset}
            showBlockquote={false}
            text={this.props.question.play.prompt}
          />
          <div className="field">
            <label>Instructions <span className="optional">(Optional)</span></label>
            <div className="control">
              <input className="input" onChange={this.handleInstructionsChange} type="text" value={this.props.question.play.instructions} />
            </div>
          </div>
          <div className="field">
            <div className="spread-label">
              <label>Joining Words <span className="optional">(Optional)</span></label>
              <span>Make sure you separate words with commas “,”</span>
            </div>
            <div className="control">
              <input className="input" onChange={this.handleCuesChange} type="text" value={Object.values(this.props.question.play.cues || {}).join(',')} />
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
