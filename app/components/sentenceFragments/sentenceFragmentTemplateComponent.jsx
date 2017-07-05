import React from 'react';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import _ from 'underscore';
import ReactTransition from 'react-addons-css-transition-group';
import POSMatcher from '../../libs/sentenceFragment.js';
import { hashToCollection } from '../../libs/hashToCollection.js';
import {
  submitResponse,
  incrementResponseCount,
  getResponsesWithCallback,
  getGradedResponsesWithCallback
} from '../../actions/responses';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import icon from '../../img/question_icon.svg';

const PlaySentenceFragment = React.createClass({
  getInitialState() {
    return {
      response: this.props.question.prompt,
      checkAnswerEnabled: true,
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
    }
    return false;
  },

  showNextQuestionButton() {
    const { question, } = this.props;
    const latestAttempt = this.getLatestAttempt();
    const readyForNext =
      question.attempts.length > 2 ||
      (
        latestAttempt && (
          latestAttempt.response.optimal ||
          latestAttempt.found === false
        )
      );
    if (readyForNext) {
      return true;
    } else {
      return false;
    }
  },

  getLatestAttempt() {
    return _.last(this.props.question.attempts || []);
  },

  getQuestion() {
    return this.props.question;
  },

  getResponses() {
    return this.state.responses;
    // return this.props.responses.data[this.props.question.key];
  },

  checkChoice(choice) {
    const questionType = this.props.question.isFragment ? 'Fragment' : 'Sentence';
    this.props.markIdentify(choice === questionType);
  },

  renderSentenceOrFragmentButtons() {
    return (
      <div className="sf-button-group">
        <button className="button sf-button" value="Sentence" onClick={() => { this.checkChoice('Sentence'); }}>Complete Sentence</button>
        <button className="button sf-button" value="Fragment" onClick={() => { this.checkChoice('Fragment'); }}>Incomplete Sentence</button>
      </div>
    );
  },

  choosingSentenceOrFragment() {
    const { question, } = this.props;
    return question.identified === undefined && (question.needsIdentification === undefined || question.needsIdentification === true);
    // the case for question.needsIdentification===undefined is for sentenceFragments that were created before the needsIdentification field was put in
  },

  handleChange(e) {
    this.setState({ response: e, });
  },

  checkAnswer() {
    if (this.state.checkAnswerEnabled && this.state.responses) {
      const key = this.props.currentKey;
      const { attempts, } = this.props.question;
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
        const matched = responseMatcher.checkMatch(this.state.response);
        updateResponseResource(matched, key, attempts, this.props.dispatch, );
        this.props.updateAttempts(matched);
        this.setState({ checkAnswerEnabled: true, });
        this.props.handleAttemptSubmission();
      });
    }
  },

  renderSentenceOrFragmentMode() {
    return (
      <div className="container">
        <div className="feedback-row">
          <img className="info" src={icon} />
          <p>Is this a complete or an incomplete sentence?</p>
        </div>
        {this.renderSentenceOrFragmentButtons()}
      </div>
    );
  },

  renderButton() {
    if (this.showNextQuestionButton()) {
      return (
        <button className="button student-submit" onClick={this.props.nextQuestion}>Next</button>
      );
    } else if (this.state.responses) {
      return <button className="button student-submit" onClick={this.checkAnswer}>Submit</button>;
    } else {
      <button className="button student-submit is-disabled" onClick={() => {}}>Submit</button>;
    }
  },

  renderPlaySentenceFragmentMode() {
    const fragment = this.props.question;
    const button = this.renderButton();
    let instructions;
    const latestAttempt = this.getLatestAttempt();
    if (latestAttempt) {
      instructions = latestAttempt.response.feedback ||
      'Good work. A complete sentence always has a person or thing completing an action.';
    } else if (fragment.instructions && fragment.instructions !== '') {
      instructions = this.props.question.instructions;
    } else {
      instructions = 'If it is a complete sentence, press submit. If it is an incomplete sentence, make it complete.';
    }
    // dangerously set some html in here
    return (
      <div className="container">
        <div className="feedback-row">
          <img className="info" src={icon} />
          <p>{instructions}</p>
        </div>
        <TextEditor
          value={this.state.response}
          handleChange={this.handleChange}
          disabled={this.showNextQuestionButton()}
          checkAnswer={this.checkAnswer}
          placeholder="Type your answer here. Remember, your answer should be just one sentence."
        />
        <div className="question-button-group">
          {this.renderButton()}
        </div>
      </div>
    );
  },

  renderInteractiveComponent() {
    if (this.choosingSentenceOrFragment()) {
      return this.renderSentenceOrFragmentMode();
    } else {
      return this.renderPlaySentenceFragmentMode();
    }
  },

  render() {
    if (this.props.question) {
      return (
        <div className="student-container-inner-diagnostic">
          <div className="draft-js sentence-fragments prevent-selection">
            <p>{this.getQuestion().prompt}</p>
          </div>
          {this.renderInteractiveComponent()}
        </div>
      );
    } else {
      return (<div className="container">Loading...</div>);
    }
  },
});

export default PlaySentenceFragment;
