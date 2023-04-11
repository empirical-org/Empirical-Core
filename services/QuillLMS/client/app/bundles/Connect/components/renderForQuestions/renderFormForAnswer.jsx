import React from 'react';
import { Modal } from '../../../Shared/index';
import getAnswerState from './answerState';
import EndState from './renderEndState.jsx';
import TextEditor from './renderTextEditor.jsx';

const getLatestAttempt = (attempts = []) => {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

export default class RenderFormForAnswer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { modalOpen: false, }
  }

  getHelpModal = () => {
    const { modalOpen, } = this.state
    const { assetURL, } = this.props
    if (modalOpen) {
      return (
        <Modal close={this.closeHelpModal}>
          <div className="box">
            <h4 className="title">Hint</h4>
            <iframe
              allowFullScreen="true"
              frameBorder="0"
              height="569"
              mozallowfullscreen="true"
              src={assetURL}
              title="hint"
              webkitallowfullscreen="true"
              width="960"
            />
          </div>
        </Modal>
      );
    }
  }

  closeHelpModal = () => this.setState({ modalOpen: false, })

  handleHintClick = () => this.setState({ modalOpen: true, })

  renderConceptExplanation = () => {
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
      attempts,
      questionID,
      multipleChoiceCorrect,
      question,
      responses,
      toggleDisabled,
      checkAnswer,
      assetURL,
      sentenceFragments,
      cues,
      initialValue,
      disabled,
      getResponse,
      handleChange,
      spellCheck,
      value,
      isAdmin
    } = this.props
    let content
    let button
    let renderedFeedback = feedback
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
      />)
    } else if (nextQuestionButton) { // if you're going to next, it is the end state
      button = nextQuestionButton;
    } else {
      const message = 'Get feedback'
      button = (
        <button
          className={`quill-button focus-on-light large primary contained ${toggleDisabled}`}
          onClick={checkAnswer}
          tabIndex="0"
          type="button"
        >
          {message}
        </button>
      );
      if (!responses) {
        <button
          className='quill-button focus-on-light large primary contained disabled'
          tabIndex="0"
          type="button"
        >
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
            isAdmin={isAdmin}
            key={questionID}
            latestAttempt={getLatestAttempt(question.attempts)}
            onChange={handleChange}
            onSubmitResponse={checkAnswer}
            placeholder="Type your answer here."
            questionID={questionID}
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
