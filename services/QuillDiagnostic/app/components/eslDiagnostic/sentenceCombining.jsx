import React from 'react';
import { connect } from 'react-redux';
import icon from `${process.env.QUILL_CDN}/images/icons/question_icon.svg`;
import _ from 'underscore';
import { submitResponse, } from '../../actions/diagnostics.js';
import ReactTransition from 'react-addons-css-transition-group';

import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import RenderQuestionCues from '../renderForQuestions/cues.jsx';
import { SentenceFragments } from 'quill-component-library/dist/componentLibrary';
import RenderFeedback from '../renderForQuestions/feedback';
import getResponse from '../renderForQuestions/checkAnswer';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import submitPathway from '../renderForQuestions/submitPathway.js';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import translations from '../../libs/translations/index.js';
import translationMap from '../../libs/translations/ellQuestionMapper.js';
import Error from '../shared/error.jsx';
import { Feedback } from 'quill-component-library/dist/componentLibrary';

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
      this.getQuestion().key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  },

  getInitialValue() {
    if (this.props.prefill) {
      return this.getQuestion().prefilledText;
    }
  },

  removePrefilledUnderscores() {
    this.setState({ response: this.state.response.replace(/_/g, ''), });
  },

  getQuestion() {
    const { question, } = this.props;
    if (question.key.endsWith('-esp')) {
      question.key = question.key.slice(0, -4);
    }
    return question;
  },

  getInstructionText() {
    const textKey = translationMap[this.getQuestion().key];
    let text = translations.english[textKey];
    if (this.props.language && this.props.language !== 'english') {
      const textClass = this.props.language === 'arabic' ? 'right-to-left' : '';
      text += `<br/><br/><span class="${textClass}">${translations[this.props.language][textKey]}</span>`;
    }
    return (<p dangerouslySetInnerHTML={{ __html: text, }} />);
  },

  getResponses() {
    return this.state.responses;
  },

  getResponse2(rid) {
    return this.getResponses()[rid];
  },

  submitResponse(response) {
    submitQuestionResponse(response, this.props, this.state.sessionKey, submitResponse);
  },

  renderSentenceFragments() {
    return <RenderSentenceFragments prompt={this.getQuestion().prompt} />;
  },

  listCuesAsString(cues) {
    const newCues = cues.slice(0);
    return `${newCues.splice(0, newCues.length - 1).join(', ')} or ${newCues.pop()}.`;
  },

  renderFeedback() {
    return (<RenderFeedback
      question={this.props.question} renderFeedbackStatements={this.renderFeedbackStatements}
      sentence="We have not seen this sentence before. Could you please try writing it in another way?"
      getQuestion={this.getQuestion} listCuesAsString={this.listCuesAsString}
    />);
  },

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  },

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion} />;
  },

  renderCues() {
    return (<RenderQuestionCues
      language={this.props.language}
      getQuestion={this.getQuestion}
      displayArrowAndText
    />);
  },

  updateResponseResource(response) {
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, this.props.dispatch);
  },

  submitPathway(response) {
    submitPathway(response, this.props);
  },

  checkAnswer(e) {
    if (this.state.editing) {
      this.removePrefilledUnderscores();
      const response = getResponse(this.getQuestion(), this.state.response, this.getResponses(), this.props.marking || 'diagnostic');
      this.updateResponseResource(response);
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
    this.setState({ response: '', });
    this.props.nextQuestion();
    this.setState({ response: '', });
  },

  renderNextQuestionButton(correct) {
    if (correct) {
      return (<button className="button is-outlined is-success" onClick={this.nextQuestion}>Siguiente</button>);
    }
    return (<button className="button is-outlined is-warning" onClick={this.nextQuestion}>Siguiente</button>);
  },

  renderMedia() {
    if (this.getQuestion().mediaURL) {
      return (
        <div style={{ marginTop: 15, minWidth: 200, }}>
          <img src={this.getQuestion().mediaURL} />
        </div>
      );
    }
  },

  getSubmitButtonText() {
    let text = translations.english['submit button text'];
    if (this.props.language !== 'english') {
      text += ` / ${translations[this.props.language]['submit button text']}`;
    }
    return text;
  },

  render() {
    let button;
    const fullPageInstructions = this.props.language === 'arabic' ? { maxWidth: 800, width: '100%', } : { display: 'block', };
    if (this.props.question.attempts.length > 0) {
      button = <button className="button student-submit" onClick={this.nextQuestion}>{this.getSubmitButtonText()}</button>;
    } else {
      button = <button className="button student-submit" onClick={this.checkAnswer}>{this.getSubmitButtonText()}</button>;
    }
    if (this.props.question) {
      const instructions = (this.props.question.instructions && this.props.question.instructions !== '') ? this.props.question.instructions : 'Combine the sentences into one sentence. Combinar las frases en una frase.';
      return (
        <div className="student-container-inner-diagnostic">
          <div style={{ display: 'flex', justifyContent: 'spaceBetween', }}>
            <div style={fullPageInstructions}>
              {this.renderSentenceFragments()}
              {this.renderCues()}
              <Feedback
                feedbackType="instructions"
                feedback={this.getInstructionText()}
              />
            </div>
            {this.renderMedia()}
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
    return (<p>Loading / Cargando...</p>);
  },
});

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    routing: state.routing,
  };
}
export default connect(select)(PlayDiagnosticQuestion);
