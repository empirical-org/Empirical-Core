import * as React from 'react';
import * as _ from 'underscore';
// TODO: updated Response interface in quill-marking-logic
import { checkFillInTheBlankQuestion } from 'quill-marking-logic';
import { stringNormalize } from 'quill-string-normalizer';

import { Feedback, fillInBlankInputLabel, getLatestAttempt, hashToCollection, Prompt, renderPreviewFeedback } from '../../../Shared/index';
import { submitResponse } from '../../actions/diagnostics.js';
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import { Question } from '../../interfaces/Question';
import { ENGLISH, rightToLeftLanguages } from '../../modules/translation/languagePageInfo';
import Cues from '../renderForQuestions/cues';
import { submitQuestionResponse } from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';

interface PlayFillInTheBlankQuestionProps {
  currentKey: string,
  diagnosticID: string,
  dispatch(action: any): any,
  language: string,
  nextQuestion(): any,
  previewMode: boolean,
  question: Question,
  setResponse(response: any): any,
  translate(key: any, opts?: any): any,
  isLastQuestion: boolean
}

interface PlayFillInTheBlankQuestionState {
  blankAllowed: boolean,
  cues: Array<string>,
  inputErrors: {},
  inputVals: Array<string>,
  responses?: any,
  splitPrompt: Array<string>,
}

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

export class PlayFillInTheBlankQuestion extends React.Component<PlayFillInTheBlankQuestionProps, PlayFillInTheBlankQuestionState> {

  constructor(props: any) {
    super(props);

    this.state = {
      blankAllowed: false,
      cues: [],
      inputErrors: {},
      inputVals: [],
      responses: null,
      splitPrompt: [],
    };
  }

  componentDidMount() {
    const { question, } = this.props

    this.setQuestionValues(question)

    window.addEventListener('paste', (e) => {
      e.preventDefault()
      return false
    }, true);
  }

  UNSAFE_componentWillReceiveProps(nextProps: PlayFillInTheBlankQuestionProps) {
    const { question, } = this.props
    if (nextProps.question.prompt !== question.prompt) {
      this.setQuestionValues(nextProps.question)
    }
  }

  setQuestionValues = (question: Question) => {
    const splitPrompt = question.prompt.replace(/<p>/g, '').replace(/<\/p>/g, '').split('___');
    const numberOfInputVals = question.prompt.match(/___/g).length
    this.setState({
      splitPrompt,
      inputVals: this.generateInputs(numberOfInputVals),
      inputErrors: {},
      cues: question.cues,
      blankAllowed: question.blankAllowed,
    }, () => this.getGradedResponsesWithCallback(question));
  }

  getGradedResponsesWithCallback = (question: Question) => {
    getGradedResponsesWithCallback(
      question.key,
      (data: any) => {
        this.setState({ responses: data, });
      }
    );
  }

  getInstructionText = () => {
    const { language, question, translate } = this.props;
    const { instructions } = question;
    if (!language) {
      return <p dangerouslySetInnerHTML={{ __html: instructions, }} />;
    }
    const text = `instructions^${instructions}`;
    const textClass = rightToLeftLanguages.includes(language) ? 'right-to-left' : '';
    const translationPresent = language !== ENGLISH;
    return (
      <div>
        <p>{instructions}</p>
        {translationPresent && <br />}
        {translationPresent && <p className={textClass}>{translate(text)}</p>}
      </div>
    );
  }

  generateInputs(numberOfInputVals: number) {
    const inputs: Array<string> = [];
    for (let i = 0; i < numberOfInputVals; i += 1) {
      inputs.push('');
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
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      this.handleChange(index, e);
    };
  }

  renderText(text: any, i: number) {
    let style = {};
    if (text.length > 0) {
      style = styles.text;
    }
    const textArray = text.split(' ')
    const spanArray: Array<JSX.Element> = []
    textArray.forEach((word, index) => {
      spanArray.push(<span key={`${i}-${index}`} style={style}>{word}</span>)
    })
    return spanArray;
  }

  getInputProperties = (i: number) => {
    const { inputVals } = this.state;
    const { previewMode, question } = this.props;
    const latestAttempt = getLatestAttempt(question.attempts);
    if(previewMode && latestAttempt && latestAttempt.response && latestAttempt.response.inputs) {
      return {
        value: latestAttempt.response.inputs[i],
        disabled: true
      }
    }
    return {
      value: inputVals[i],
      disabled: false
    }
  }

  renderInput = (i: number) => {
    const { inputErrors, cues, blankAllowed, } = this.state
    let className = 'fill-in-blank-input'
    if (inputErrors[i]) {
      className += ' error'
    }
    const longestCue = cues && cues.length ? cues.sort((a: { length: number }, b: { length: number }) => b.length - a.length)[0] : null
    const width = longestCue ? (longestCue.length * 15) + 10 : 50
    const styling = { width: `${width}px` }
    const inputProperties = this.getInputProperties(i);
    return (
      <input
        aria-label={fillInBlankInputLabel(cues, blankAllowed)}
        autoComplete="off"
        className={className}
        disabled={inputProperties['disabled']}
        id={`input${i}`}
        key={i + 100}
        onChange={this.getChangeHandler(i)}
        style={styling}
        type="text"
        value={inputProperties['value']}
      />
    );
  }

