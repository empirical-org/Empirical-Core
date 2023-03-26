import _ from 'lodash';
import React, { Component } from 'react';
import * as CLIntF from '../../../interfaces/classroomLessons';
import StudentModel from '../../classroomLessons/play/modelQuestion';
import PromptField from './slideComponents/promptField';
import TitleField from './slideComponents/titleField';

interface CustomizeModelProps {
  question: CLIntF.QuestionData,
  updateQuestion: Function,
  clearSlide: Function,
  resetSlide: Function,
  questionIndex: Number,
  incompletePrompt: Boolean
}

class CustomizeModel extends Component<CustomizeModelProps, {}>{
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
            showBlockquote={true}
            text={this.props.question.play.prompt}
          />
          <div className="instructions-field field">
            <label>Instructions <span className="optional">(Optional)</span></label>
            <div className="control">
              <input className="input" onChange={this.handleInstructionsChange} type="text" value={this.props.question.play.instructions} />
            </div>
          </div>
          <div className="cues-field field">
            <div className="spread-label">
              <label>Joining Words <span className="optional">(Optional)</span></label>
              <span>Make sure you separate words with commas “,”</span>
            </div>
            <div className="control">
              <input className="input" onChange={this.handleCuesChange} type="text" value={Object.values(this.props.question.play.cues || {}).join(',')} />
            </div>
          </div>
        </div>
        <div className="slide-preview-container">
          <p className="slide-title">{this.props.question.teach.title}</p>
          <div className="preview">
            <div className="scaler">
              <StudentModel data={this.props.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default CustomizeModel
