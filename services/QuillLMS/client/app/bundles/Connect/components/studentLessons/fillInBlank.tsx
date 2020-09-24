declare function require(name:string);
import * as React from 'react';
import * as  _ from 'underscore';
const qml = require('quill-marking-logic')
const checkFillInTheBlankQuestion = qml.checkFillInTheBlankQuestion
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import Cues from '../renderForQuestions/cues.jsx';
import {
  Prompt,
  ConceptExplanation,
  Feedback
} from 'quill-component-library/dist/componentLibrary'
import FeedbackContainer from '../renderForQuestions/feedback'
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import { Attempt } from '../renderForQuestions/answerState.js';
import { stringNormalize } from 'quill-string-normalizer';
import { hashToCollection, } from '../../../Shared/index'

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

export class PlayFillInTheBlankQuestion extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    const { question, } = this.props
    this.setQuestionValues(question)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { question, } = this.props
    if (nextProps.question.prompt !== question.prompt) {
      this.setQuestionValues(nextProps.question)
    }
  }

  setQuestionValues = (question) => {
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

  getGradedResponsesWithCallback = (question) => {
    getGradedResponsesWithCallback(
      question.key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  }

  getQuestion = () => {
    const { question, } = this.props;
    return question;
  }

  getInstructionText = () => {
    const { question, } = this.props
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

  generateInputs(promptArray) {
    let inputs:Array<string> = [];
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

  handleChange = (i, e) => {
    const { inputVals, } = this.state
    const existing = [...inputVals];
    existing[i] = e.target.value;
    this.setState({
      inputVals: existing,
    });
  }

  getChangeHandler = (index) => {
    return (e) => {
      this.handleChange(index, e);
    };
  }

  getBlurHandler = (index) => {
    return () => {
      this.validateInput(index);
    };
  }

  renderText(text, i): JSX.Element[] {
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

  validateInput = (i) => {
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

  renderInput = (i) => {
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

  getNegativeConceptResultsForResponse(conceptResults) {
    return hashToCollection(conceptResults).filter(cr => !cr.correct);
  }

  getNegativeConceptResultForResponse(conceptResults) {
    const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
    return negCRs.length > 0 ? negCRs[0] : undefined;
  }

  renderConceptExplanation = () => {
    const { conceptsFeedback, } = this.props
    const latestAttempt:Attempt|undefined = this.getLatestAttempt();
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
    const { question, submitResponse, } = this.props;
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
      this.updateResponseResource(response);
      submitResponse(response);
    }
  }

  setResponse(response) {
    const { setResponse, } = this.props
    if (setResponse) {
      setResponse(response)
    }
  }

  updateResponseResource(response) {
    const { dispatch, } = this.props
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, dispatch);
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

  getLatestAttempt(): Attempt | undefined {
    const { question, } = this.props
    return _.last(question.attempts || []);
  }

  showNextQuestionButton = () => {
    const { question, } = this.props;
    const latestAttempt = this.getLatestAttempt();
    return (question.attempts && question.attempts.length > 4) || (latestAttempt && latestAttempt.response.optimal);
  }

  renderButton = () => {
    const { nextQuestion, question, isLastQuestion, } = this.props
    const { responses, } = this.state
    if (this.showNextQuestionButton()) {
      const buttonText = isLastQuestion ? 'Next' : 'Next question'
      return (
        <button className="quill-button focus-on-light large primary contained" onClick={nextQuestion} type="button">{buttonText}</button>
      );
    } else if (responses) {
      if (question && question.attempts ? question.attempts.length > 0 : false) {
        return <button className="quill-button focus-on-light large primary contained" onClick={this.handleSubmitClick} type="button">Recheck work</button>;
      } else {
        return <button className="quill-button focus-on-light large primary contained" onClick={this.handleSubmitClick} type="button">Submit</button>;
      }
    } else {
      <button className="quill-button focus-on-light large primary contained disabled" type="button">Submit</button>;
    }
  }

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getQuestion={this.getQuestion} />;
  }

  renderFeedback = () => {
    const { question, } = this.props
    const { responses, inputErrors, } = this.state

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
