import _ from 'lodash';
import React, { Component } from 'react';
import * as CLIntF from '../../../interfaces/classroomLessons';
import Static from '../play/static';
import SlideHTMLEditor from './slideHTMLEditor';

interface ExitProps {
  question: CLIntF.QuestionData,
  save: Function
}

class AdminExit extends Component<ExitProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: this.props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
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

  handleHTMLChange(e) {
    const newVals = Object.assign(
      {},
      this.state.question
    );
    _.set(newVals, 'play.html', e)
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
            <Static data={this.state.question} />
          </div>
        </div>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input className="input" onChange={this.handleTitleChange} placeholder="Text input" type="text" value={this.state.question.teach.title} />
          </div>
        </div>
        <div className="field">
          <label className="label">HTML</label>
          <div className="control">
            <SlideHTMLEditor
              handleTextChange={(e) => this.handleHTMLChange(e)}
              text={this.state.question.play.html}
            />
          </div>
        </div>
        <button className="button is-primary" onClick={this.save} style={{marginTop: 10}}>Save Changes</button>
      </div>
    )
  }

}

export default AdminExit
