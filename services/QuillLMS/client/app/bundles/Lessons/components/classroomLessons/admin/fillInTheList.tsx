import * as _ from 'lodash';
import * as React from 'react';
import * as CLIntF from '../../../interfaces/classroomLessons';
import StudentFillInTheList from '../play/listBlanks';

interface AdminFillInTheListProps {
  question: CLIntF.QuestionData,
  save: Function
}

class AdminFillInTheList extends React.Component<AdminFillInTheListProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: this.props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handlePromptChange = this.handlePromptChange.bind(this)
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this)
    this.handleCuesChange = this.handleCuesChange.bind(this)
    this.handleNBlanks = this.handleNBlanks.bind(this)
    this.handleBlankLabelChange = this.handleBlankLabelChange.bind(this)
    this.handleSampleCorrectAnswerChange = this.handleSampleCorrectAnswerChange.bind(this)
    this.save = this.save.bind(this)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (!_.isEqual(this.state.question, nextProps.question)) {
  //     this.setState({question: nextProps.question})
  //   }
  // }
  //
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

  handleBlankLabelChange(e) {
    const newVals = Object.assign(
      {},
      this.state.question
    );
    _.set(newVals, 'play.blankLabel', e.target.value)
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

  handleNBlanks(e) {
    const newVals = Object.assign(
      {},
      this.state.question
    );
    const nBlanks = e.target.value.length > 0 ? Number(e.target.value) : e.target.value;
    _.set(newVals, 'play.nBlanks', nBlanks)
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
            <StudentFillInTheList data={this.state.question} />
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
          <label className="label">Blank Label</label>
          <div className="control">
            <input className="input" onChange={this.handleBlankLabelChange} placeholder="Text input" type="text" value={this.state.question.play.blankLabel} />
          </div>
        </div>
        <div className="field">
          <label className="label">Number of Blanks</label>
          <div className="control">
            <input className="input" onChange={this.handleNBlanks} placeholder="Text input" type="text" value={this.state.question.play.nBlanks} />
          </div>
        </div>
        <div className="field">
          <label className="label">Sample correct answer (Optional)</label>
          <div className="control">
            <input className="input" onChange={this.handleSampleCorrectAnswerChange} placeholder="Text input" type="text" value={this.state.question.play.sampleCorrectAnswer} />
          </div>
        </div>
        <button className="button is-primary" onClick={this.save} style={{marginTop: 10}}>Save Changes</button>
      </div>
    )
  }

}

export default AdminFillInTheList
