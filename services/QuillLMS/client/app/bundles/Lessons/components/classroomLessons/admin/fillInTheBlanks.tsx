import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/classroomLessons';
import _ from 'lodash'
import MultipleTextEditor from '../shared/multipleTextEditor'
import StudentFillInTheBlank from '../play/fillInTheBlank'
import promptSplitter from '../shared/promptSplitter'

interface AdminFillInTheBlanksProps {
  question: CLIntF.QuestionData,
  save: Function,
}

interface AdminFillInTheBlanksState {
  question: CLIntF.QuestionData,
  prefilledSampleCorrectAnswer?: string
}

class AdminFillInTheBlanks extends Component<AdminFillInTheBlanksProps, AdminFillInTheBlanksState>{
  constructor(props){
    super(props);

    this.state = {
      question: props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handlePromptChange = this.handlePromptChange.bind(this)
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this)
    this.handleCuesChange = this.handleCuesChange.bind(this)
    this.handleSampleCorrectAnswerChange = this.handleSampleCorrectAnswerChange.bind(this)
    this.updatePrefilledSampleCorrectAnswer = this.updatePrefilledSampleCorrectAnswer.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount() {
    this.updatePrefilledSampleCorrectAnswer(this.state.question.play.prompt)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (!_.isEqual(this.state.question, nextProps.question)) {
  //     this.setState({question: nextProps.question})
  //   }
  // }
  //
  updatePrefilledSampleCorrectAnswer(prompt) {
    const splitPrompt = promptSplitter(prompt)
    let formattedPrompt = ''
    splitPrompt.forEach((s, i) => {
      if (i !== splitPrompt.length -1) {
        formattedPrompt+=s.concat('<strong>').concat('___').concat('</strong>')
      }
    })
    this.setState({prefilledSampleCorrectAnswer: formattedPrompt})
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
    this.setState({question: newVals}, () => this.updatePrefilledSampleCorrectAnswer(this.state.question.play.prompt))
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

  handleSampleCorrectAnswerChange(e) {
    const newVals = {...this.state.question}
    _.set(newVals, 'play.sampleCorrectAnswer', e.target.value)
    this.setState({question: newVals})
  }

  save() {
    this.props.save(this.state.question)
  }

  render() {
    return (
      <div style={{marginTop: 30, marginBottom: 30}}>
        <div className="admin-slide-preview">
          <div className="scaler">
            <StudentFillInTheBlank data={this.state.question} />
          </div>
        </div>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input className="input" onChange={this.handleTitleChange} placeholder="Text input" type="text" value={this.state.question.teach.title} />
          </div>
        </div>
        <div className="field">
          <label className="label">Prompt</label>
          <div className="control">
            <input className="input" onChange={this.handlePromptChange} placeholder="Text input" type="text" value={this.state.question.play.prompt} />
          </div>
        </div>
        <div className="field">
          <label className="label">Instructions (Optional)</label>
          <div className="control">
            <input className="input" onChange={this.handleInstructionsChange} placeholder="Text input" type="text" value={this.state.question.play.instructions} />
          </div>
        </div>
        <div className="field">
          <label className="label">Cues comma separated (Optional)</label>
          <div className="control">
            <input className="input" onChange={this.handleCuesChange} placeholder="Text input" type="text" value={Object.values(this.state.question.play.cues || {}).join(',')} />
          </div>
        </div>
        <div className="field">
          <label className="label">Sample correct answer (Optional)</label>
          <div className="control">
            <i>Copy the text below into the input field and replace the blanks.</i>
            <p style={{border: '1px dashed black', padding: '8px', margin: '5px 0px'}}>{this.state.prefilledSampleCorrectAnswer}</p>
            <input className="input" onChange={this.handleSampleCorrectAnswerChange} placeholder="Text input" type="text" value={this.state.question.play.sampleCorrectAnswer} />
          </div>
        </div>
        <button className="button is-primary" onClick={this.save} style={{marginTop: 10}}>Save Changes</button>
      </div>
    )
  }

}

export default AdminFillInTheBlanks
