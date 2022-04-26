declare function require(name:string);
import * as React from 'react';
import * as  _ from 'underscore';
import { stringNormalize } from 'quill-string-normalizer';
import stripHtml from "string-strip-html";

import Cues from '../renderForQuestions/cues.jsx';
import FeedbackContainer from '../renderForQuestions/feedback'
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import { Attempt } from '../renderForQuestions/answerState.js';
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import { FillInBlankQuestion } from '../../interfaces/questions';
import {
  hashToCollection,
  Prompt,
  ConceptExplanation,
  Feedback,
  getLatestAttempt,
  fillInBlankInputLabel,
} from '../../../Shared/index'

const qml = require('quill-marking-logic')
const checkFillInTheBlankQuestion = qml.checkFillInTheBlankQuestion

const styles = {
  container: {
    marginTop: 35,
    marginBottom: 18,
    fontSize: 24,
  },
  text: {
    marginRight: 5,
  },
};

interface PlayFillInTheBlankQuestionProps {
  conceptsFeedback: any
  dispatch: () => void;
  isLastQuestion: boolean;
  language?: string;
  nextQuestion: () => void;
  onHandleToggleQuestion: (question: FillInBlankQuestion) => void;
  prefill: any;
  previewMode: boolean;
  question: FillInBlankQuestion;
  setResponse: (response: Response) => void;
  submitResponse?: (response: any) => void;
  key: string;
}

interface PlayFillInTheBlankQuestionState {
  blankAllowed?: boolean;
  cues?: string[];
  inputVals?: any;
  inputErrors?: any;
  responses?: any;
  splitPrompt?: string[];
}

export class PlayFillInTheBlankQuestion extends React.Component<PlayFillInTheBlankQuestionProps, PlayFillInTheBlankQuestionState> {

  state = {
    inputErrors: null,
    inputVals: [],
    blankAllowed: false,
    cues: [],
    splitPrompt: null,
    responses: null
  }

  componentDidMount() {
    const { question } = this.props;
    this.setQuestionValues(question)
  }

  componentDidUpdate(prevProps: PlayFillInTheBlankQuestionProps) {
    const { question } = this.props;
    if (prevProps.question.prompt !== question.prompt) {
      this.setQuestionValues(question)
    }
  }

  setQuestionValues = (question: FillInBlankQuestion) => {
    const q = question;
    const splitPrompt = q.prompt.split('___');
    const numberOfInputVals = q.prompt.match(/___/g).length
    this.setState({
      splitPrompt,
      inputVals: this.generateInputs(numberOfInputVals),
      inputErrors: {},
      cues: q.cues,
      blankAllowed: q.blankAllowed,
    }, () => this.getGradedResponsesWithCallback(question));
  }

  getGradedResponsesWithCallback = (question: FillInBlankQuestion) => {
    getGradedResponsesWithCallback(
      question.key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  }

  getInstructionText = () => {
    const { question } = this.props;
    let instructions: JSX.Element|string = 'Fill in the blanks with the word or phrase that best fits the sentence.';
    const latestAttempt = getLatestAttempt(question.attempts);
    if (latestAttempt && latestAttempt.response && latestAttempt.response.feedback) {
      const component = <span dangerouslySetInnerHTML={{__html: latestAttempt.response.feedback}} />
      instructions = latestAttempt.response.feedback ? component :
        'Revise your work. Fill in the blanks with the word or phrase that best fits the sentence.';
    } else if (question.instructions && question.instructions !== '') {
      instructions = question.instructions;
    }
    return instructions
  }

  generateInputs(numberOfInputVals: number) {
    const { question, previewMode } = this.props;
    const latestAttempt = getLatestAttempt(question.attempts)
    const inputs: Array<string> = [];
    for (let i = 0; i < numberOfInputVals; i += 1) {
      if(previewMode && latestAttempt && latestAttempt.response && latestAttempt.response.inputs) {
        inputs.push(latestAttempt.response.inputs[i]);
      } else {
        inputs.push('');
      }
    }
    return inputs;
  }

  handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { inputVals, } = this.state
    const existing = [...inputVals];
    existing[i] = e.target.value;
    this.setState({
      inputVals: existing,
    });
  }

  getChangeHandler = (index: number) => {
    return (e) => {
      this.handleChange(index, e);
    };
  }

  renderText(text: string, i: number): JSX.Element[] {
    let style = {};
    if (text.length > 0) {
      style = styles.text;
    }
    const textArray = text.split(' ')
    const spanArray: JSX.Element[] = []
    textArray.forEach((word, index) => {
      spanArray.push(<span key={`${i}-${index}`} style={style}>{word}</span>)
    })
    return spanArray;
  }

