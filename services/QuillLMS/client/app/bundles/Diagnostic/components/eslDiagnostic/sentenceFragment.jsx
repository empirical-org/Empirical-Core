import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import _ from 'underscore';
import ReactTransition from 'react-addons-css-transition-group';
import POSMatcher from '../../libs/sentenceFragment.js';
import {
  getGradedResponsesWithCallback
} from '../../actions/responses.js';
const icon = `${process.env.CDN_URL}/images/icons/direction.svg`
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import {
  Feedback
} from 'quill-component-library/dist/componentLibrary';
import translations from '../../libs/translations/index.js';
import translationMap from '../../libs/translations/ellQuestionMapper.js';
import { ENGLISH, rightToLeftLanguages } from '../../modules/translation/languagePageInfo';
import { hashToCollection } from '../../../Shared/index'

const key = ''; // enables this component to be used by both play/sentence-fragments and play/diagnostic

class PlaySentenceFragment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      response: props.question.prompt,
      checkAnswerEnabled: true,
      submitted: false,
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

  getInstructionText = () => {
    const { language, } = this.props
    const textKey = translationMap[this.getQuestion().key];
    let text = translations.english[textKey];
    if (language && language !== ENGLISH) {
      const textClass = rightToLeftLanguages.includes(language) ? 'right-to-left' : '';
      text += `<br/><br/><span class="${textClass}">${translations[language][textKey]}</span>`;
    }
    return (<p dangerouslySetInnerHTML={{ __html: text, }} />);
  }

  getChoiceHTML = () => {
    const { language, } = this.props
    let text = translations.english['sentence-fragment-complete-vs-incomplete-button-choice-instructions'];
    if (language !== ENGLISH) {
      text += `<br/><br/>${translations[language]['sentence-fragment-complete-vs-incomplete-button-choice-instructions']}`;
    }
    return text;
  }

  choosingSentenceOrFragment = () => {
    const { question, } = this.props;
    return question.identified === undefined && (question.needsIdentification === undefined || question.needsIdentification === true);
    // the case for question.needsIdentification===undefined is for sentenceFragments that were created before the needsIdentification field was put in
  }

  showNextQuestionButton = () => {
    const { question, } = this.props;
    const attempted = question.attempts.length > 0;
    if (attempted) {
      return true;
    }
    return false;
  }

  getQuestion = () => {
    const { question, } = this.props;
    if (question.key.endsWith('-esp')) {
      question.key = question.key.slice(0, -4);
    }
    return question;
  }

  getResponses = () => {
    const { responses, } = this.state
    return responses;
  }

  handleClickCompleteSentence = () => this.checkChoice('Sentence')

  handleClickIncompleteSentence = () => this.checkChoice('Fragment')

  checkChoice = (choice) => {
    const { question, markIdentify, } = this.props
    const questionType = question.isFragment ? 'Fragment' : 'Sentence';
    markIdentify(choice === questionType);
  }

  getSentenceOrFragmentButtons = () => {
    // HARDCODED
    return (
      <div className="sf-button-group">
        <button className="button sf-button focus-on-light" onClick={this.handleClickCompleteSentence} type="button" value="Sentence">Complete / Completa la oración</button>
        <button className="button sf-button focus-on-light" onClick={this.handleClickIncompleteSentence} type="button" value="Fragment">Incomplete / Oración incompleta</button>
      </div>
    );
  }

  handleChange = (e) => {
    this.setState({ response: e, });
  }

  handleAttemptSubmission = () => {
    const { submitted, } = this.state
    const { nextQuestion, } = this.props
    if (submitted === false) {
      this.setState(
        { submitted: true, },
        nextQuestion()
      );
    }
  }

  handleResponseSubmission = () => {
    const { responses, checkAnswerEnabled, response, } = this.state
    const { question, dispatch, updateAttempts, } = this.props
    if (checkAnswerEnabled && responses) {
      const key = this.getQuestion().key;
      const { attempts, } = question;
      this.setState({ checkAnswerEnabled: false, }, () => {
        const { prompt, wordCountChange, ignoreCaseAndPunc, } = this.getQuestion();
        const fields = {
          prompt,
          responses: hashToCollection(this.getResponses()),
          questionUID: key,
          wordCountChange,
          ignoreCaseAndPunc,
        };
        const responseMatcher = new POSMatcher(fields);
        const matched = responseMatcher.checkMatch(response);
        updateResponseResource(matched, key, attempts, dispatch,);
        updateAttempts(matched);
        this.setState({ checkAnswerEnabled: true, });
        this.handleAttemptSubmission();
      });
    }
  }

  renderSentenceOrFragmentMode = () => {
    // HARDCODED
    if (this.choosingSentenceOrFragment()) {
      return (
        <div className="container">
          <ReactTransition transitionLeave transitionLeaveTimeout={2000} transitionName='sentence-fragment-buttons'>
            <div className="feedback-row">
              <img alt="Directions Icon" className="info" src={icon} style={{ marginTop: 3, alignSelf: 'flex-start', }} />
              <p dangerouslySetInnerHTML={{ __html: this.getChoiceHTML(), }} />
            </div>
            {this.getSentenceOrFragmentButtons()}
          </ReactTransition>
        </div>
      );
    }
    return (<div />);
  }

  getSubmitButtonText = () => {
    const { language, } = this.props
    let text = translations.english['submit button text'];
    if (language && language !== ENGLISH) {
      text += ` / ${translations[language]['submit button text']}`;
    }
    return text;
  }

  renderPlaySentenceFragmentMode(fragment) {
    const { responses, response, } = this.state
    // HARDCODED
    let button
    if (responses) {
      button = <button className="quill-button focus-on-light large primary contained" onClick={this.handleResponseSubmission} type="button">{this.getSubmitButtonText()}</button>;
    } else {
      button = <button className="quill-button focus-on-light large primary contained disabled" type="button">{this.getSubmitButtonText()}</button>;
    }

    if (!this.choosingSentenceOrFragment()) {
      const component = (
        <Feedback
          feedback={this.getInstructionText()}
          feedbackType="instructions"
        />
      );

      return (
        <div className="container">
          <ReactTransition
            transitionAppear
            transitionAppearTimeout={1200}
            transitionLeaveTimeout={300}
            transitionName='text-editor'
          >
            {component}
            <TextEditor
              disabled={this.showNextQuestionButton()}
              onChange={this.handleChange}
              onSubmitResponse={this.handleResponseSubmission}
              placeholder="Type your answer here."
              value={response}
            />
            <div className="question-button-group">
              {button}
            </div>
          </ReactTransition>
        </div>
      );
    }
  }

  render() {
    const fragment = this.getQuestion();
    return (
      <div className="student-container-inner-diagnostic">
        <div className="draft-js sentence-fragments prevent-selection">
          <p>{this.getQuestion().prompt}</p>
        </div>

        {this.renderSentenceOrFragmentMode()}
        {this.renderPlaySentenceFragmentMode(fragment)}
      </div>
    );
  }
}

function select(state) {
  return {
    routing: state.routing,
  };
}

export default connect(select)(PlaySentenceFragment);
