import React from 'react';
import _ from 'underscore';
import { submitResponse, clearResponses } from '../../actions/diagnostics.js';
import ReactTransition from 'react-addons-css-transition-group';
import {
  getGradedResponsesWithCallback
} from '../../actions/responses.js';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import RenderQuestionCues from '../renderForQuestions/cues.jsx';
import { Feedback, SentenceFragments } from 'quill-component-library/dist/componentLibrary';
import getResponse from '../renderForQuestions/checkAnswer';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import submitPathway from '../renderForQuestions/submitPathway.js';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import { Error } from 'quill-component-library/dist/componentLibrary';

const C = require('../../constants').default;

const PlayDiagnosticQuestion = React.createClass({
  getInitialState() {
    return {
      editing: false,
      response: '',
      readyForNext: false,
    };
  },

  componentDidMount() {
    getGradedResponsesWithCallback(
      this.props.question.key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.question !== nextProps.question) {
      return true;
    } else if (this.state.response !== nextState.response) {
      return true;
    } else if (this.state.responses !== nextState.responses) {
      return true;
    } else if (this.state.error !== nextState.error) {
      return true;
    }
    return false;
  },

  getInitialValue() {
    if (this.props.prefill) {
      return this.getQuestion().prefilledText;
    }
  },

  getResponses() {
    return this.state.responses;
    // return this.props.responses.data[this.props.question.key];
  },

  removePrefilledUnderscores() {
    this.setState({ response: this.state.response.replace(/_/g, ''), });
  },

  getQuestion() {
    return this.props.question;
  },

  getResponse2(rid) {
    return this.props.responses[rid];
  },

  submitResponse(response) {
    submitQuestionResponse(response, this.props, this.state.sessionKey, submitResponse);
  },

  renderSentenceFragments() {
    return <SentenceFragments prompt={this.getQuestion().prompt} />;
  },

  listCuesAsString(cues) {
    const newCues = cues.slice(0);
    return `${newCues.splice(0, newCues.length - 1).join(', ')} or ${newCues.pop()}.`;
  },

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  },

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion} />;
  },

  renderCues() {
    return (<RenderQuestionCues
      getQuestion={this.getQuestion}
      displayArrowAndText={true}
    />);
  },

  updateResponseResource(response) {
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, this.props.dispatch);
  },

  submitPathway(response) {
    submitPathway(response, this.props);
  },

  setResponse(response) {
    if (this.props.setResponse) {
      this.props.setResponse(response);
    }
  },

  checkAnswer(e) {
    if (this.state.editing) {
      this.removePrefilledUnderscores();
      const response = getResponse(this.getQuestion(), this.state.response, this.getResponses(), this.props.marking || 'diagnostic');
      this.updateResponseResource(response);
      this.setResponse(response);
      if (response.response && response.response.author === 'Missing Details Hint') {
        this.setState({
          editing: false,
          error: 'Your answer is too short. Please read the directions carefully and try again.',
        });
      } else {
        this.submitResponse(response);
        this.setState({
          editing: false,
          response: '',
          error: undefined,
        },
          this.nextQuestion()
        );
      }
    }
  },

  toggleDisabled() {
    if (this.state.editing) {
      return '';
    }
    return 'is-disabled';
  },

  handleChange(e) {
    this.setState({ editing: true, response: e, });
  },

  readyForNext() {
    if (this.props.question.attempts.length > 0) {
      const latestAttempt = getLatestAttempt(this.props.question.attempts);
      if (latestAttempt.found) {
        const errors = _.keys(this.getErrorsForAttempt(latestAttempt));
        if (latestAttempt.response.optimal && errors.length === 0) {
          return true;
        }
      }
    }
    return false;
  },

  getProgressPercent() {
    return this.props.question.attempts.length / 3 * 100;
  },

  finish() {
    this.setState({ finished: true, });
  },

  nextQuestion() {
    this.props.nextQuestion();
  },

  renderNextQuestionButton(correct) {
    if (correct) {
      return (<button className="button is-outlined is-success" onClick={this.nextQuestion}>Next</button>);
    }
      return (<button className="button is-outlined is-warning" onClick={this.nextQuestion}>Next</button>);

  },

  render() {
    const questionID = this.props.question.key;
    const button = this.state.responses ? <button className="button student-submit" onClick={this.checkAnswer}>Submit</button> : <button className="button student-submit is-disabled" onClick={() => {}}>Submit</button>;
    if (this.props.question) {
      const instructions = (this.props.question.instructions && this.props.question.instructions !== '') ? this.props.question.instructions : 'Combine the sentences into one sentence.';
      return (
        <div className="student-container-inner-diagnostic">
          {this.renderSentenceFragments()}
          {this.renderCues()}
          <div className="feedback-row">
          <Feedback
            key={questionID}
            feedbackType="default"
            feedback={(<p>{instructions}</p>)}
          />
          </div>
          <ReactTransition transitionName={'text-editor'} transitionAppear transitionLeaveTimeout={500} transitionAppearTimeout={500} transitionEnterTimeout={500}>
            <TextEditor
              className={'textarea is-question is-disabled'} defaultValue={this.getInitialValue()}
              handleChange={this.handleChange} value={this.state.response} getResponse={this.getResponse2}
              disabled={this.readyForNext()} checkAnswer={this.checkAnswer}
              hasError={this.state.error}
              placeholder="Type your answer here. Remember, your answer should be just one sentence."
            />
            <div className="button-and-error-row">
              <Error error={this.state.error} />
              <div className="question-button-group button-group">
                {button}
              </div>
            </div>
          </ReactTransition>
        </div>
      );
    }
      return (<p>Loading...</p>);

  },
});

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

export default PlayDiagnosticQuestion;
