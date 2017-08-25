import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import MultipleTextEditor from '../shared/multipleTextEditor'
import StudentMultistep from '../play/multistep'

interface AdminMultistepProps {
  question: CLIntF.QuestionData,
  save: Function
}

class AdminMultistep extends Component<AdminMultistepProps, any>{
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
    this.save = this.save.bind(this)
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
    this.setState({question: newVals})
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
          <label className="label">Cues comma seperated (Optional)</label>
          <div className="control">
            <input value={Object.values(this.state.question.play.cues || {}).join(',')} onChange={this.handleCuesChange} className="input" type="text" placeholder="Text input"/>
          </div>
        </div>
        <div className="field">
          <label className="label">Step Labels</label>
          {this.renderStepLabels()}
        </div>
        <button className="button is-primary" style={{marginTop: 10}} onClick={this.save}>Save Changes</button>
      </div>
    )
  }

}

export default AdminMultistep