  validateAllInputs = () => {
    const { inputErrors, inputVals, blankAllowed, cues, } = this.state
    const newErrors = inputErrors;
    for (let i = 0; i < inputVals.length; i++) {
      const inputVal = inputVals[i] || '';
      const inputSufficient = blankAllowed || inputVal;
      const cueMatch = (inputVal && cues.some(c => stringNormalize(c).toLowerCase() === stringNormalize(inputVal).toLowerCase().trim())) || (inputVal === '' && blankAllowed);

      if (inputSufficient && cueMatch) {
        delete newErrors[i]
      } else {
        newErrors[i] = true;
      }
    }

    // following condition will return false if no new errors
    if (_.size(newErrors)) {
      const newInputVals = inputVals
      this.setState({ inputErrors: newErrors, inputVals: newInputVals })
    } else {
      this.setState({ inputErrors: newErrors });
    }
    return Promise.resolve(true);
  }

  renderInput = (i: number) => {
    const { inputErrors, cues, inputVals, blankAllowed, } = this.state
    const { question } = this.props;
    const maxAttemptsReached = question.attempts && question.attempts.length === 5;
    const latestAttempt = getLatestAttempt(question.attempts);
    const responseOptimal = latestAttempt && latestAttempt.response.optimal;
    let className = 'fill-in-blank-input'
    if (inputErrors[i]) {
      className += ' error'
    }
    const longestCue = cues && cues.length ? cues.sort((a, b) => b.length - a.length)[0] : null
    const width = longestCue ? (longestCue.length * 15) + 10 : 50
    const styling = { width: `${width}px`}
    return (
      <span key={`span${i}`}>
        <input
          aria-label={fillInBlankInputLabel(cues, blankAllowed)}
          autoComplete="off"
          className={className}
          disabled={maxAttemptsReached || responseOptimal}
          id={`input${i}`}
          key={i + 100}
          onChange={this.getChangeHandler(i)}
          style={styling}
          type="text"
          value={inputVals[i]}
        />
      </span>
    );
  }

  getNegativeConceptResultsForResponse(conceptResults: object[]) {
    return hashToCollection(conceptResults).filter(cr => !cr.correct);
  }

  getNegativeConceptResultForResponse(conceptResults: object[]) {
    const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
    return negCRs.length > 0 ? negCRs[0] : undefined;
  }

