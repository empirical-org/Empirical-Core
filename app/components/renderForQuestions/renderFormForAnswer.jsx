import React from 'react';
import { Link } from 'react-router';
import handleFocus from './handleFocus.js';
import TextEditor from './renderTextEditor.jsx';
import Modal from '../modal/modal.jsx';
import _ from 'underscore';
import EndState from './renderEndState.jsx';
import getAnswerState from './answerState';

const getLatestAttempt = (attempts = []) => {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

export default React.createClass({

  getInitialState() {
    return ({ modalOpen: false, });
  },

  getHelpModal() {
    if (this.state.modalOpen) {
      return (
        <Modal close={() => { this.setState({ modalOpen: false, }); }}>
          <div className="box">
            <h4 className="title">Hint</h4>
            <iframe
              src={this.props.assetURL} frameBorder="0" width="960" height="569" allowFullScreen="true"
              mozallowfullscreen="true" webkitallowfullscreen="true"
            />
          </div>
        </Modal>
      );
    }
  },

  renderConceptExplanation() {
    if (this.props.conceptExplanation) {
      return this.props.conceptExplanation();
    }
  },

  render() {
    let content;
    let button,
      feedback = this.props.feedback;
    if (this.props.finished) {
      button = this.props.nextQuestionButton;
      const answeredCorrectly = getAnswerState(getLatestAttempt(this.props.attempts))
      feedback = <EndState questionID={this.props.questionID} question={this.props.question} answeredNonMultipleChoiceCorrectly={answeredCorrectly} multipleChoiceCorrect={this.props.multipleChoiceCorrect} key={`-${this.props.questionID}`} responses={this.props.responses} />;
    } else if (this.props.nextQuestionButton) { // if you're going to next, it is the end state
      button = this.props.nextQuestionButton;
    } else {
      let message;
      if (this.props.question.attempts.length) {
        message = 'Recheck Your Answer';
      } else {
        message = 'Check Your Answer';
      }
      button = (
        <button
          className={`button student-submit ${this.props.toggleDisabled}`} onClick={this.props.checkAnswer}
        >
          {message}
        </button>
      );
      if (!this.props.responses) {
        <button
          className={'button student-submit is-disabled'} onClick={() => {}}
        >
          {message}
        </button>;
      }
    }

    let info;
    if (this.props.assetURL) {
      info = <button className={'button is-outlined is-success'} onClick={() => { this.setState({ modalOpen: true, }); }}>Hint</button>;
    }

    return (
      <div className="student-container">
        {this.props.sentenceFragments}
        <div className="content">
          {this.props.cues}
          {feedback}
          <TextEditor
            disabled={this.props.disabled} defaultValue={this.props.initialValue}
            key={this.props.questionID}
            checkAnswer={this.props.checkAnswer}
            handleChange={this.props.handleChange}
            value={this.props.value}
            latestAttempt={getLatestAttempt(this.props.question.attempts)}
            getResponse={this.props.getResponse}
            spellCheck={this.props.spellCheck}
            placeholder="Type your answer here. Remember, your answer should be just one sentence."
          />
          <div className="question-button-group button-group">
            {this.getHelpModal()}
            {info}
            {content}
            {button}
          </div>
          {this.renderConceptExplanation()}
        </div>
      </div>
    );
  },
});
