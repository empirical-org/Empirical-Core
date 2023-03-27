import React from 'react';
import ReactTransition from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import { Feedback, getDisplayedText, getLatestAttempt, hashToCollection, renderPreviewFeedback } from '../../../Shared/index';
import {
    getGradedResponsesWithCallback
} from '../../actions/responses.js';
import POSMatcher from '../../libs/sentenceFragment.js';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
const icon = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/direction.svg`

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
    const { question } = this.props;
    const { instructions } = question;
    return <p dangerouslySetInnerHTML={{ __html: instructions, }} />;
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
    return (
      <div className="sf-button-group">
        <button className="button sf-button focus-on-light" onClick={this.handleClickCompleteSentence} type="button" value="Sentence">Complete</button>
        <button className="button sf-button focus-on-light" onClick={this.handleClickIncompleteSentence} type="button" value="Fragment">Incomplete</button>
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
              <p>Is this a complete or an incomplete sentence?</p>
            </div>
            {this.getSentenceOrFragmentButtons()}
          </ReactTransition>
        </div>
      );
    }
    return (<div />);
  }

  renderFeedback = () => {
    const { question, previewMode } = this.props
    const instructions = this.getInstructionText();
    const latestAttempt = getLatestAttempt(question.attempts);
    if(previewMode && latestAttempt) {
      renderPreviewFeedback(latestAttempt);
    } else if(instructions) {
      return(
        <Feedback
          feedback={this.getInstructionText()}
          feedbackType="instructions"
        />
      );
    } else {
      return null;
    }
  }

  renderPlaySentenceFragmentMode(fragment) {
    const { previewMode, question } = this.props;
    const { responses, response, } = this.state
    const displayedText = getDisplayedText({ previewMode, question, response });
    const latestAttempt = getLatestAttempt(question.attempts);
    // HARDCODED
    let button
    if(!responses || (previewMode && latestAttempt)) {
      button = <button className="quill-button focus-on-light large primary contained disabled" type="button">Submit</button>;
    } else {
      button = <button className="quill-button focus-on-light large primary contained" onClick={this.handleResponseSubmission} type="button">Submit</button>;
    }

    if (!this.choosingSentenceOrFragment()) {
      const component = this.renderFeedback();

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
              value={displayedText}
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
        <div className="draft-js sentence-fragments">
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
