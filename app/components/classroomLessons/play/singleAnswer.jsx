import React, { Component } from 'react';
import Cues from '../../renderForQuestions/cues.jsx';
import RenderSentenceFragments from '../../renderForQuestions/sentenceFragments.jsx';
import icon from '../../../img/question_icon.svg';
import TextEditor from '../../renderForQuestions/renderTextEditor.jsx';
const moment = require('moment');

class SingleAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      editing: false,
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitSubmission = this.submitSubmission.bind(this);
  }

  submitSubmission() {
    this.props.handleStudentSubmission(this.state.response, moment().format());
    this.setState({submitted: true})
  }

  handleChange(e) {
    this.setState({ editing: true, response: e, });
  }

  // this is the mode where the teacher has chosen to project some of the students'
  // answers, NOT what is being projected on the board.
  renderProject() {
    return (
      <div className="display-mode">
        <p className="answer-header"><i className="fa fa-user"></i>Your Answer:</p>
        {this.renderYourAnswer()}
        <p className="answer-header"><i className="fa fa-users"></i>Class Answers:</p>
        {this.renderClassAnswersList()}
      </div>
    )
  }

  renderYourAnswer() {
    return <p className="your-answer">{this.state.response}</p>
  }

  renderClassAnswersList() {
    // this will not work yet because selected_submissions is not a thing
    const { selected_submissions, submissions, } = this.props;
    const selected = Object.keys(selected_submissions).map((key, index) => (
      <li>
        <span>{index + 1}</span>{submissions[key]}
      </li>
    ));
    return (
      <ul className="class-answer-list">
        {selected}
      </ul>
    );
  }

  modeAppropriateRender() {
    if (this.props.mode === 'PROJECT') {
      return this.renderProject();
    } else {
      const textBoxDisabled = this.state.submitted ? true : false;
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
  }

  renderInstructions() {
    if (this.props.mode !== 'PROJECT') {
      if (this.state.submitted) {
        return <div className="feedback-row">
          <p><i className="fa fa-check-circle" aria-hidden="true"></i>Great Work! Please wait as your teacher reviews your answer...</p>
        </div>
      } else if (this.props.data.play.instructions) {
        return <div className="feedback-row">
          <img src={icon} />
          <p>{this.props.data.play.instructions}</p>
        </div>
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
      )
    } else {
      return (
        <span></span>
      )
    }
    }
  }

  renderSubmitButton() {
    if (this.props.mode !== 'PROJECT') {
      return <div className="question-button-group">
        <button disabled={this.state.submitted} onClick={this.submitSubmission} className="button student-submit">Submit</button>
      </div>
    }
  }

  render() {
    console.log(this.props.data);
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
