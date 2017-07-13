import React, { Component } from 'react';
const moment = require('moment');
import _ from 'underscore'
import {
QuestionData
} from 'interfaces/classroomLessons'
import TextEditor from '../../renderForQuestions/renderTextEditor';
import SubmitButton from './submitButton.tsx'

class ListBlanks extends Component<{data: QuestionData}> {
  constructor(props) {
    super(props);
    this.state = {isSubmittable: false, answers: {}, errors: false, answerCount: 0}
    this.customChangeEvent = this.customChangeEvent.bind(this)
    this.handleStudentSubmission = this.handleStudentSubmission.bind(this)
  }

  customChangeEvent(e, index){
    const newState = Object.assign({}, this.state)
    newState.answers[index] = e
    newState.isSubmittable = this.isSubmittable(newState.answers)
    this.setState(newState)
  }

  isSubmittable(answers) {
    let nonBlankAnswers = 0;
    let errorCount = 0;
    if (answers) {
        // counts the number of truthy answers or adds to empty answer count
        for (let key in answers) {
          answers[key] ? nonBlankAnswers++ : null
        }
    }
    // verifies that the number of truthy answers is the same as number of blanks
    this.setState({nonBlankAnswers}, ()=> console.log(this.state))
    return nonBlankAnswers === this.props.data.play.nBlanks
  }

  itemHasError(i){
    const s = this.state
    if (s.errors && !s.answers[i]) {
        return true
    }
  }

  textEditListComponents(i){
    return (
      <div className={`list-component`} key={`list-component-${i}`}>
        <span className="list-number">{`Word ${i + 1}:`}</span>
        <TextEditor
          editorIndex={i}
          handleChange={this.customChangeEvent}
          hasError={this.itemHasError(i)}
          />
      </div>
    )
  }


  listBlanks() {
    return (
      <div className="list-blanks">
        {this.textEditorPerBlank()}
      </div>
    )
  }

  textEditorPerBlank(){
    const nBlanks = this.props.data.play.nBlanks;
    const textEditorArr = [];
    for (let i = 0; i < nBlanks; i++) {
        textEditorArr.push(
        this.textEditListComponents(i)
      )
    }
    return textEditorArr
  }

  handleStudentSubmission(){
    if (this.state.isSubmittable) {
        const sortedAnswers = Object.values(this.state.answers).sort()
        this.props.handleStudentSubmission(sortedAnswers, moment().format())
    } else {
      this.setState({errors: true});
    }
  }

  renderWarning(){
    const count = (this.props.data.play.nBlanks - 1) - this.state.answerCount;
    const suffix = count === 1 ? '' : 's';
    return (
      <span className="warning">
        {`You missed ${count} blank${suffix}! Please fill in all blanks, then submit your answer.`}
      </span>
    );
  }

  render() {
    let errorArea = this.state.errors ? this.renderWarning() : null;
    return (
      <div className="fill-in-blank">
        <h1 className="prompt">
          {this.props.data.play.prompt}
        </h1>
        {this.listBlanks()}
        <div>
          {errorArea}
          <SubmitButton disabled={!this.state.isSubmittable} onClick={this.handleStudentSubmission}/>
        </div>

      </div>
    );
  }

}

export default ListBlanks;
