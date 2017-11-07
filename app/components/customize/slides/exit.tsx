import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import Static from '../../classroomLessons/play/static'
import SlideHTMLEditor from '../../classroomLessons/admin/slideHTMLEditor'

interface ExitProps {
  question: CLIntF.QuestionData,
  save: Function
}

class CustomizeExit extends Component<ExitProps, any>{
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
      <div className="slide">
        <div className="form">
          <div className="title-field field">
            <label>Title</label>
            <div className="control">
              <input value={this.state.question.teach.title} onChange={this.handleTitleChange} className="input" type="text" placeholder="Text input"/>
            </div>
          </div>
          <div className="prompt-field field">
            <label>Text</label>
            <div className="control">
              <SlideHTMLEditor
                text={this.state.question.play.html}
                handleTextChange={(e) => this.handleHTMLChange(e)}
              />
            </div>
          </div>
        </div>
        <div>
          <p className="slide-title">{this.state.question.teach.title}</p>
          <div className="preview">
            <div className="scaler">
              <Static data={this.state.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }



}

export default CustomizeExit
