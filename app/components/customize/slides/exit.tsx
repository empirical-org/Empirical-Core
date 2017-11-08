import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import Static from '../../classroomLessons/play/static'
import SlideHTMLEditor from '../../classroomLessons/admin/slideHTMLEditor'

interface ExitProps {
  question: CLIntF.QuestionData,
  updateQuestion: Function,
  questionIndex: Number
}

class CustomizeExit extends Component<ExitProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.updateQuestion = this.updateQuestion.bind(this)
  }

  updateQuestion(newVals, questionIndex) {
    this.setState({question: newVals}, () => this.props.updateQuestion(newVals, questionIndex))
  }

  handleTitleChange(e) {
    const newVals = _.merge({}, this.state.question)
    _.set(newVals, 'teach.title', e.target.value)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleHTMLChange(e) {
    const newVals = _.merge({}, this.state.question)
    _.set(newVals, 'play.html', e)
    this.updateQuestion(newVals, this.props.questionIndex)
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
        <div className="slide-preview-container">
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
