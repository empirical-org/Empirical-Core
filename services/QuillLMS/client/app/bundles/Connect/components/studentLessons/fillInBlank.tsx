import { stringNormalize } from 'quill-string-normalizer';
import * as React from 'react';
import { stripHtml } from "string-strip-html";
import * as _ from 'underscore';

import { checkFillInTheBlankQuestion, } from '../../../Shared/quill-marking-logic/src/main'
import {
  Feedback,
  Prompt,
  fillInBlankInputLabel,
  fillInBlankInputStyle,
  splitPromptForFillInBlank,
  getLatestAttempt,
  hashToCollection,
  FinalAttemptFeedback,
  ALLOWED_ATTEMPTS
} from '../../../Shared/index';
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import { FillInBlankQuestion } from '../../interfaces/questions';
import { Attempt } from '../renderForQuestions/answerState.js';
import Cues from '../renderForQuestions/cues.jsx';
import FeedbackContainer from '../renderForQuestions/feedback';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import { renderExplanation } from '../../libs/translationFunctions';

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
  translate: (language: string) => string;
  showTranslation: boolean;
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

  correctResponse = () => {
    const { responses } = this.state
    const { question } = this.props
    let text

    if (responses && Object.keys(responses).length) {
      const responseArray = hashToCollection(responses).sort((a: Response, b: Response) => b.count - a.count)
      const firstOptimalResponse = responseArray.find((r: Response) => r.optimal)
      if (firstOptimalResponse) {
        text = firstOptimalResponse.text
      }
    }
    if (!text) {
      text = question?.answers?.[0]?.text?.replace(/{|}/gm, '')
    }
    return text
  }

  setQuestionValues = (question: FillInBlankQuestion) => {
    const q = question;
    const splitPrompt = splitPromptForFillInBlank(question.prompt);
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

    const value = inputVals[i]

    return (
      <input
        aria-label={fillInBlankInputLabel(cues, blankAllowed)}
        autoComplete="off"
        className={className}
        disabled={maxAttemptsReached || responseOptimal}
        id={`input${i}`}
        key={i + 100}
        onChange={this.getChangeHandler(i)}
        style={fillInBlankInputStyle(value, cues)}
        type="text"
        value={value}
      />
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
    const { conceptsFeedback, question, showTranslation } = this.props
    // TODO: update Response interface in quill-marking-logic
    const latestAttempt: Attempt|undefined = getLatestAttempt(question.attempts);

    if(!latestAttempt?.response || latestAttempt?.response?.optimal) { return }

    if (latestAttempt.response.conceptResults) {
      const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.conceptResults);
      if (conceptID) {
        const key = conceptID.conceptUID
        const data = conceptsFeedback.data[key];
        return renderExplanation({ data, key, conceptsFeedback, showTranslation });
      }
    } else if (latestAttempt.response.concept_results) {
      const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.concept_results);
      if (conceptID) {
        const key = conceptID.conceptUID
        const data = conceptsFeedback.data[key];
        return renderExplanation({ data, key, conceptsFeedback, showTranslation });
      }
    } else if (question && question.modelConceptUID) {
      const key = question.modelConceptUID
      const data = conceptsFeedback.data[key];
      return renderExplanation({ data, key, conceptsFeedback, showTranslation });
    } else if (question.conceptID) {
      const key = question.conceptID
      const data = conceptsFeedback.data[key];
      return renderExplanation({ data, key, conceptsFeedback, showTranslation });
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
    return stripHtml(formatted).result;
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
    const { nextQuestion, isLastQuestion, previewMode, question, translate, showTranslation } = this.props
    const { responses } = this.state
    const showRecheckWorkButton = question && question.attempts ? question.attempts.length > 0 : false
    if (this.showNextQuestionButton()) {
      let buttonText = isLastQuestion ? 'Next' : 'Next question';
      buttonText = showTranslation ? translate(`buttons^${buttonText.toLowerCase()}`) : buttonText
      const disabledStyle = previewMode && isLastQuestion ? 'disabled' : '';
      return (
        <button className={`quill-button-archived focus-on-light large primary contained ${disabledStyle}`} onClick={nextQuestion} type="button">{buttonText}</button>
      );
    } else if (responses) {
      if (showRecheckWorkButton) {
        const buttonText = showTranslation ? translate('buttons^recheck work') : 'Recheck work'
        return <button className="quill-button-archived focus-on-light large primary contained" onClick={this.handleSubmitClick} type="button">{buttonText}</button>;
      } else {
        const buttonText = showTranslation ? translate('buttons^submit') : 'Submit'
        return <button className="quill-button-archived focus-on-light large primary contained" onClick={this.handleSubmitClick} type="button">{buttonText}</button>;
      }
    } else {
      const buttonText = showTranslation ? translate('buttons^submit') : 'Submit'
      return <button className="quill-button-archived focus-on-light large primary contained disabled" type="button">{buttonText}</button>
    }
  }

  renderFeedbackStatements(attempt: Attempt) {
    return <RenderQuestionFeedback attempt={attempt} />;
  }

  renderFeedback = () => {
    const { previewMode, question, showTranslation, translate } = this.props;
    const { responses, inputErrors } = this.state

    const maxAttemptsSubmitted = question.attempts && question.attempts.length === ALLOWED_ATTEMPTS;
    const latestAttempt = getLatestAttempt(question.attempts);

    if (maxAttemptsSubmitted && !latestAttempt.response.optimal) {
      return (
        <FinalAttemptFeedback
          correctResponse={this.correctResponse()}
          latestAttempt={latestAttempt.response.text}
        />
      )
    } else if (inputErrors && _.size(inputErrors) !== 0) {
      const blankFeedback = question.blankAllowed ? ' or leave it blank' : ''
      const feedbackText = `Choose one of the options provided${blankFeedback}. Make sure it is spelled correctly.`
      const feedback = <p>{feedbackText}</p>
      return (
        <Feedback
          feedback={feedback}
          feedbackType="revise-unmatched"
          latestAttempt={latestAttempt}
          showTranslation={showTranslation}
          translate={translate}
        />
      )
    }

    return (
      <FeedbackContainer
        latestAttempt={latestAttempt}
        previewMode={previewMode}
        question={question}
        renderFeedbackStatements={this.renderFeedbackStatements}
        responses={responses}
        sentence={this.getInstructionText()}
        showTranslation={showTranslation}
        translate={translate}
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
