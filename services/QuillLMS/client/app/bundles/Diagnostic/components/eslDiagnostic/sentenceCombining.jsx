import * as React from 'react';
import ReactTransition from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import _ from 'underscore';

import { Feedback, getDisplayedText, getLatestAttempt, renderPreviewFeedback, SentenceFragments } from '../../../Shared/index';
import { submitResponse } from '../../actions/diagnostics.js';
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import { ENGLISH, rightToLeftLanguages } from '../../modules/translation/languagePageInfo';
import getResponse from '../renderForQuestions/checkAnswer';
import RenderQuestionCues from '../renderForQuestions/cues.tsx';
import RenderFeedback from '../renderForQuestions/feedback';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import { submitQuestionResponse } from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';

const C = require('../../constants').default;

class ELLSentenceCombining extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      response: '',
      readyForNext: false,
    }
  }

  componentDidMount = () => {
    getGradedResponsesWithCallback(
      this.getQuestion().key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  }

  removePrefilledUnderscores = () => {
    this.setState(prevState => ({ value: prevState.response.replace(/_/g, '') }))
  }

  getQuestion = () => {
    const { question, } = this.props;
    if (question.key.endsWith('-esp')) {
      question.key = question.key.slice(0, -4);
    }
    return question;
  }

  getInstructionText = () => {
    const { language, translate } = this.props;
    const question = this.getQuestion();
    const instructions = (question.instructions && question.instructions !== '') ? question.instructions : 'Combine the sentences into one sentence.';
    if(!language || language === ENGLISH) {
      return <p dangerouslySetInnerHTML={{ __html: instructions, }} />;
    }
    const textClass = rightToLeftLanguages.includes(language) ? 'right-to-left' : '';
    const text = `instructions^${instructions}`;
    const translationPresent = language !== ENGLISH;
    return(
      <div>
        <p>{instructions}</p>
        {translationPresent && <br />}
        {translationPresent && <p className={textClass}>{translate(text)}</p>}
      </div>
    );
  }

  getResponses = () => {
    const { responses, } = this.state
    return responses;
  }

  getResponse2(rid) {
    return this.getResponses()[rid];
  }

  submitResponse = (response) => {
    const { sessionKey, } = this.state
    submitQuestionResponse(response, this.props, submitResponse);
  }

  renderSentenceFragments = () => {
    return <SentenceFragments prompt={this.getQuestion().prompt} />;
  }

  listCuesAsString(cues) {
    const newCues = cues.slice(0);
    return `${newCues.splice(0, newCues.length - 1).join(', ')} or ${newCues.pop()}.`;
  }

  renderFeedback = () => {
    const { question, } = this.props
    return (
      <RenderFeedback
        getQuestion={this.getQuestion}
        listCuesAsString={this.listCuesAsString}
        question={question}
        renderFeedbackStatements={this.renderFeedbackStatements}
        sentence="We have not seen this sentence before. Could you please try writing it in another way?"
      />
    );
  }

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  }

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion} />;
  }

  renderCues = () => {
    const { diagnosticID, language, translate } = this.props
    const question = this.getQuestion();
    return (
      <RenderQuestionCues
        diagnosticID={diagnosticID}
        displayArrowAndText
        language={language}
        question={question}
        translate={translate}
      />
    );
  }

  updateResponseResource = (response) => {
    const { dispatch, } = this.props

    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, dispatch);
  }

  handleSubmitResponse = (e) => {
    const { editing, responses, response, } = this.state
    const { marking, diagnosticID } = this.props

    if (editing && responses) {
      this.removePrefilledUnderscores();
      const submittedResponse = getResponse(this.getQuestion(), response, this.getResponses(), marking || 'diagnostic');
      this.updateResponseResource(submittedResponse);
      if (submittedResponse.response && submittedResponse.response.author === 'Missing Details Hint' && diagnosticID !== 'ell') {
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
        }, this.handleNextQuestionClick);
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

  handleNextQuestionClick = () => {
    const { nextQuestion, previewMode, isLastQuestion } = this.props
    this.setState({ response: '', });
    // we don't submit the last question if in previewMode
    if(previewMode && isLastQuestion) { return }
    nextQuestion();
    this.setState({ response: '', });
  }

  renderNextQuestionButton(correct) {
    if (correct) {
      return (<button className="button is-outlined is-success" onClick={this.handleNextQuestionClick} type="button">Siguiente</button>);
    }
    return (<button className="button is-outlined is-warning" onClick={this.handleNextQuestionClick} type="button">Siguiente</button>);
  }

  renderMedia = () => {
    if (this.getQuestion().mediaURL) {
      return (
        <div style={{ marginTop: 15, minWidth: 200, }}>
          <img alt={this.getQuestion().mediaAlt} src={this.getQuestion().mediaURL} />
        </div>
      );
    }
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

  renderButton = () => {
    const { responses } = this.state;
    const { previewMode, language, question, translate } = this.props;
    const latestAttempt = getLatestAttempt(question.attempts);
    const buttonText = language ? translate('buttons^submit') : 'Submit';

    if((previewMode && latestAttempt) || !responses) {
      return <button className="quill-button focus-on-light large primary contained disabled" type="button">Submit</button>;
    }
    if (question.attempts && question.attempts.length > 0) {
      return <button className="quill-button focus-on-light large primary contained" onClick={this.handleNextQuestionClick} type="button">{buttonText}</button>;
    } else {
      return <button className="quill-button focus-on-light large primary contained" onClick={this.handleSubmitResponse} type="button">{buttonText}</button>;
    }
  }

  renderFeedback = () => {
    const { previewMode, question } = this.props;
    const { key } = question;
    const latestAttempt = getLatestAttempt(question.attempts);
    const instructions = this.getInstructionText();
    if(previewMode && latestAttempt && latestAttempt.response) {
      return renderPreviewFeedback(latestAttempt);
    }
    return(
      <Feedback
        feedback={instructions}
        feedbackType="default"
        key={key}
      />
    );
  }

  render = () => {
    const { question, previewMode } = this.props
    const { error, response } = this.state
    const fullPageInstructions = { maxWidth: 800, width: '100%', }
    const displayedText = getDisplayedText({ previewMode, question, response });

    if (question) {
      return (
        <div className="student-container-inner-diagnostic">
          <div style={{ display: 'flex', justifyContent: 'spaceBetween', }}>
            <div style={fullPageInstructions}>
              {this.renderSentenceFragments()}
              {this.renderCues()}
              {this.renderFeedback()}
            </div>
            {this.renderMedia()}
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
              {this.renderButton()}
            </div>
          </ReactTransition>
        </div>
      );
    }
    return (<p>Loading...</p>);
  }
}

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    routing: state.routing,
  };
}

export default connect(select)(ELLSentenceCombining);
