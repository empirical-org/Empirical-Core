import React, {Component} from 'react'
import * as IntF from '../interfaces';
import _ from 'lodash'
import MultipleTextEditor from '../shared/multipleTextEditor'

interface SingleAnswerProps {
  question: IntF.QuestionData,

}

class AdminLobby extends Component<SingleAnswerProps, any>{
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
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input value={this.state.question.teach.title} onChange={this.handleTitleChange} className="input" type="text" placeholder="Text input"/>
          </div>
        </div>
        <div className="field">
          <label className="label">Prompt</label>
          <div className="control">
            <MultipleTextEditor
              text={this.state.question.play.html}
              handleTextChange={(e) => this.handleHTMLChange(e)}
            />
          </div>
        </div>
        <button onClick={this.save}>Save Changes</button>
      </div>
    )
  }

}

export default AdminLobby
