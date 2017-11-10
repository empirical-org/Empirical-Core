import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import PromptField from './slideComponents/promptField'
import StudentFillInTheList from '../../classroomLessons/play/listBlanks'
import TitleField from './slideComponents/titleField'

interface CustomizeFillInTheListProps {
  question: CLIntF.QuestionData,
  updateQuestion: Function,
  clearSlide: Function,
  resetSlide: Function,
  questionIndex: Number,
  incompletePrompt: Boolean
}

class CustomizeFillInTheList extends Component<CustomizeFillInTheListProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handlePromptChange = this.handlePromptChange.bind(this)
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this)
    this.handleCuesChange = this.handleCuesChange.bind(this)
    this.handleNBlanks = this.handleNBlanks.bind(this)
    this.handleBlankLabelChange = this.handleBlankLabelChange.bind(this)
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
    _.set(newVals, 'play.prompt', e)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleInstructionsChange(e) {
    const newVals = _.merge({}, this.state.question)
    _.set(newVals, 'play.instructions', e.target.value)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleBlankLabelChange(e) {
    const newVals = _.merge({}, this.state.question)
    _.set(newVals, 'play.blankLabel', e.target.value)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleCuesChange(e) {
    const newVals = _.merge({}, this.state.question)
    const formattedCues = e.target.value.split(',');
    _.set(newVals, 'play.cues', formattedCues)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleNBlanks(e) {
    const newVals = _.merge({}, this.state.question)
    const nBlanks = e.target.value.length > 0 ? Number(e.target.value) : e.target.value;
    _.set(newVals, 'play.nBlanks', nBlanks)
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
          <PromptField
            incompletePrompt={this.props.incompletePrompt}
            text={this.state.question.play.prompt}
            handleTextChange={(e) => this.handlePromptChange(e)}
          />
          <div className="instructions-field field">
            <label>Instructions <span className="optional">(Optional)</span></label>
            <div className="control">
              <input value={this.state.question.play.instructions} onChange={this.handleInstructionsChange} className="input" type="text"/>
            </div>
          </div>
          <div className="number-of-blanks-field field">
            <label>Number of Blanks</label>
            <div className="control">
              <input value={this.state.question.play.nBlanks} onChange={this.handleNBlanks} className="input" type="text"/>
            </div>
          </div>
        </div>
        <div className="slide-preview-container">
          <p className="slide-title">{this.state.question.teach.title}</p>
          <div className="preview">
            <div className="scaler">
              <StudentFillInTheList data={this.state.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default CustomizeFillInTheList