  getPromptElements = () => {
    const { splitPrompt, } = this.state

    if (splitPrompt) {
      const l = splitPrompt.length;
      const splitPromptWithInput: Array<JSX.Element | Array<JSX.Element>> = [];
      splitPrompt.forEach((section, i) => {
        if (i !== l - 1) {
          splitPromptWithInput.push(this.renderText(section, i));
          splitPromptWithInput.push(this.renderInput(i));
        } else {
          splitPromptWithInput.push(this.renderText(section, i));
        }
      });
      return _.flatten(splitPromptWithInput);
    }
  }

  zipInputsAndText = () => {
    const { splitPrompt, inputVals, } = this.state
    const trimmedInputVals = inputVals.map(iv => iv.trim())
    const zipped = _.zip(splitPrompt, trimmedInputVals);
    return _.flatten(zipped).join('').trim();
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

  handleSubmitResponse = () => {
    this.validateAllInputs().then(() => {
      const { inputErrors, inputVals, responses, } = this.state;
      const { question, nextQuestion, previewMode, isLastQuestion } = this.props;
      const { caseInsensitive, conceptID, key } = question;
      const isDiagnosticFIB = true;
      const noErrors = _.size(inputErrors) === 0;
      if (noErrors && responses) {
        const zippedAnswer = this.zipInputsAndText();
        const questionUID = key;
        const defaultConceptUID = conceptID;
        const responsesArray = hashToCollection(responses);
        const response = { response: checkFillInTheBlankQuestion(questionUID, zippedAnswer, responsesArray, caseInsensitive, defaultConceptUID, isDiagnosticFIB) }
        // we send the inputVals during previewMode to prefill questions that have been played
        if(previewMode) {
          response.response.inputs = inputVals;
        }
        this.setResponse(response);
        this.updateResponseResource(response);
        this.submitResponse(response);
        // we don't submit the last question if in previewMode
        if(previewMode && isLastQuestion) { return }
        nextQuestion();
      }
    })
  }

  setResponse = (response: any) => {
    const { setResponse, } = this.props;
    if (setResponse) {
      setResponse(response)
    }
  }

  submitResponse = (response: any) => {
    submitQuestionResponse(response, this.props, submitResponse);
  }

  updateResponseResource = (response: any) => {
    const { question, dispatch, } = this.props;
    const { attempts, key } = question;
    updateResponseResource(response, key, attempts, dispatch);
  }

  renderMedia = () => {
    const { question, } = this.props;
    const { mediaAlt, mediaURL } = question;
    if (mediaURL) {
      return (
        <div className='ell-illustration' style={{ marginTop: 15, minWidth: 200 }}>
          <img alt={mediaAlt} src={mediaURL} />
        </div>
      );
    }
  }

  renderFeedback = () => {
    const { diagnosticID, language, question, translate, previewMode } = this.props
    const { inputErrors, } = this.state
    const errorsPresent = _.size(inputErrors) !== 0;
    const latestAttempt = getLatestAttempt(question.attempts);
    if (errorsPresent) {
      let feedback: any;
      const blankFeedback = question.blankAllowed ? ' or leave it blank' : ''
      const translationKey = question.blankAllowed ? 'feedback^blank' : 'feedback^no blank';
      const feedbackText = `Choose one of the options provided${blankFeedback}. Make sure it is spelled correctly.`
      if (language && diagnosticID !== 'ell') {
        const rightToLeftLanguages = ['arabic', 'urdu', 'dari'];
        const textClass = rightToLeftLanguages.includes(language) ? 'right-to-left' : '';
        const translationPresent = language !== ENGLISH;
        feedback = (<div>
          <p>{feedbackText}</p>
          {translationPresent && <br />}
          {translationPresent && <p className={textClass}>{translate(translationKey)}</p>}
        </div>);
      } else {
        feedback = <p>{feedbackText}</p>
      }
      return (
        <Feedback
          feedback={feedback}
          feedbackType="revise-unmatched"
        />
      )
    }
    if(previewMode && latestAttempt && latestAttempt.response) {
      return renderPreviewFeedback(latestAttempt);
    } else {
      return <Feedback feedback={this.getInstructionText()} feedbackType="instructions" />
    }
  }

  renderButton = () => {
    const { responses } = this.state;
    const { language, translate, previewMode, question } = this.props;
    const buttonText = language ? translate('buttons^submit') : 'Submit';
    const latestAttempt = getLatestAttempt(question.attempts);

    if((previewMode && latestAttempt) || !responses) {
      return <button className="quill-button focus-on-light large primary contained disabled" type="button">{buttonText}</button>;
    }
    return <button className="quill-button focus-on-light large primary contained" onClick={this.handleSubmitResponse} type="button">{buttonText}</button>
  }

  render() {
    const { diagnosticID, language, question, translate } = this.props;
    const fullPageInstructions = question.mediaURL ? { display: 'block' } : { maxWidth: 800, width: '100%' };

    return (
      <div className="student-container-inner-diagnostic">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={fullPageInstructions}>
            <div className="flex-column-reverse">
              {this.renderFeedback()}
              <span className="sr-only">Screenreader users: make sure to read through the whole sentence before filling in the blanks.</span>
              <Cues
                diagnosticID={diagnosticID}
                displayArrowAndText={true}
                language={language}
                question={question}
                translate={translate}
              />
              <Prompt elements={this.getPromptElements()} style={styles.container} />
            </div>
          </div>
          {this.renderMedia()}
        </div>
        <div className="question-button-group button-group" style={{ marginTop: 20 }}>
          {this.renderButton()}
        </div>
      </div>
    );
  }
}

export default PlayFillInTheBlankQuestion;
