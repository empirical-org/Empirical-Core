import React, {Component} from 'react'
import * as IntF from '../interfaces';
import _ from 'lodash'
interface SingleAnswerProps {
  question: IntF.QuestionData,

}

class AdminSingleAnswer extends Component<SingleAnswerProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: this.props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
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
    _.set(newVals, 'play.cues', e.target.value)
    this.setState({question: newVals})
  }

  render() {
    return (
      <div style={{marginTop: 30, marginBottom: 30}}>
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
          <label className="label">Cues (Optional)</label>
          <div className="control">
            <input value={this.state.question.play.cues} onChange={this.handleCuesChange} className="input" type="text" placeholder="Text input"/>
          </div>
        </div>

      </div>
    )
  }

}

export default AdminSingleAnswer
