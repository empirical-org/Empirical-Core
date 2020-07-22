import React from 'react';
import { Link } from 'react-router-dom';
import handleFocus from './handleFocus.js';
import TextEditor from './renderTextEditor.jsx';
import { Modal } from 'quill-component-library/dist/componentLibrary';
import _ from 'underscore';
import EndState from './renderEndState.jsx';
import getAnswerState from './answerState';

const getLatestAttempt = (attempts = []) => {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

export default class RenderFormForAnswer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { modalOpen: false, }
  }

  handleHintClick = () => {
    this.setState({ modalOpen: true, })
  }

  onCloseModalClick = () => {
    this.setState({ modalOpen: false, })
  }

  getHelpModal() {
    const { assetURL, } = this.props
    const { modalOpen, } = this.state
    if (!modalOpen) { return }

    return (
      <Modal close={this.onCloseModalClick}>
        <div className="box">
          <h4 className="title">Hint</h4>
          <iframe
            allowFullScreen="true"
            frameBorder="0"
            height="569"
            mozallowfullscreen="true"
            src={assetURL}
            webkitallowfullscreen="true"
            width="960"
          />
        </div>
      </Modal>
    );
  }

  renderConceptExplanation() {
    const { conceptExplanation, } = this.props
    if (conceptExplanation) {
      return conceptExplanation();
    }
  }

  render() {
    const {
      feedback,
      finished,
      nextQuestionButton,
      question,
      attempts,
      questionID,
      toggleDisabled,
      checkAnswer,
      responses,
      sentenceFragments,
      cues,
      multipleChoiceCorrect,
      initialValue,
      disabled,
      getResponse,
      handleChange,
      spellCheck,
      value,
      assetURL
    } = this.props
    let renderedFeedback = feedback
    let content;
    let button
    if (finished) {
      button = nextQuestionButton;
      const answeredCorrectly = getAnswerState(getLatestAttempt(attempts))
      renderedFeedback = (<EndState
        answeredNonMultipleChoiceCorrectly={answeredCorrectly}
        key={`-${questionID}`}
        multipleChoiceCorrect={multipleChoiceCorrect}
        question={question}
        questionID={questionID}
        responses={responses}
      />);
    } else if (nextQuestionButton) { // if you're going to next, it is the end state
      button = nextQuestionButton;
    } else {
      let message;
      if (question.attempts.length) {
        message = 'Recheck work';
      } else {
        message = 'Check work';
      }
      button = (
        <button className={`quill-button focus-on-light large primary contained ${toggleDisabled}`} onClick={checkAnswer} type="button">
          {message}
        </button>
      );
      if (!responses) {
        <button className='quill-button focus-on-light large primary contained disabled' type="button">
          {message}
        </button>;
      }
    }

    let info;
    if (assetURL) {
      info = <button className='button is-outlined is-success' onClick={this.handleHintClick} type="button">Hint</button>;
    }

    return (
      <div className="student-container">
        {sentenceFragments}
        <div className="content">
          {cues}
          {renderedFeedback}
          <TextEditor
            defaultValue={initialValue}
            disabled={disabled}
            getResponse={getResponse}
            key={questionID}
            latestAttempt={getLatestAttempt(question.attempts)}
            onChange={handleChange}
            onSubmitResponse={checkAnswer}
            placeholder="Type your answer here."
            spellCheck={spellCheck}
            value={value}
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
  }
}
