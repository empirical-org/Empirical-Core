import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import MultipleTextEditor from '../../classroomLessons/admin/slideHTMLEditor'
import StudentStatic from '../../classroomLessons/play/static'
import TitleField from './slideComponents/titleField'

interface CustomizeStaticProps {
  question: CLIntF.QuestionData,
  updateQuestion: Function,
  clearSlide: Function,
  resetSlide: Function,
  questionIndex: Number
}

class CustomizeStatic extends Component<CustomizeStaticProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.updateQuestion = this.updateQuestion.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.question, this.state.question)) {
      this.setState({question: nextProps.question})
    }
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
          <TitleField
            clearSlide={this.props.clearSlide}
            questionIndex={this.props.questionIndex}
            resetSlide={this.props.resetSlide}
            title={this.state.question.teach.title}
            handleTitleChange={this.handleTitleChange}
          />
          <div className="prompt-field field">
            <label>Text</label>
            <div className="control">
              <MultipleTextEditor
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
              <StudentStatic data={this.state.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default CustomizeStatic
