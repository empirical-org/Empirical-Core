declare function require(name:string);
import * as React from 'react';
import * as  _ from 'underscore';
import { stringNormalize } from 'quill-string-normalizer';

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
  Feedback
} from '../../../Shared/index'

const qml = require('quill-marking-logic')
const checkFillInTheBlankQuestion = qml.checkFillInTheBlankQuestion

const styles = {
  container: {
    marginTop: 35,
    marginBottom: 18,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  questionToPreview: FillInBlankQuestion;
  setResponse: (response: Response) => void;
  submitResponse?: (response: any) => void;
  key: string;
}

interface PlayFillInTheBlankQuestionState {
  previewAttempt: any;
  previewAttemptSubmitted: boolean;
  previewSentenceOrFragmentSelected: boolean;
  previewSubmissionCount: number;
}

export class PlayFillInTheBlankQuestion extends React.Component<PlayFillInTheBlankQuestionProps, any> {
  constructor(props) {
    super(props);

    this.state = {
      previewAttempt: null,
      previewAttemptSubmitted: false,
      previewSubmissionCount: 0,
      previewSentenceOrFragmentSelected: false
    }
  }

  componentDidMount() {
    const question = this.getQuestion();
    this.setQuestionValues(question)
  }

  componentDidUpdate(prevProps: PlayFillInTheBlankQuestionProps) {
    const question = this.getQuestion();
    if (prevProps.question.prompt !== question.prompt) {
      this.setQuestionValues(question)
    }
  }

  setQuestionValues = (question: FillInBlankQuestion) => {
    const q = question;
    const splitPrompt = q.prompt.split('___');
    this.setState({
      splitPrompt,
      inputVals: this.generateInputs(splitPrompt),
      inputErrors: new Set(),
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

  getQuestion = () => {
    const { question, previewMode, questionToPreview } = this.props;
    if(previewMode && questionToPreview) {
      return questionToPreview;
    }
    return question
  }

  getInstructionText = () => {
    const question = this.getQuestion();
    let instructions: JSX.Element|string = 'Fill in the blanks with the word or phrase that best fits the sentence.';
    const latestAttempt = this.getLatestAttempt();
    if (latestAttempt && latestAttempt.response && latestAttempt.response.feedback) {
      const component = <span dangerouslySetInnerHTML={{__html: latestAttempt.response.feedback}} />
      instructions = latestAttempt.response.feedback ? component :
      'Revise your work. Fill in the blanks with the word or phrase that best fits the sentence.';
    } else if (question.instructions && question.instructions !== '') {
      instructions = question.instructions;
    }
    return instructions
  }

  getBlurHandler = (index) => {
    return () => {
      this.validateInput(index);
    };
  }

  generateInputs(promptArray: string[]) {
    let inputs: string[] = [];
    const latestAttempt = this.getLatestAttempt();
    if (latestAttempt) {
      const text = latestAttempt.response.text
      const promptRegex = new RegExp(promptArray.join('|'), 'i')
      inputs = text.split(promptRegex).filter(input => input.length)
    } else {
      inputs = Array.from({length: promptArray.length - 2}, () => '')
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

  validateInput = (i: number) => {
    const { inputErrors, inputVals, blankAllowed, cues, } = this.state
    const newErrors = new Set(inputErrors);
    const inputVal = inputVals[i] || '';
    const inputSufficient = blankAllowed ? true : inputVal;
    const cueMatch = (inputVal && cues.some(c => stringNormalize(c).toLowerCase() === stringNormalize(inputVal).toLowerCase().trim())) || inputVal === ''
    if (inputSufficient && cueMatch) {
      newErrors.delete(i);
    } else {
      newErrors.add(i);
    }

    // following condition will return false if no new errors
    if (newErrors.size) {
      const newInputVals = inputVals
      newInputVals[i] = ''
      this.setState({ inputErrors: newErrors, inputVals: newInputVals })
    } else {
      this.setState({ inputErrors: newErrors });
    }
  }

  renderInput = (i: number) => {
    const { inputErrors, cues, inputVals, } = this.state
    let className = 'fill-in-blank-input'
    if (inputErrors.has(i)) {
      className += ' error'
    }
    const longestCue = cues && cues.length ? cues.sort((a, b) => b.length - a.length)[0] : null
    const width = longestCue ? (longestCue.length * 15) + 10 : 50
    const styling = { width: `${width}px`}
    return (
      <span key={`span${i}`}>
        <input
          aria-label="text input"
          autoComplete="off"
          className={className}
          id={`input${i}`}
          key={i + 100}
          onBlur={this.getBlurHandler(i)}
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
    const { conceptsFeedback, } = this.props
    // TODO: update Response interface in quill-marking-logic
    const latestAttempt: Attempt|undefined = this.getLatestAttempt();
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
      } else if (this.getQuestion() && this.getQuestion().modelConceptUID) {
        const dataF = conceptsFeedback.data[this.getQuestion().modelConceptUID];
        if (dataF) {
          return <ConceptExplanation {...dataF} />;
        }
      } else if (this.getQuestion().conceptID) {
        const data = conceptsFeedback.data[this.getQuestion().conceptID];
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
    return _.flatten(zipped).join('').trim();
  }

  handleSubmitClick = () => {
    const { submitResponse, previewMode } = this.props;
    const question = this.getQuestion();
    const { caseInsensitive, conceptID, key } = question;
    const { inputErrors, blankAllowed, inputVals, responses, } = this.state;
    if (!inputErrors.size) {
      if (!blankAllowed) {
        if (inputVals.length === 0) {
          this.validateInput(0);
          return;
        }
      }
      const zippedAnswer = this.zipInputsAndText();
      const questionUID = key;
      const defaultConceptUID = conceptID;
      const responsesArray = hashToCollection(responses);
      const response = {response: checkFillInTheBlankQuestion(questionUID, zippedAnswer, responsesArray, caseInsensitive, defaultConceptUID)};
      if(previewMode) {
        this.setState(prevState => ({
          previewAttempt: response,
          previewAttemptSubmitted: true,
          previewSubmissionCount: prevState.previewSubmissionCount + 1
        }));
      }
      this.updateResponseResource(response);
      submitResponse(response);
    }
  }

  setResponse(response: Response) {
    const { setResponse, } = this.props
    if (setResponse) {
      setResponse(response)
    }
  }

  updateResponseResource(response) {
    const { dispatch, previewMode } = this.props
    const attempts = previewMode ? [this.getLatestAttempt()] : this.getQuestion().attempts;
    updateResponseResource(response, this.getQuestion().key, attempts, dispatch);
  }

  renderMedia = () => {
    if (this.getQuestion().mediaURL) {
      return (
        <div className='ell-illustration' style={{ marginTop: 15, minWidth: 200 }}>
          <img alt={this.getQuestion().mediaAlt} src={this.getQuestion().mediaURL} />
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

  getLatestAttempt = ():{response:Response}|undefined => {
    const { previewAttempt } = this.state;
    const { question } = this.props;
    if(previewAttempt) {
      return previewAttempt;
    }
    return _.last(question.attempts || []);
  }

  showNextQuestionButton = () => {
    const { previewSubmissionCount } = this.state;
    const { question, previewMode } = this.props;
    const latestAttempt = this.getLatestAttempt();
    const maxAttemptsReached = (question.attempts && question.attempts.length > 4) ||(previewMode && previewSubmissionCount > 4);
    const optimalResponse = latestAttempt && latestAttempt.response.optimal;
    return maxAttemptsReached || optimalResponse;
  }

  renderButton = () => {
    const { nextQuestion, isLastQuestion, previewMode } = this.props
    const question = this.getQuestion();
    const { responses, previewSubmissionCount } = this.state
    let showRecheckWorkButton;
    if(previewMode) {
      showRecheckWorkButton = previewSubmissionCount > 0;
    } else {
      showRecheckWorkButton = question && question.attempts ? question.attempts.length > 0 : false
    }
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
    return <RenderQuestionFeedback attempt={attempt} getQuestion={this.getQuestion} />;
  }

  renderFeedback = () => {
    const question = this.getQuestion();
    const { previewMode } = this.props;
    const { responses, inputErrors, previewAttempt, previewAttemptSubmitted} = this.state

    if (inputErrors && inputErrors.size) {
      const blankFeedback = question.blankAllowed ? ' or leave it blank' : ''
      const feedbackText = `Choose one of the options provided${blankFeedback}. Make sure it is spelled correctly.`
      const feedback = <p>{feedbackText}</p>
      return (<Feedback
        feedback={feedback}
        feedbackType="revise-unmatched"
      />)
    }

    return (<FeedbackContainer
      getQuestion={this.getQuestion}
      previewAttempt={previewAttempt}
      previewAttemptSubmitted={previewAttemptSubmitted}
      previewMode={previewMode}
      question={question}
      renderFeedbackStatements={this.renderFeedbackStatements}
      responses={responses}
      sentence={this.getInstructionText()}
    />)
  }

  render() {
    const { language, } = this.props
    let fullPageInstructions
    if (language === 'arabic' && !(this.getQuestion().mediaURL)) {
      fullPageInstructions = { maxWidth: 800, width: '100%' }
    } else {
      fullPageInstructions = { display: 'block', width: '100%' }
    }
    return (<div className="student-container-inner-diagnostic">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={fullPageInstructions}>
          <div>
            <Prompt elements={this.getPromptElements()} style={styles.container} />
            <Cues
              customText={this.customText()}
              displayArrowAndText={true}
              getQuestion={this.getQuestion}
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
