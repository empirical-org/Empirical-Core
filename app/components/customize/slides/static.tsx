import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import MultipleTextEditor from '../../classroomLessons/admin/slideHTMLEditor'
import StudentStatic from '../../classroomLessons/play/static'

interface CustomizeStaticProps {
  question: CLIntF.QuestionData,
  save: Function
}

class CustomizeStatic extends Component<CustomizeStaticProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: this.props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.save = this.save.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.state.question, nextProps.question)) {
      this.setState({question: nextProps.question})
    }
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
              <MultipleTextEditor
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
              <StudentStatic data={this.state.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default CustomizeStatic
