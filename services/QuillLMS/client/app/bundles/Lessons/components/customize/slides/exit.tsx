import _ from 'lodash';
import React, { Component } from 'react';
import * as CLIntF from '../../../interfaces/classroomLessons';
import Static from '../../classroomLessons/play/static';
import PromptField from './slideComponents/promptField';
import TitleField from './slideComponents/titleField';

interface ExitProps {
  question: CLIntF.QuestionData,
  updateQuestion: Function,
  clearSlide: Function,
  resetSlide: Function,
  questionIndex: Number,
  incompletePrompt: Boolean
}

class CustomizeExit extends Component<ExitProps, {}>{
  constructor(props){
    super(props);

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleHTMLChange = this.handleHTMLChange.bind(this)
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

  handleHTMLChange(e) {
    const newVals = _.merge({}, this.props.question)
    _.set(newVals, 'play.html', e)
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
            handleTextChange={(e) => this.handleHTMLChange(e)}
            incompletePrompt={this.props.incompletePrompt}
            reset={this.props.question.reset}
            showBlockquote={true}
            text={this.props.question.play.html}
          />
        </div>
        <div className="slide-preview-container">
          <p className="slide-title">{this.props.question.teach.title}</p>
          <div className="preview">
            <div className="scaler">
              <Static data={this.props.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }



}

export default CustomizeExit
