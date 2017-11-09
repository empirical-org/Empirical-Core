import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import MultipleTextEditor from './slideComponents/multipleTextEditor.jsx'
import StudentMultistep from '../../classroomLessons/play/multistep'
import TitleField from './slideComponents/titleField'

interface CustomizeMultistepProps {
  question: CLIntF.QuestionData,
  updateQuestion: Function,
  clearSlide: Function,
  resetSlide: Function,
  questionIndex: Number
}

class CustomizeMultistep extends Component<CustomizeMultistepProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handlePromptChange = this.handlePromptChange.bind(this)
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this)
    this.handleCuesChange = this.handleCuesChange.bind(this)
    this.deleteStepLabel = this.deleteStepLabel.bind(this)
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
    _.set(newVals, 'play.prompt', e.target.value)
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

  handleStepLabelChange(e, i) {
    const newVals = _.merge({}, this.state.question)
    const newStepLabels = this.state.question.play.stepLabels.slice()
    newStepLabels[i] = e.target.value
    _.set(newVals, 'play.stepLabels', newStepLabels)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  deleteStepLabel(i) {
    const newVals = _.merge({}, this.state.question)
    const newStepLabels = this.state.question.play.stepLabels.slice()
    newStepLabels.splice(i, 1)
    _.set(newVals, 'play.stepLabels', newStepLabels)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  renderStepLabels() {
    return this.state.question.play.stepLabels.concat(['']).map((sl, i) => {
      const deleteButton = i === this.state.question.play.stepLabels.length ? <span /> : <i className="fa fa-times" style={{marginLeft: '10px', cursor: 'pointer'}} onClick={() => this.deleteStepLabel(i)}/>
      return <div className="control" style={{display: 'flex'}} key={i}>
      <input value={sl} onChange={(e) => this.handleStepLabelChange(e, i)} className="input" type="text" placeholder="Text input"/>
      {deleteButton}
      </div>
    }
    )
  }

  render() {
    return (
      <div style={{marginTop: 30, marginBottom: 30}}>
        <div className="admin-slide-preview">
          <div className="scaler">
            <StudentMultistep data={this.state.question} />
          </div>
        </div>
        <TitleField
          clearSlide={this.props.clearSlide}
          questionIndex={this.props.questionIndex}
          resetSlide={this.props.resetSlide}
          title={this.state.question.teach.title}
          handleTitleChange={this.handleTitleChange}
        />
        <div className="field">
          <label className="label">Prompt</label>
          <div className="control">
            <input value={this.state.question.play.prompt} onChange={this.handlePromptChange} className="input" type="text" placeholder="Text input"/>
          </div>
        </div>
        <div className="field">
          <label className="label">Instructions (Optional)</label>
          <div className="control">
            <input value={this.state.question.play.instructions} onChange={this.handleInstructionsChange} className="input" type="text" placeholder="Text input"/>
          </div>
        </div>
        <div className="field">
          <label className="label">Cues comma separated (Optional)</label>
          <div className="control">
            <input value={Object.values(this.state.question.play.cues || {}).join(',')} onChange={this.handleCuesChange} className="input" type="text" placeholder="Text input"/>
          </div>
        </div>
        <div className="field">
          <label className="label">Step Labels</label>
          {this.renderStepLabels()}
        </div>
      </div>
    )
  }

}

export default CustomizeMultistep
