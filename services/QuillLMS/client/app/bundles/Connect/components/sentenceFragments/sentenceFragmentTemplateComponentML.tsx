import * as React from 'react';
import * as _ from 'underscore';
import {checkSentenceFragment, Response } from 'quill-marking-logic'

import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import Feedback from '../renderForQuestions/feedback';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import {
  getGradedResponsesWithCallback
} from '../../actions/responses';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import { SentenceFragmentQuestion } from '../../interfaces/questions';
import { Attempt } from '../renderForQuestions/answerState.js';
import { hashToCollection, ConceptExplanation, getLatestAttempt } from '../../../Shared/index'

const icon = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/direction.svg`

interface PlaySentenceFragmentProps {
  question: SentenceFragmentQuestion;
  dispatch: () => void;
  updateAttempts: (response: object) => void;
  previewMode: boolean;
  markIdentify: (boolean: boolean) => void;
  currentKey: string;
  conceptsFeedback: any;
  nextQuestion: () => void;
  isLastQuestion: boolean;
}

interface PlaySentenceFragmentState {
  editing: boolean;
  checkAnswerEnabled: boolean;
  response: string;
  responses?: object[];
}

class PlaySentenceFragment extends React.Component<PlaySentenceFragmentProps, PlaySentenceFragmentState> {
  constructor(props: PlaySentenceFragmentProps) {
    super(props)

    const { question } = props
    let response = ''
    if (question && question.attempts && question.attempts.length) {
      const attemptLength = question.attempts.length
      const lastSubmission = question.attempts[attemptLength - 1]
      response = lastSubmission.response.text
    } else if (question) {
      response = question.prompt
    }

    this.state = {
      response,
      checkAnswerEnabled: true,
      editing: false
    }
  }

  componentDidMount() {
    const { question } = this.props
    const { responses, } = this.state
    if (question && !responses) {
      getGradedResponsesWithCallback(
        question.key,
        (data) => {
          this.setState({ responses: data, });
        }
      )
    }
  }

  shouldComponentUpdate(nextProps: PlaySentenceFragmentProps, nextState: PlaySentenceFragmentState) {
    const { question, } = this.props
    const { response, responses } = this.state
    if (question !== nextProps.question) {
      return true;
    } else if (response !== nextState.response) {
      return true;
    } else if (responses !== nextState.responses) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps: PlaySentenceFragmentProps) {
    const { question, } = this.props;
    const attemptsLength = prevProps.question.attempts ? prevProps.question.attempts.length : null;
    if (question.attempts && question.attempts.length !== attemptsLength) {
      this.setState({editing: false})
    }
  }


  showNextQuestionButton = () => {
    const { question } = this.props;
    const latestAttempt = getLatestAttempt(question.attempts);
    const maxAttempts = question.attempts && question.attempts.length > 4
    return maxAttempts || (latestAttempt && latestAttempt.response.optimal);
  }

  handleClickCompleteSentence = () => this.checkChoice('Sentence')

  handleClickIncompleteSentence = () => this.checkChoice('Fragment')

  checkChoice(choice: string) {
    const { markIdentify, question } = this.props
    const questionType = question.isFragment ? 'Fragment' : 'Sentence';
    markIdentify(choice === questionType);
  }

  renderSentenceOrFragmentButtons = () => {
    return (
      <div className="sf-button-group">
        <button className="button sf-button focus-on-light" onClick={this.handleClickCompleteSentence} type="button" value="Sentence">Complete Sentence</button>
        <button className="button sf-button focus-on-light" onClick={this.handleClickIncompleteSentence} type="button" value="Fragment">Incomplete Sentence</button>
      </div>
    );
  }

  choosingSentenceOrFragment = () => {
    const { question } = this.props;
    return question.identified === undefined && (question.needsIdentification === undefined || question.needsIdentification === true);
    // the case for question.needsIdentification===undefined is for sentenceFragments that were created before the needsIdentification field was put in
  }

  handleChange = (e: string) => {
    this.setState({
      response: e,
      editing: true,
    });
  }

  handleCheckSentenceFragment = ({ fields, key, attempts }) => {
    const { dispatch, updateAttempts } = this.props
    checkSentenceFragment(fields).then((resp) => {
      const matched = {response: resp}
      if (typeof(matched) === 'object') {
        updateResponseResource(matched, key, attempts, dispatch, );
        updateAttempts(matched);
        this.setState({ checkAnswerEnabled: true, });
      }
    })
  }

  handleResponseSubmission = () => {
    const { checkAnswerEnabled, responses, response } = this.state
    const { currentKey, question } = this.props
    if (checkAnswerEnabled && responses) {
      const key = currentKey;
      const { attempts } = question;
      this.setState({ checkAnswerEnabled: false, }, () => {
        const { prompt, wordCountChange, ignoreCaseAndPunc, incorrectSequences, focusPoints, modelConceptUID, concept_uid, conceptID } = question;
        const hashedResponses = hashToCollection(responses)
        const defaultConceptUID = modelConceptUID || concept_uid || conceptID
        const fields = {
          question_uid: key,
          response: response,
          checkML: true,
          mlUrl: 'https://nlp.quill.org',
          responses: hashedResponses,
          wordCountChange,
          ignoreCaseAndPunc,
          prompt,
          focusPoints,
          incorrectSequences,
          defaultConceptUID
        }
        this.handleCheckSentenceFragment({ fields, key, attempts });
      });
    }
  }

  getNegativeConceptResultsForResponse(conceptResults) {
    return hashToCollection(conceptResults).filter(cr => !cr.correct)
  }

  getNegativeConceptResultForResponse(conceptResults) {
    const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
    return negCRs.length > 0 ? negCRs[0] : undefined;
  }

  handleConceptExplanation = () => {
    const { question } = this.props;
    if(this.showNextQuestionButton()) {
      return;
    }
    const latestAttempt:{response: Response}|undefined  = getLatestAttempt(question.attempts);
    const nonOptimalResponse = latestAttempt && latestAttempt.response && !latestAttempt.response.optimal;
    if (nonOptimalResponse) {
      return this.renderConceptExplanation(latestAttempt);
    }
  }

  renderConceptExplanation = (latestAttempt) => {
    const { conceptsFeedback, question } = this.props;
    if (latestAttempt.response.conceptResults) {
      const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.conceptResults);
      const data = conceptID ? conceptsFeedback.data[conceptID.conceptUID] : null;
      if (data) {
        return <ConceptExplanation {...data} />;
      }
    } else if (latestAttempt.response.concept_results) {
      const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.concept_results);
      const data = conceptID ? conceptsFeedback.data[conceptID.conceptUID] : null;
      if (data) {
        return <ConceptExplanation {...data} />;
      }
    } else if (question && question.modelConceptUID) {
      const dataF = conceptsFeedback.data[question.modelConceptUID];
      if (dataF) {
        return <ConceptExplanation {...dataF} />;
      }
    } else if (question.conceptID) {
      const data = conceptsFeedback.data[question.conceptID];
      if (data) {
        return <ConceptExplanation {...data} />;
      }
    }
  }

  renderSentenceOrFragmentMode = () => {
    return (
      <div className="container">
        <div className="feedback-row">
          <img alt="Directions Icon" className="info" src={icon} />
          <p>Is this a complete or an incomplete sentence?</p>
        </div>
        {this.renderSentenceOrFragmentButtons()}
      </div>
    );
  }

  renderButton = () => {
    const { responses } = this.state
    const { nextQuestion, question, previewMode, isLastQuestion } = this.props;
    const showRecheckWorkButton = question && question.attempts ? question.attempts.length > 0 : false
    if (this.showNextQuestionButton()) {
      const disabledStyle = previewMode && isLastQuestion ? 'disabled' : '';
      return <button className={`quill-button focus-on-light large primary contained ${disabledStyle}`} onClick={nextQuestion} type="button">Next</button>;
    } else if (responses) {
      if (showRecheckWorkButton) {
        return <button className="quill-button focus-on-light large primary contained" onClick={this.handleResponseSubmission} type="button">Recheck work</button>;
      } else {
        return <button className="quill-button focus-on-light large primary contained" onClick={this.handleResponseSubmission} type="button">Submit</button>;
      }
    } else {
      return <button className="quill-button focus-on-light large primary contained disabled" type="button">Submit</button>;
    }
  }

  renderFeedbackStatements(attempt: Attempt) {
    return <RenderQuestionFeedback attempt={attempt} />;
  }

  renderPlaySentenceFragmentMode = () => {
    const { question } = this.props;
    const { response, responses } = this.state
    let instructions;
    const latestAttempt = getLatestAttempt(question.attempts);
    if (latestAttempt) {
      const component = <span dangerouslySetInnerHTML={{__html: latestAttempt.response.feedback}} />
      instructions = latestAttempt.response.feedback ? component :
        'Revise your work. A complete sentence must have an action word and a person or thing doing the action.';
    } else if (question.instructions && question.instructions !== '') {
      instructions = question.instructions;
    } else {
      instructions = 'If it is a complete sentence, press submit. If it is an incomplete sentence, make it complete.';
    }
    return (
      <div className="container">
        <Feedback
          question={question}
          renderFeedbackStatements={this.renderFeedbackStatements}
          responses={responses}
          sentence={instructions}
        />
        <TextEditor
          disabled={this.showNextQuestionButton()}
          onChange={this.handleChange}
          onSubmitResponse={this.handleResponseSubmission}
          placeholder="Type your answer here."
          questionID={question.key}
          value={response}
        />
        <div className="question-button-group">
          {this.renderButton()}
        </div>
        {this.handleConceptExplanation()}
      </div>
    );
  }

  renderInteractiveComponent = () => {
    if (this.choosingSentenceOrFragment()) {
      return this.renderSentenceOrFragmentMode();
    } else {
      return this.renderPlaySentenceFragmentMode();
    }
  }

  render() {
    const { question, } = this.props
    if (!question) { return (<div className="container">Loading...</div>) }

    return (
      <div className="student-container-inner-diagnostic">
        <div className="draft-js sentence-fragments">
          <p>{question ? question.prompt : ''}</p>
        </div>
        {this.renderInteractiveComponent()}
      </div>
    );
  }
}

export default PlaySentenceFragment
