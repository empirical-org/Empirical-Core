import * as React from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import * as _ from 'lodash'
import StudentMultistep from '../play/multistep'

interface AdminMultistepProps {
  question: CLIntF.QuestionData,
  save: Function
}

class AdminMultistep extends React.Component<AdminMultistepProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: this.props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handlePromptChange = this.handlePromptChange.bind(this)
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this)
    this.handleCuesChange = this.handleCuesChange.bind(this)
    this.deleteStepLabel = this.deleteStepLabel.bind(this)
    this.handleSampleCorrectAnswerChange = this.handleSampleCorrectAnswerChange.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount() {
    this.updatePrefilledSampleCorrectAnswer(this.state.question.play.stepLabels)
  }

  updatePrefilledSampleCorrectAnswer(stepLabels) {
    let formattedAnswer = ''
    stepLabels.forEach((s, i) => {
      if (i === stepLabels.length - 1) {
        formattedAnswer+=`<strong>${s}</strong> ___`
      } else {
        formattedAnswer+=`<strong>${s}</strong> ___, `
      }
    })
    this.setState({prefilledSampleCorrectAnswer: formattedAnswer})
  }


  handleTitleChange(e) {
    const newVals = Object.assign(
      {},
      this.state.question
    );
    _.set(newVals, 'teach.title', e.target.value)
    this.setState({question: newVals})
  }

  handlePromptChange(e) {
    const newVals = Object.assign(
      {},
      this.state.question
    );
    _.set(newVals, 'play.prompt', e.target.value)
    this.setState({question: newVals})
  }

  handleInstructionsChange(e) {
    const newVals = Object.assign(
      {},
      this.state.question
    );
    _.set(newVals, 'play.instructions', e.target.value)
    this.setState({question: newVals})
  }

  handleCuesChange(e) {
    const newVals = Object.assign(
      {},
      this.state.question
    );
    const formattedCues = e.target.value.split(',');
    _.set(newVals, 'play.cues', formattedCues)
    this.setState({question: newVals})
  }

  handleStepLabelChange(e, i) {
    const newVals = Object.assign(
      {},
      this.state.question
    );
    const newStepLabels = this.state.question.play.stepLabels.slice()
    newStepLabels[i] = e.target.value
    _.set(newVals, 'play.stepLabels', newStepLabels)
    this.setState({question: newVals}, () => this.updatePrefilledSampleCorrectAnswer(this.state.question.play.stepLabels))
  }

  deleteStepLabel(i) {
    const newVals = Object.assign(
      {},
      this.state.question
    );
    const newStepLabels = this.state.question.play.stepLabels.slice()
    newStepLabels.splice(i, 1)
    _.set(newVals, 'play.stepLabels', newStepLabels)
    this.setState({question: newVals})
  }

  handleSampleCorrectAnswerChange(e) {
    const newVals = {...this.state.question}
    _.set(newVals, 'play.sampleCorrectAnswer', e.target.value)
    this.setState({question: newVals})
  }

  save() {
    this.props.save(this.state.question)
  }

  renderStepLabels() {
    return this.state.question.play.stepLabels.concat(['']).map((sl, i) => {
      const deleteButton = i === this.state.question.play.stepLabels.length ? <span /> : <i className="fa fa-times" style={{marginLeft: '10px', cursor: 'pointer'}} onClick={() => this.deleteStepLabel(i)}/>
      return <div className="control" style={{display: 'flex'}} key={i}>
      <input value={sl} onChange={(e) => this.handleStepLabelChange(e, i)} className="input" type="text" placeholder="Text input"/>
      {deleteButton}
      </div>
    })
  }

  render() {
    return (
      <div style={{marginTop: 30, marginBottom: 30}}>
        <div className="admin-slide-preview">
          <div className="scaler">
            <StudentMultistep data={this.state.question} />
          </div>
        </div>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input value={this.state.question.teach.title} onChange={this.handleTitleChange} className="input" type="text" placeholder="Text input"/>
          </div>
        </div>
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
        <div className="field">
          <label className="label">Sample correct answer (Optional)</label>
          <div className="control">
            <i>Copy the text below into the input field and replace the blanks.</i>
            <p style={{border: '1px dashed black', padding: '8px', margin: '5px 0px'}}>{this.state.prefilledSampleCorrectAnswer}</p>
            <input value={this.state.question.play.sampleCorrectAnswer} onChange={this.handleSampleCorrectAnswerChange} className="input" type="text" placeholder="Text input"/>
          </div>
        </div>
        <button className="button is-primary" style={{marginTop: 10}} onClick={this.save}>Save Changes</button>
      </div>
    )
  }

}

export default AdminMultistep
