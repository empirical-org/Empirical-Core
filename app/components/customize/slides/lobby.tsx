import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import StudentLobby from '../../ClassroomLessons/play/lobby'
import MultipleTextEditor from '../../classroomLessons/admin/slideHTMLEditor'

interface CustomizeLobbyProps {
  question: CLIntF.QuestionData,
  save: Function
}

class CustomizeLobby extends Component<CustomizeLobbyProps, any>{
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
            <StudentLobby title={this.state.question.teach.title} />
          </div>
        </div>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input value={this.state.question.teach.title} onChange={this.handleTitleChange} className="input" type="text" placeholder="Text input"/>
          </div>
        </div>
        <div className="field">
          <label className="label">HTML</label>
          <div className="control">
            <MultipleTextEditor
              text={this.state.question.play.html}
              handleTextChange={(e) => this.handleHTMLChange(e)}
            />
          </div>
        </div>
        <button className="button is-primary" style={{marginTop: 10}} onClick={this.save}>Save Changes</button>
      </div>
    )
  }

}

export default CustomizeLobby
