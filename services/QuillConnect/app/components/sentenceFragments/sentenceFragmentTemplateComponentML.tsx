declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import * as _ from 'underscore';
import * as ReactTransition from 'react-addons-css-transition-group';
import {checkSentenceFragment, Response } from 'quill-marking-logic'
import Feedback from '../renderForQuestions/feedback';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import {
  hashToCollection,
  ConceptExplanation
} from 'quill-component-library/dist/componentLibrary';
import {
  submitResponse,
  incrementResponseCount,
  getResponsesWithCallback,
  getGradedResponsesWithCallback
} from '../../actions/responses';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
const icon = 'https://assets.quill.org/images/icons/question_icon.svg'

const PlaySentenceFragment = React.createClass<any, any>({
  getInitialState() {
    return {
      response: this.props.question ? this.props.question.prompt : '',
      checkAnswerEnabled: true,
      editing: false,
    };
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.question && !this.state.responses) {
      getGradedResponsesWithCallback(
        this.props.question.key,
        (data) => {
          this.setState({ responses: data, });
        }
      )
    }

    if (nextProps.question.attempts.length !== this.props.question.attempts.length) {
      this.setState({editing: false})
    }
  },

  showNextQuestionButton() {
    const { question, } = this.props;
    const latestAttempt = this.getLatestAttempt();
    const readyForNext =
      question.attempts.length > 4 || (latestAttempt && latestAttempt.response.optimal);
    if (readyForNext) {
      return true;
    } else {
      return false;
    }
  },

  getLatestAttempt():{response:Response}|undefined {
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
    this.setState({
      response: e,
      editing: true,
    });
  },

  checkAnswer() {
    if (this.state.checkAnswerEnabled && this.state.responses) {
      const key = this.props.currentKey;
      const { attempts, } = this.props.question;
      this.setState({ checkAnswerEnabled: false, }, () => {
        const { prompt, wordCountChange, ignoreCaseAndPunc, incorrectSequences, focusPoints } = this.getQuestion();
        const responses = hashToCollection(this.getResponses())
        const fields = {
          question_uid: key,
          response: this.state.response,
          checkML: true,
          mlUrl: 'https://nlp.quill.org',
          responses,
          wordCountChange,
          ignoreCaseAndPunc,
          prompt,
          focusPoints,
          incorrectSequences
        }
        checkSentenceFragment(fields).then((resp) => {
          const matched = {response: resp}
          if (typeof(matched) === 'object') {
            updateResponseResource(matched, key, attempts, this.props.dispatch, );
            this.props.updateAttempts(matched);
            this.setState({ checkAnswerEnabled: true, });
            this.props.handleAttemptSubmission();
          }
        })

      });
    }
  },

  getNegativeConceptResultsForResponse(conceptResults) {
    return hashToCollection(conceptResults).filter(cr => !cr.correct)
  },

  getNegativeConceptResultForResponse(conceptResults) {
    const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
    return negCRs.length > 0 ? negCRs[0] : undefined;
  },

  renderConceptExplanation() {
    if (!this.showNextQuestionButton()) {
      const latestAttempt:{response: Response}|undefined  = getLatestAttempt(this.props.question.attempts);
      if (latestAttempt && latestAttempt.response) {
        if (!latestAttempt.response.optimal && latestAttempt.response.concept_results) {
          const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.concept_results);
          if (conceptID) {
            const data = this.props.conceptsFeedback.data[conceptID.conceptUID];
            if (data) {
              return <ConceptExplanation {...data} />;
            }
          }
        } else if (this.getQuestion() && this.getQuestion().modelConceptUID) {
          const dataF = this.props.conceptsFeedback.data[this.getQuestion().modelConceptUID];
          if (dataF) {
            return <ConceptExplanation {...dataF} />;
          }
        } else if (this.getQuestion().conceptID) {
          const data = this.props.conceptsFeedback.data[this.getQuestion().conceptID];
          if (data) {
            return <ConceptExplanation {...data} />;
          }
        }
      }
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
      if (this.props.question && this.props.question.attempts ? this.props.question.attempts.length > 0 : false) {
        const buttonClass = "button student-recheck";
        return <button className={buttonClass} onClick={this.checkAnswer}>Recheck Your Answer</button>;
      } else {
        return <button className="button student-submit" onClick={this.checkAnswer}>Submit</button>;
      }
    } else {
      return <button className="button student-submit is-disabled" onClick={() => {}}>Submit</button>;
    }
  },

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion} />;
  },

  renderPlaySentenceFragmentMode() {
    const fragment = this.props.question;
    const button = this.renderButton();
    let instructions;
    const latestAttempt = this.getLatestAttempt();
    if (latestAttempt) {
      const component = <span dangerouslySetInnerHTML={{__html: latestAttempt.response.feedback}}/>
      instructions = latestAttempt.response.feedback ? component :
      'Revise your work. A complete sentence must have an action word and a person or thing doing the action.';
    } else if (fragment.instructions && fragment.instructions !== '') {
      instructions = this.props.question.instructions;
    } else {
      instructions = 'If it is a complete sentence, press submit. If it is an incomplete sentence, make it complete.';
    }
    // dangerously set some html in here
    return (
      <div className="container">
        <Feedback
          question={this.props.question}
          sentence={instructions}
          responses={this.getResponses()}
          getQuestion={this.getQuestion}
          renderFeedbackStatements={this.renderFeedbackStatements}
        />
        <TextEditor
          value={this.state.response}
          questionID={this.props.question.key}
          handleChange={this.handleChange}
          disabled={this.showNextQuestionButton()}
          checkAnswer={this.checkAnswer}
          placeholder="Type your answer here. Remember, your answer should be just one sentence."
        />
        <div className="question-button-group">
          {this.renderButton()}
        </div>
        {this.renderConceptExplanation()}
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
            <p>{this.getQuestion() ? this.getQuestion().prompt : ''}</p>
          </div>
          {this.renderInteractiveComponent()}
        </div>
      );
    } else {
      return (<div className="container">Loading...</div>);
    }
  },
});

function getLatestAttempt(attempts:Array<{response: Response}> = []):{response: Response}|undefined {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

function select(state) {
  return {
    conceptsFeedback: state.conceptsFeedback,
  };
}

export default connect(select)(PlaySentenceFragment);
