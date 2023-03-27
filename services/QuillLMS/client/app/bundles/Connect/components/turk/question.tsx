import * as React from 'react';
import ReactTransition from 'react-addons-css-transition-group';
import _ from 'underscore';
import { Feedback, SentenceFragments } from '../../../Shared/index';
import {
  getGradedResponsesWithCallback
} from '../../actions/responses.js';
import getResponse from '../renderForQuestions/checkAnswer';
import Cues from '../renderForQuestions/cues.jsx';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';

const C = require('../../constants').default;

class PlayDiagnosticQuestion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      response: '',
      readyForNext: false,
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

  shouldComponentUpdate(nextProps: any, nextState: any) {
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
    this.setState(prevState => ({ response: prevState.response.replace(/_/g, ''), }));
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
    const { submitResponse, } = this.props

    submitResponse(response)
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
    const { question, } = this.props
    return (
      <Cues
        displayArrowAndText={true}
        question={question}
      />
    );
  }

  updateResponseResource = (response) => {
    const { dispatch, } = this.props

    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, dispatch);
  }

  setResponse(response) {
    const { setResponse, } = this.props

    if (setResponse) {
      setResponse(response);
    }
  }

  handleResponseSubmission = (e) => {
    const { editing, response, } = this.state
    const { marking, } = this.props
    if (editing) {
      this.removePrefilledUnderscores();
      const markedResponse = getResponse(this.getQuestion(), response, this.getResponses(), marking || 'diagnostic');
      this.updateResponseResource(markedResponse);
      this.setResponse(markedResponse);
      if (markedResponse.response && markedResponse.response.author === 'Missing Details Hint') {
        this.setState({
          editing: false,
          error: 'Your answer is too short. Please read the directions carefully and try again.',
        });
      } else {
        this.submitResponse(markedResponse);
        this.setState({
          editing: false,
          response: '',
          error: undefined,
        }, this.handleNextClick
        );
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
    const { question, } = this.props
    if (question.attempts.length > 0) {
      const latestAttempt = getLatestAttempt(question.attempts);
      if (latestAttempt && latestAttempt.found) {
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
    const { nextQuestion, } = this.props
    nextQuestion();
  }

  renderError = () => {
    const { error, } = this.state
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

  render() {
    const { question, } = this.props
    const { responses, error, response } = this.state
    const questionID = question.key;
    const button = responses ? <button className="quill-button focus-on-light large primary contained" onClick={this.handleResponseSubmission} type="button">Submit</button> : <button className="quill-button focus-on-light large primary contained disabled" type="button">Submit</button>;
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
          <ReactTransition transitionAppear transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500} transitionName='text-editor'>
            <TextEditor
              className='textarea is-question is-disabled'
              disabled={this.readyForNext()}
              getResponse={this.getResponse2}
              hasError={error}
              onChange={this.handleChange}
              onSubmitResponse={this.handleResponseSubmission}
              placeholder="Type your answer here."
              value={response}
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

const getLatestAttempt = function (attempts = []): { found: any, response: any } {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

export default PlayDiagnosticQuestion;
