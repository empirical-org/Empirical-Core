declare function require(name:string);
import React, { Component } from 'react';
import Cues from 'components/renderForQuestions/cues';
import RenderSentenceFragments from 'components/renderForQuestions/sentenceFragments';
import FeedbackRow from './feedbackRow'
import TextEditor from '../../renderForQuestions/renderTextEditor';
import { getParameterByName } from 'libs/getParameterByName';
const moment = require('moment');
import {
  QuestionSubmissionsList,
  SelectedSubmissionsForQuestion,
} from '../interfaces';
import { QuestionData } from '../../../interfaces/classroomLessons'
const icon = require('../../../img/question_icon.svg');

interface SingleAnswerProps {
  data: QuestionData,
  handleStudentSubmission: Function,
  mode: string|null,
  submissions: QuestionSubmissionsList|null,
  selected_submissions: SelectedSubmissionsForQuestion|null,
  selected_submission_order: Array<string>|null,
  projector: boolean|null
}

interface SingleAnswerState {
  response: string,
  editing: boolean,
  submitted: boolean,
}

class SingleAnswer extends Component<SingleAnswerProps, SingleAnswerState> {
  constructor(props) {
    super(props);
    this.state = {
      response: props.data.play.prefilledText || '',
      editing: false,
      submitted: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitSubmission = this.submitSubmission.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const student = getParameterByName('student');
    if (student && nextProps.submissions && nextProps.submissions[student] && !this.state.submitted) {
      this.setState({ submitted: true })
      this.setState({ response: nextProps.submissions[student].data })
    }
    // this will reset the state when a teacher resets a question
    if (this.state.submitted === true && nextProps.submissions === null) {
      this.setState({ submitted: false, editing: false, response: '', });
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
    const classAnswers = this.props.selected_submission_order
    ? (<div>
      <p className="answer-header"><i className="fa fa-users" />Class Answers:</p>
      {this.renderClassAnswersList()}
    </div>)
    : <span />;
    return (
      <div className="display-mode">
        {this.renderYourAnswer()}
        {classAnswers}
      </div>
    );
  }

  renderYourAnswer() {
    if (!this.props.projector) {
      return <div>
        <p className="answer-header"><i className="fa fa-user" />Your Answer:</p>
        <p className="your-answer">{this.state.response}</p>;
      </div>
    }
  }

  renderClassAnswersList() {
    const { selected_submissions, submissions, selected_submission_order} = this.props;
    const selected = selected_submission_order ? selected_submission_order.map((key, index) => {
      const text = submissions && submissions[key] ? submissions[key].data : "";
      return (
        <li key={index}>
          <span className="answer-number">{index + 1}</span>{text}
        </li>
      );
    }) : null;
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
        return (<FeedbackRow/>);
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
