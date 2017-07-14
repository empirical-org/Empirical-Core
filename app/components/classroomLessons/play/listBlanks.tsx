import React, { Component } from 'react';
const moment = require('moment');
import {
QuestionData
} from 'interfaces/classroomLessons'
import TextEditor from '../../renderForQuestions/renderTextEditor';
import SubmitButton from './submitButton'
import FeedbackRow from './feedbackRow'
import numberToWord from '../../../libs/numberToWord'

class ListBlanks extends Component<{data: QuestionData}> {
  constructor(props) {
    super(props);
    this.state = {isSubmittable: false, answers: {}, errors: false, answerCount: 0, submitted: false}
    this.customChangeEvent = this.customChangeEvent.bind(this)
    this.handleStudentSubmission = this.handleStudentSubmission.bind(this)
  }

  customChangeEvent(e, index){
    const newState = Object.assign({}, this.state)
    newState.answers[index] = e
    const initialBlankCount = this.props.data.play.nBlanks;
    const answerCount = this.answerCount(newState.answers)
    newState.answerCount = answerCount
    if (initialBlankCount === answerCount) {
        // if this is the case then all answers are filled and we are good
        newState.isSubmittable = true
        newState.errors = false
    } else {
      // otherwise it is not submittable
      newState.isSubmittable = false
    }
    this.setState(newState)
  }

  renderProject() {
    const classAnswers = this.props.selected_submissions
    ? (<div>
      <p className="answer-header"><i className="fa fa-users" />Class Answers:</p>
      {this.renderClassAnswersList()}
    </div>)
    : <span />;
    return (
      <div className="display-mode">
        <p className="answer-header"><i className="fa fa-user" />Your Answer:</p>
        {this.renderYourAnswer()}
        {classAnswers}
      </div>
    );
  }

  renderYourAnswer() {
    return <p className="your-answer">bleh</p>;
  }

  renderClassAnswersList() {
    const { selected_submissions, submissions, } = this.props;
    const selected = Object.keys(selected_submissions).map((key, index) => {
      const text = submissions[key].data;
      return (<li>
        <span>{index + 1}</span>{text}
      </li>);
    });
    return (
      <ul className="class-answer-list">
        {selected}
      </ul>
    );
  }


  answerCount(answers) {
    let nonBlankAnswers = 0;
    let errorCount = 0;
    if (answers) {
        // counts the number of truthy answers or adds to empty answer count
        for (let key in answers) {
          answers[key] ? nonBlankAnswers++ : null
        }
    }
    return nonBlankAnswers
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
          disabled={!this.state.isSubmittable && this.state.submitted}
          />
      </div>
    )
  }

  listBlanks() {
    const nBlanks = this.props.data.play.nBlanks;
    const textEditorArr = [];
    for (let i = 0; i < nBlanks; i++) {
        textEditorArr.push(
        this.textEditListComponents(i)
      )
    }
    return (
      <div className="list-blanks">
        {textEditorArr}
      </div>
    )
  }

  handleStudentSubmission(){
    if (this.state.isSubmittable) {
        const sortedAnswers = Object.values(this.state.answers).sort()
        this.props.handleStudentSubmission(sortedAnswers.join(', '), moment().format())
        this.setState({isSubmittable: false, submitted: true})
    } else {
      this.setState({errors: true});
    }
  }

  renderWarning(){
    const count = numberToWord(this.props.data.play.nBlanks - this.state.answerCount);
    const suffix = count === 1 ? '' : 's';
    return (
      <span className="warning">
        {`You missed ${count} blank${suffix}! Please fill in all blanks, then submit your answer.`}
      </span>
    );
  }

  renderModeSpecificContent(){
    if (this.props.mode==='PROJECT') {
      return this.renderProject()
    } else {
      let errorArea = this.state.errors ? this.renderWarning() : null;
      let feedbackRow = this.state.submitted ? <FeedbackRow/> : null
      return (
        <div>
        <h1 className="prompt">
          {this.props.data.play.prompt}
        </h1>
        {this.listBlanks()}
        <div>
          {errorArea}
          {feedbackRow}
          <SubmitButton key={this.state.submitted} disabled={!this.state.isSubmittable && this.state.submitted} onClick={this.handleStudentSubmission}/>
        </div>
        </div>
      )
    }
  }


  render() {
    console.log(this.props)
    return (
      <div className="list-blanks">
        {this.renderModeSpecificContent()}
      </div>
    );
  }

}

export default ListBlanks;
