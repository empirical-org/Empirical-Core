import React, { Component } from 'react';
import Cues from 'components/renderForQuestions/cues';
import RenderSentenceFragments from 'components/renderForQuestions/sentenceFragments';
import icon from 'img/question_icon.svg';
import TextEditor from '../../renderForQuestions/renderTextEditor';
import { getParameterByName } from 'libs/getParameterByName';
const moment = require('moment');

class SingleAnswer extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      response: this.props.submissions && this.props.submissions[getParameterByName('student')] ? this.props.submissions[getParameterByName('student')].data : '',
      editing: false,
      submitted: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitSubmission = this.submitSubmission.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const student = getParameterByName('student');
    // this will reset the state when a teacher resets a question
    if (this.state.submitted === true && nextProps.submissions === null) {
      this.setState({ submitted: false, editing: false, response: '', });
    }
    if (nextProps.submissions && nextProps.submissions[student] && (nextProps.submissions[student].data !== this.state.response)) {
      this.setState({ response: nextProps.submissions[student].data })
    }
  }

  submitSubmission() {
    this.props.handleStudentSubmission(this.state.response, moment().format());
    this.setState({ submitted: true, });
  }

  handleChange(e) {
    this.setState({ editing: true, response: e, });
  }

  // this is the mode where the teacher has chosen to project some of the students'
  // answers, NOT what is being projected on the board.
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
    return <p className="your-answer">{this.state.response}</p>;
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

  modeAppropriateRender() {
    if (this.props.mode === 'PROJECT') {
      return this.renderProject();
    }
    const textBoxDisabled = !!this.state.submitted;
    return (
      <TextEditor
        defaultValue={''}
        value={this.state.response}
        disabled={textBoxDisabled}
        checkAnswer={this.submitSubmission}
        hasError={undefined}
        handleChange={this.handleChange}
        placeholder="Type your answer here."
      />
    );
  }

  renderInstructions() {
    if (this.props.mode !== 'PROJECT') {
      if (this.state.submitted) {
        return (<div className="feedback-row">
          <p><i className="fa fa-check-circle" aria-hidden="true" />Great Work! Please wait as your teacher reviews your answer...</p>
        </div>);
      } else if (this.props.data.play.instructions) {
        return (<div className="feedback-row">
          <img src={icon} />
          <p>{this.props.data.play.instructions}</p>
        </div>);
      }
    }
  }

  renderCues() {
    if (this.props.mode !== 'PROJECT') {
      if (this.props.data.play.cues) {
        return (
          <Cues
            getQuestion={() => ({
              cues: this.props.data.play.cues,
            })
          }
            displayArrowAndText={false}
          />
        );
      }
      return (
        <span />
      );
    }
  }

  renderSubmitButton() {
    if (this.props.mode !== 'PROJECT') {
      return (<div className="question-button-group">
        <button disabled={this.state.submitted} onClick={this.submitSubmission} className="button student-submit">Submit</button>
      </div>);
    }
  }

  render() {
    return (
      <div>
        <RenderSentenceFragments prompt={this.props.data.play.prompt} />
        {this.renderCues()}
        {this.renderInstructions()}
        {this.modeAppropriateRender()}
        {this.renderSubmitButton()}
      </div>
    );
  }

}

export default SingleAnswer;
