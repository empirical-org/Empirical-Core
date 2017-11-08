import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import MultipleTextEditor from '../../classroomLessons/shared/multipleTextEditor'
import StudentModel from '../../classroomLessons/play/modelQuestion'
import TitleField from './slideComponents/titleField'

interface CustomizeModelProps {
  question: CLIntF.QuestionData,
  updateQuestion: Function,
  clearSlide: Function,
  resetSlide: Function,
  questionIndex: Number
}

class CustomizeModel extends Component<CustomizeModelProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handlePromptChange = this.handlePromptChange.bind(this)
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this)
    this.handleCuesChange = this.handleCuesChange.bind(this)
    this.updateQuestion = this.updateQuestion.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.question, this.state.question)) {
      this.setState({question: nextProps.question})
    }
  }

  updateQuestion(newVals, questionIndex) {
    this.setState({question: newVals}, () => this.props.updateQuestion(newVals, questionIndex))
  }

  handleTitleChange(e) {
    const newVals = _.merge({}, this.state.question)
    _.set(newVals, 'teach.title', e.target.value)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handlePromptChange(e) {
    const newVals = _.merge({}, this.state.question)
    const timeStamp = Date.now()
    _.set(newVals, 'play.prompt', e)
    console.log(Date.now() - timeStamp)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleInstructionsChange(e) {
    const newVals = _.merge({}, this.state.question)
    _.set(newVals, 'play.instructions', e.target.value)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleCuesChange(e) {
    const newVals = _.merge({}, this.state.question)
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
            questionIndex={this.props.questionIndex}
            resetSlide={this.props.resetSlide}
            title={this.state.question.teach.title}
            handleTitleChange={this.handleTitleChange}
          />
          <div className="prompt-field field">
            <label>Prompt</label>
            <div className="control">
              <MultipleTextEditor
                text={this.state.question.play.prompt}
                handleTextChange={(e) => this.handlePromptChange(e)}
              />
            </div>
          </div>
          <div className="instructions-field field">
            <label>Instructions <span className="optional">(Optional)</span></label>
            <div className="control">
              <input value={this.state.question.play.instructions} onChange={this.handleInstructionsChange} className="input" type="text" placeholder="Text input"/>
            </div>
          </div>
          <div className="cues-field field">
            <div className="spread-label">
              <label>Joining Words <span className="optional">(Optional)</span></label>
              <span>Make sure you separate words with commas “,”</span>
            </div>
            <div className="control">
            <input value={Object.values(this.state.question.play.cues || {}).join(',')} onChange={this.handleCuesChange} className="input" type="text" placeholder="Text input"/>
            </div>
          </div>
        </div>
        <div className="slide-preview-container">
          <p className="slide-title">{this.state.question.teach.title}</p>
          <div className="preview">
            <div className="scaler">
              <StudentModel data={this.state.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default CustomizeModel
