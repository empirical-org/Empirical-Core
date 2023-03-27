import * as React from 'react';
import ReactTransition from 'react-addons-css-transition-group';
import _ from 'underscore';

import { Feedback, getDisplayedText, getLatestAttempt, renderPreviewFeedback, SentenceFragments } from '../../../Shared/index';
import { submitResponse } from '../../actions/diagnostics.js';
import {
    getGradedResponsesWithCallback
} from '../../actions/responses.js';
import getResponse from '../renderForQuestions/checkAnswer';
import RenderQuestionCues from '../renderForQuestions/cues.tsx';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import { submitQuestionResponse } from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';

const C = require('../../constants').default;

class PlayDiagnosticQuestion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      response: '',
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

  getResponses = () => {
    const { responses, } = this.state
    return responses;
  }

  removePrefilledUnderscores = () => {
    const { response, } = this.state
    this.setState({ response: response.replace(/_/g, ''), });
  }

  getQuestion = () => {
    const { question, } = this.props
    return question;
  }

  getResponse2 = (rid) => {
    const { responses, } = this.props
    return responses[rid];
  }

  submitResponse = (response) => {
    submitQuestionResponse(response, this.props, submitResponse);
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
    const { question } = this.props;
    return (
      <RenderQuestionCues
        displayArrowAndText={true}
        question={question}
      />
    );
  }

  updateResponseResource = (response) => {
    const { dispatch, } = this.props
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, dispatch);
  }

  setResponse = (response) => {
    const { setResponse, } = this.props
    if (!setResponse) { return }

    setResponse(response);
  }

  handleSubmitResponse = (e) => {
    const { editing, responses, response, } = this.state
    const { marking, } = this.props
    if (editing && responses) {
      this.removePrefilledUnderscores();
      const submittedResponse = getResponse(this.getQuestion(), response, this.getResponses(), marking || 'diagnostic');
      this.updateResponseResource(submittedResponse);
      this.setResponse(submittedResponse);
      if (submittedResponse.response && submittedResponse.response.author === 'Missing Details Hint') {
        this.setState({
          editing: false,
          error: 'Your answer is too short. Please read the directions carefully and try again.',
        });
      } else {
        this.submitResponse(submittedResponse);
        this.setState({
          editing: false,
          response: '',
          error: undefined,
        }, this.handleNextClick);
      }
    }
  }

  toggleDisabled = () => {
    const { editing, } = this.state
    return editing ? '' : 'disabled'
  }

  handleChange = (e) => {
    this.setState({ editing: true, response: e, });
  }

  readyForNext = () => {
    const { question, previewMode } = this.props
    if (question.attempts.length > 0) {
      const latestAttempt = getLatestAttempt(question.attempts);
      if (previewMode && latestAttempt) {
        return true;
      } else if (latestAttempt.found) {
        const errors = _.keys(this.getErrorsForAttempt(latestAttempt));
        if (latestAttempt.response.optimal && errors.length === 0) {
          return true;
        }
      }
    }
    return false;
  }

  getProgressPercent = () => {
    const { question, } = this.props
    return question.attempts.length / 3 * 100;
  }

  finish = () => {
    this.setState({ finished: true, });
  }

  handleNextClick = () => {
    const { nextQuestion, previewMode, isLastQuestion } = this.props;
    // we don't submit the last question if in previewMode
    if(previewMode && isLastQuestion) { return }
    nextQuestion();
  }

  renderNextQuestionButton(correct) {
    if (correct) {
      return (<button className="button is-outlined is-success" onClick={this.handleNextClick} type="button">Next</button>);
    }
    return (<button className="button is-outlined is-warning" onClick={this.handleNextClick} type="button">Next</button>);
  }

  renderError = () => {
    const { error, } = this.state;
    if (!error) { return }

    return (
      <div className="error-container">
        <Feedback
          feedback={<p>{error}</p>}
          feedbackType="revise-unmatched"
        />
      </div>
    )
  }

  getButton = () => {
    const { responses } = this.state;
    const { previewMode, question } = this.props;
    const latestAttempt = getLatestAttempt(question.attempts);

    if((previewMode && latestAttempt) || !responses) {
      return <button className="quill-button focus-on-light large primary contained disabled" type="button">Submit</button>;
    }
    return <button className="quill-button focus-on-light large primary contained" onClick={this.handleSubmitResponse} type="button">Submit</button>;
  }

  renderFeedback = () => {
    const { previewMode, question } = this.props;
    const { key } = question;
    const latestAttempt = getLatestAttempt(question.attempts);
    const instructions = (question.instructions && question.instructions !== '') ? question.instructions : 'Combine the sentences into one sentence.';

    if(previewMode && latestAttempt && latestAttempt.response) {
      return renderPreviewFeedback(latestAttempt);
    }
    return(
      <Feedback
        feedback={(<p>{instructions}</p>)}
        feedbackType="default"
        key={key}
      />
    );
  }

  render = () => {
    const { question, previewMode } = this.props
    const { error, response } = this.state
    const button = this.getButton();
    const displayedText = getDisplayedText({ previewMode, question, response });

    if (question) {
      return (
        <div className="student-container-inner-diagnostic">
          {this.renderSentenceFragments()}
          {this.renderCues()}
          <div className="feedback-row">
            {this.renderFeedback()}
          </div>
          <ReactTransition transitionAppear transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500} transitionName='text-editor'>
            <TextEditor
              className='textarea is-question is-disabled'
              disabled={this.readyForNext()}
              getResponse={this.getResponse2}
              hasError={error}
              onChange={this.handleChange}
              onSubmitResponse={this.handleSubmitResponse}
              placeholder="Type your answer here."
              value={displayedText}
            />
            {this.renderError()}
            <div className="question-button-group button-group">
              {button}
            </div>
          </ReactTransition>
        </div>
      );
    }
    return (<p>Loading...</p>);

  }
}

export default PlayDiagnosticQuestion;
