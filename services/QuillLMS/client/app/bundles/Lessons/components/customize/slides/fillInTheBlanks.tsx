import _ from 'lodash';
import React, { Component } from 'react';
import * as CLIntF from '../../../interfaces/classroomLessons';
import StudentFillInTheBlank from '../../classroomLessons/play/fillInTheBlank';
import CuesField from './slideComponents/cuesField';
import PromptField from './slideComponents/promptField';
import TitleField from './slideComponents/titleField';

interface CustomizeFillInTheBlanksProps {
  question: CLIntF.QuestionData,
  updateQuestion: Function,
  clearSlide: Function,
  resetSlide: Function,
  questionIndex: Number,
  incompletePrompt: Boolean
}

class CustomizeFillInTheBlanks extends Component<CustomizeFillInTheBlanksProps>{
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
            blankInstructions={<span className="blank-instructions">Make sure you add "___" to create blanks between the words</span>}
            handleTextChange={(e) => this.handlePromptChange(e)}
            incompletePrompt={this.props.incompletePrompt}
            reset={this.props.question.reset}
            showBlockquote={false}
            text={this.props.question.play.prompt}
          />
          <div className="instructions-field field">
            <label>Instructions <span className="optional">(Optional)</span></label>
            <div className="control">
              <input className="input" onChange={this.handleInstructionsChange} type="text" value={this.props.question.play.instructions} />
            </div>
          </div>
          <CuesField
            cues={Object.values(this.props.question.play.cues || {})}
            handleCuesChange={(e) => this.handleCuesChange(e)}
          />
        </div>
        <div className="slide-preview-container">
          <p className="slide-title">{this.props.question.teach.title}</p>
          <div className="preview">
            <div className="scaler">
              <StudentFillInTheBlank data={this.props.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }


}

export default CustomizeFillInTheBlanks
