import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import _ from 'underscore';
import ReactTransition from 'react-addons-css-transition-group';
import POSMatcher from '../../libs/sentenceFragment.js';
import fragmentActions from '../../actions/sentenceFragments.js';
import icon from '../../img/question_icon.svg';
import { hashToCollection } from '../../libs/hashToCollection.js';
import {
  getGradedResponsesWithCallback,
  incrementResponseCount
} from '../../actions/responses.js';
import { submitResponse } from '../../actions/diagnostics.js';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';


const PlaySentenceFragment = React.createClass({
  getInitialState() {
    return {
      response: this.props.question.prompt,
      checkAnswerEnabled: true,
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

  submitResponse(response) {
    submitQuestionResponse(response, this.props, this.state.sessionKey, submitResponse);
  },

  updateResponseResource(response) {
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, this.props.dispatch);
  },

  showNextQuestionButton() {
    const { question, } = this.props;
    const attempted = question.attempts.length > 0;
    if (attempted) {
      return true;
    } else {
      return false;
    }
  },

  getQuestion() {
    return this.props.question;
  },

  getResponses() {
    if (this.props.responses && this.props.responses.data) {
      return this.props.responses.data[this.props.question.key];
    } else {
      return this.state.responses;
    }

  },

  checkChoice(choice) {
    const questionType = this.props.question.isFragment ? 'Fragment' : 'Sentence';
    this.props.markIdentify(choice === questionType);
  },

  getSentenceOrFragmentButtons() {
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
    if (this.state.checkAnswerEnabled) {
      const key = this.props.currentKey;
      this.setState({ checkAnswerEnabled: false, }, () => {
        const fragment = this.props.sentenceFragments.data[key];
        const { prompt, wordCountChange, } = this.getQuestion();
        const fields = {
          prompt,
          responses: hashToCollection(this.getResponses()),
          questionUID: key,
          wordCountChange,
        };
        const responseMatcher = new POSMatcher(fields);
        const matched = responseMatcher.checkMatch(this.state.response);
        this.updateResponseResource(matched);
        this.submitResponse(matched);
      });
    }
  },

  renderSentenceOrFragmentMode() {
    if (this.choosingSentenceOrFragment()) {
      return (
        <div className="container">
          <ReactTransition transitionName={'sentence-fragment-buttons'} transitionLeave transitionLeaveTimeout={2000}>
            <div className="feedback-row">
              <img className="info" src={icon} />
              <p>Is this a complete or an incomplete sentence?</p>
            </div>
            {this.getSentenceOrFragmentButtons()}
          </ReactTransition>
        </div>
      );
    } else {
      return (<div />);
    }
  },

  renderPlaySentenceFragmentMode(fragment) {
    const button = <button className="button student-submit" onClick={this.checkAnswer}>Submit</button>;

    if (!this.choosingSentenceOrFragment()) {
      let instructions;
      if (this.props.question.instructions && this.props.question.instructions !== '') {
        instructions = this.props.question.instructions;
      } else {
        instructions = 'If it is a complete sentence, press submit. If it is an incomplete sentence, make it complete.';
      }

      return (
        <div className="container">
          <ReactTransition
            transitionName={'text-editor'} transitionAppear transitionAppearTimeout={1200}
            transitionLeaveTimeout={300}
          >
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
              {button}
            </div>
          </ReactTransition>
        </div>
      );
    }
  },

  render() {
    if (this.props.sentenceFragments.hasreceiveddata) {
      const fragment = this.props.question;
      return (
        <div className="student-container-inner-diagnostic">
          <div className="draft-js sentence-fragments prevent-selection">
            <p>{this.getQuestion().prompt}</p>
          </div>

          {this.renderSentenceOrFragmentMode()}
          {this.renderPlaySentenceFragmentMode(fragment)}
        </div>
      );
    } else {
      return (<div className="container">Loading...</div>);
    }
  },
});

function select(state) {
  return {
    routing: state.routing,
    sentenceFragments: state.sentenceFragments,
  };
}

export default connect(select)(PlaySentenceFragment);
