import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import _ from 'underscore';
import ReactTransition from 'react-addons-css-transition-group';
import POSMatcher from '../../libs/sentenceFragment.js';
import {
  submitNewResponse,
  incrementChildResponseCount,
  incrementResponseCount
} from '../../actions/responses';
import icon from '../../img/question_icon.svg';

const key = ''; // Enables this component to be used by both play/sentence-fragments and play/diagnostic

const PlaySentenceFragment = React.createClass({
  getInitialState() {
    return {
      response: '',
      checkAnswerEnabled: true,
    };
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
    return this.props.responses.data[this.props.question.key];
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
    // The case for question.needsIdentification===undefined is for sentenceFragments that were created before the needsIdentification field was put in
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
          responses: this.getResponses(),
          questionUID: key,
          wordCountChange,
        };
        const responseMatcher = new POSMatcher(fields);
        const matched = responseMatcher.checkMatch(this.state.response);

        let newResponse;

        if (matched.found) {
          if (matched.posMatch && !matched.exactMatch) {
            newResponse = {
              text: matched.submitted,
              parentID: matched.response.key,
              count: 1,
              feedback: matched.response.optimal ? 'Excellent!' : 'Try writing the sentence in another way.',
              questionUID: key,
            };
            if (matched.response.optimal) {
              newResponse.optimal = matched.response.optimal;
            }
            this.props.dispatch(submitNewResponse(newResponse, newResponse.parentId));
            this.props.dispatch(incrementChildResponseCount(matched.response.key)); // parent has no parentID
          } else {
            this.props.dispatch(incrementResponseCount(key, matched.response.key, matched.response.parentID));
          }
        } else {
          newResponse = {
            text: matched.submitted,
            count: 1,
            questionUID: key,
          };
          this.props.dispatch(submitNewResponse(newResponse));
        }
        this.props.updateAttempts(matched);
        this.props.nextQuestion();
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
            <TextEditor value={fragment.prompt} handleChange={this.handleChange} disabled={this.showNextQuestionButton()} checkAnswer={this.checkAnswer} />
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
    responses: state.responses,
  };
}

export default connect(select)(PlaySentenceFragment);
