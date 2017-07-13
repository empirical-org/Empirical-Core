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
    this.state = {isSubmittable: false, answers: {}}
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
    let answerCount = 0;
    if (answers) {
        // counts hte number of truthy answers
        for (let key in answers) {
          answers[key] ? answerCount++ : null
        }
    }
    // verifies that the number of truthy answers is the same as number of blanks
    return answerCount === this.props.data.play.nBlanks
  }

  textEditListComponents(i){
    return (
      <div className={`list-component`} key={`list-component-${i}`}>
      <span className="list-number">{`Word ${i + 1}:`}</span>
      <TextEditor
        editorIndex={i}
        handleChange={this.customChangeEvent}
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
        this.props.handleStudentSubmission(this.state.answers, moment().format())
    }
    let text = this.state.isSubmittable ? 'student submission' : 'warning'
    console.log(text)

  }

  render() {
    return (
      <div className="fill-in-blank">
        <h1 className="prompt">
          {this.props.data.play.prompt}
        </h1>
        {this.listBlanks()}
        <SubmitButton disabled={!this.state.isSubmittable} onClick={this.handleStudentSubmission}/>
      </div>
    );
  }

}

export default ListBlanks;
