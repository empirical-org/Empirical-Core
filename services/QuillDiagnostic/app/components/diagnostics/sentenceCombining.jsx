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

class PlayDiagnosticQuestion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      return {
        editing: false,
        response: '',
        readyForNext: false,
      };
    }
  }

  componentDidMount() {
    const { question, } = this.props
    getGradedResponsesWithCallback(
      question.key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { question, } = this.props
    const { response, responses, error, } = this.state

    if (question !== nextProps.question) {
      return true;
    } else if (response !== nextState.response) {
      return true;
    } else if (responses !== nextState.responses) {
      return true;
    } else if (error !== nextState.error) {
      return true;
    }
    return false;
  }

  getInitialValue = () => {
    const { prefill, } = this.props
    if (prefill) {
      return this.getQuestion().prefilledText;
    }
  }

  getResponses = () => {
    const { responses, } = this.state
    return responses;
  }

  removePrefilledUnderscores = () => {
    const { response, } = this.state
    this.setState({ response: response.replace(/_/g, ''), });
  }

  getQuestion = () => {
    return this.props.question;
  }

  getResponse2 = (rid) => {
    const { responses, } = this.props
    return responses[rid];
  }

  submitResponse = (response) => {
    const { sessionKey, } = this.state
    submitQuestionResponse(response, this.props, this.state.sessionKey, submitResponse);
  }

  renderSentenceFragments = () => {
    return <SentenceFragments prompt={this.getQuestion().prompt} />;
  }

  listCuesAsString(cues) {
    const newCues = cues.slice(0);
    return `${newCues.splice(0, newCues.length - 1).join(', ')} or ${newCues.pop()}.`;
  }

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  }

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion} />;
  }

  renderCues = () => {
    return (<RenderQuestionCues
      displayArrowAndText={true}
      getQuestion={this.getQuestion}
    />);
  }

  updateResponseResource(response) {
    const { dispatch, } = this.props
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, dispatch);
  }

  submitPathway(response) {
    submitPathway(response, this.props);
  }

  setResponse(response) {
    if (this.props.setResponse) {
      this.props.setResponse(response);
    }
  }

  checkAnswer(e) {
    if (this.state.editing && this.state.responses) {
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
        }
          this.nextQuestion()
        );
      }
    }
  }

  toggleDisabled = () => {
    if (this.state.editing) {
      return '';
    }
    return 'is-disabled';
  }

  handleChange(e) {
    this.setState({ editing: true, response: e, });
  }

  readyForNext = () => {
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
  }

  getProgressPercent = () => {
    return this.props.question.attempts.length / 3 * 100;
  }

  finish = () => {
    this.setState({ finished: true, });
  }

  nextQuestion = () => {
    this.props.nextQuestion();
  }

  renderNextQuestionButton(correct) {
    if (correct) {
      return (<button className="button is-outlined is-success" onClick={this.nextQuestion}>Next</button>);
    }
      return (<button className="button is-outlined is-warning" onClick={this.nextQuestion}>Next</button>);

  }

  render = () => {
    const { question, } = this.props
    const { responses, } = this.state
    const questionID = question.key;
    const button = this.state.responses ? <button className="button student-submit" onClick={this.checkAnswer}>Submit</button> : <button className="button student-submit is-disabled" onClick={() => {}}>Submit</button>;
    if (question) {
      const instructions = (question.instructions && question.instructions !== '') ? question.instructions : 'Combine the sentences into one sentence.';
      return (
        <div className="student-container-inner-diagnostic">
          {this.renderSentenceFragments()}
          {this.renderCues()}
          <div className="feedback-row">
            <Feedback
              feedback={(<p>{instructions}</p>)}
              feedbackType="default"
              key={questionID}
            />
          </div>
          <ReactTransition transitionAppear transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500} transitionName={'text-editor'}>
            <TextEditor
              className={'textarea is-question is-disabled'}
              defaultValue={this.getInitialValue()}
              disabled={this.readyForNext()}
              getResponse={this.getResponse2}
              hasError={this.state.error}
              onChange={this.handleChange}
              onSubmitResponse={this.checkAnswer}
              placeholder="Type your answer here."
              value={this.state.response}
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

  }
}

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

export default PlayDiagnosticQuestion;