  renderConceptExplanation = () => {
    const { conceptsFeedback, question } = this.props
    // TODO: update Response interface in quill-marking-logic
    const latestAttempt: Attempt|undefined = getLatestAttempt(question.attempts);
    if (latestAttempt && latestAttempt.response && !latestAttempt.response.optimal ) {
      if (latestAttempt.response.conceptResults) {
        const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.conceptResults);
        if (conceptID) {
          const data = conceptsFeedback.data[conceptID.conceptUID];
          if (data) {
            return <ConceptExplanation {...data} />;
          }
        }
      } else if (latestAttempt.response.concept_results) {
        const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.concept_results);
        if (conceptID) {
          const data = conceptsFeedback.data[conceptID.conceptUID];
          if (data) {
            return <ConceptExplanation {...data} />;
          }
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
  }

  getPromptElements = () => {
    const { splitPrompt, } = this.state
    if (splitPrompt) {
      const l = splitPrompt.length;
      const splitPromptWithInput:JSX.Element[] = [];
      splitPrompt.forEach((section, i) => {
        if (i !== l - 1) {
          splitPromptWithInput.push(...this.renderText(section, i));
          splitPromptWithInput.push(this.renderInput(i));
        } else {
          splitPromptWithInput.push(...this.renderText(section, i));
        }
      });
      return _.flatten(splitPromptWithInput);
    }
  }

  zipInputsAndText = () => {
    const { inputVals, splitPrompt, } = this.state
    const trimmedInputVals = inputVals.map(iv => iv.trim())
    const zipped = _.zip(splitPrompt, trimmedInputVals);
    const formatted = _.flatten(zipped).join('').trim();
    // we use stripHtml for prompts that have stylized elements
    return stripHtml(formatted);
  }

  handleSubmitClick = () => {
    this.validateAllInputs().then(() => {
      const { submitResponse, question, previewMode } = this.props;
      const { caseInsensitive, conceptID, key } = question;
      const { inputErrors, inputVals, responses, } = this.state;
      const noErrors = _.size(inputErrors) === 0;
      if (noErrors && responses) {
        const zippedAnswer = this.zipInputsAndText();
        const questionUID = key;
        const defaultConceptUID = conceptID;
        const responsesArray = hashToCollection(responses);
        const response = {response: checkFillInTheBlankQuestion(questionUID, zippedAnswer, responsesArray, caseInsensitive, defaultConceptUID)};
        if(previewMode) {
          response.response.inputs = inputVals;
        }
        this.updateResponseResource(response);
        submitResponse(response);
      }
    })
  }

  setResponse(response: Response) {
    const { setResponse, } = this.props
    if (setResponse) {
      setResponse(response)
    }
  }

  updateResponseResource(response) {
    const { dispatch, question } = this.props
    const attempts = question.attempts;
    updateResponseResource(response, question.key, attempts, dispatch);
  }

  renderMedia = () => {
    const { question } = this.props
    if (question.mediaURL) {
      return (
        <div className='ell-illustration' style={{ marginTop: 15, minWidth: 200 }}>
          <img alt={question.mediaAlt} src={question.mediaURL} />
        </div>
      );
    }
  }

  customText = () => {
    const { blankAllowed, } = this.state
    // HARDCODED
    let text = 'Add words';
    text = `${text}${blankAllowed ? ' or leave blank' : ''}`;
    return text;
  }

  showNextQuestionButton = () => {
    const { question } = this.props;
    const latestAttempt = getLatestAttempt(question.attempts);
    const maxAttemptsReached = question.attempts && question.attempts.length > 4;
    const optimalResponse = latestAttempt && latestAttempt.response.optimal;
    return maxAttemptsReached || optimalResponse;
  }

  renderButton = () => {
    const { nextQuestion, isLastQuestion, previewMode, question } = this.props
    const { responses } = this.state
    const showRecheckWorkButton = question && question.attempts ? question.attempts.length > 0 : false
    if (this.showNextQuestionButton()) {
      const buttonText = isLastQuestion ? 'Next' : 'Next question';
      const disabledStyle = previewMode && isLastQuestion ? 'disabled' : '';
      return (
        <button className={`quill-button focus-on-light large primary contained ${disabledStyle}`} onClick={nextQuestion} type="button">{buttonText}</button>
      );
    } else if (responses) {
      if (showRecheckWorkButton) {
        return <button className="quill-button focus-on-light large primary contained" onClick={this.handleSubmitClick} type="button">Recheck work</button>;
      } else {
        return <button className="quill-button focus-on-light large primary contained" onClick={this.handleSubmitClick} type="button">Submit</button>;
      }
    } else {
      <button className="quill-button focus-on-light large primary contained disabled" type="button">Submit</button>;
    }
  }

  renderFeedbackStatements(attempt: Attempt) {
    return <RenderQuestionFeedback attempt={attempt} />;
  }

  renderFeedback = () => {
    const { previewMode, question } = this.props;
    const { responses, inputErrors } = this.state

    if (inputErrors && _.size(inputErrors) !== 0) {
      const blankFeedback = question.blankAllowed ? ' or leave it blank' : ''
      const feedbackText = `Choose one of the options provided${blankFeedback}. Make sure it is spelled correctly.`
      const feedback = <p>{feedbackText}</p>
      return (
        <Feedback
          feedback={feedback}
          feedbackType="revise-unmatched"
        />
      )
    }

    return (
      <FeedbackContainer
        previewMode={previewMode}
        question={question}
        renderFeedbackStatements={this.renderFeedbackStatements}
        responses={responses}
        sentence={this.getInstructionText()}
      />
    )
  }

  render() {
    const { language, question } = this.props
    let fullPageInstructions
    if (language === 'arabic' && !(question.mediaURL)) {
      fullPageInstructions = { maxWidth: 800, width: '100%' }
    } else {
      fullPageInstructions = { display: 'block', width: '100%' }
    }
    return (
      <div className="student-container-inner-diagnostic">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={fullPageInstructions}>
            <div>
              <Prompt elements={this.getPromptElements()} style={styles.container} />
              <Cues
                customText={this.customText()}
                displayArrowAndText={true}
                question={question}
              />
              {this.renderFeedback()}
            </div>
          </div>
          {this.renderMedia()}
        </div>
        <div className="question-button-group button-group" style={{marginTop: 20}}>
          {this.renderButton()}
        </div>
        {this.renderConceptExplanation()}
      </div>
    );
  }

}

export default PlayFillInTheBlankQuestion
