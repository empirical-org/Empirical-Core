declare function require(name:string);
import * as React from 'react';
import * as  _ from 'underscore';
const qml = require('quill-marking-logic')
const checkFillInTheBlankQuestion = qml.checkFillInTheBlankQuestion
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import Cues from '../renderForQuestions/cues.jsx';
import {
  WarningDialogue,
  Prompt,
  hashToCollection,
  ConceptExplanation
} from 'quill-component-library/dist/componentLibrary'
import Feedback from '../renderForQuestions/feedback'
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import { Attempt } from '../renderForQuestions/answerState.js';
import { stringNormalize } from 'quill-string-normalizer';

const styles = {
  container: {
    marginTop: 35,
    marginBottom: 18,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontSize: 24,
  },
  input: {
    color: '#3D3D3D',
    fontSize: 24,
    marginRight: 10,
    width: 75,
    textAlign: 'center',
    boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderImageSource: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1) 5%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0))',
    borderImageSlice: 1,
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

  componentWillReceiveProps(nextProps) {
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

  renderWarning(i) {
    const warningStyle:any = {
      border: '1px #ff3730 solid',
      color: '#ff3730',
      fontSize: '14px',
      top: '-34px',
      position: 'absolute',
      textAlign: 'center',
      backgroundColor: 'white',
      borderRadius: '3px',
      height: '26px',
      zIndex: '100',
      padding: '2px 7px',
    };
    const body:ClientRect|null = document.getElementsByTagName('body')[0].getBoundingClientRect();
    const inputFromDom:HTMLElement|null = document.getElementById(`input${i}`)
    const rectangle:ClientRect|null =  inputFromDom ? inputFromDom.getBoundingClientRect() : null;
    let chevyStyle:any = this.chevyStyleLeft();
    if (rectangle && body && rectangle.left > (body.width / 2)) {
      warningStyle.right = '-73px';
      chevyStyle = this.chevyStyleRight();
    }
    return (
      <WarningDialogue
        chevyStyle={chevyStyle}
        key={`warning${i}`}
        style={warningStyle}
        text={this.warningText()}
      />
    );
  }

  warningText = () => {
    const { blankAllowed, } = this.state
    const text = 'Use one of the options below';
    return `${text}${blankAllowed ? ' or leave blank.' : '.'}`;
  }

  chevyStyleRight = () => {
    return {
      float: 'right',
      marginRight: '20px',
      position: 'relative',
      top: '-3px',
    };
  }

  chevyStyleLeft():object {
    return {
      float: 'left',
      marginLeft: '20px',
      position: 'relative',
      top: '-3px',
    };
  }

  renderInput = (i) => {
    const { inputErrors, cues, inputVals, } = this.state
    let styling:any = styles.input;
    let warning;
    if (inputErrors.has(i)) {
      warning = this.renderWarning(i);
      styling = Object.assign({}, styling);
      styling.borderColor = '#ff7370';
      styling.borderWidth = '2px';
      delete styling.borderImageSource;
    }
    const longestCue = cues && cues.length ? cues.sort((a, b) => b.length - a.length)[0] : null
    const width = longestCue ? (longestCue.length * 15) + 10 : 50
    styling.width = `${width}px`
    return (
      <span key={`span${i}`}>
        <div style={{ position: 'relative', height: 0, width: 0, }}>
          {warning}
        </div>
        <input
          autoComplete="off"
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

    const zipped = _.zip(splitPrompt, inputVals);
    return _.flatten(zipped).join('');
  }

  handleSubmitClick = () => {
    const { submitResponse, } = this.props
    const { inputErrors, blankAllowed, inputVals, responses, } = this.state
    if (!inputErrors.size) {
      if (!blankAllowed) {
        if (inputVals.length === 0) {
          this.validateInput(0);
          return;
        }
      }
      const zippedAnswer = this.zipInputsAndText();
      const questionUID = this.getQuestion().key
      const responsesArray = hashToCollection(responses)
      const response = {response: checkFillInTheBlankQuestion(questionUID, zippedAnswer, responsesArray)}
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
    const { nextQuestion, question, } = this.props
    const { responses, } = this.state
    if (this.showNextQuestionButton()) {
      return (
        <button className="quill-button large primary contained" onClick={nextQuestion} type="button">Next</button>
      );
    } else if (responses) {
      if (question && question.attempts ? question.attempts.length > 0 : false) {
        return <button className="quill-button large primary contained" onClick={this.handleSubmitClick} type="button">Recheck work</button>;
      } else {
        return <button className="quill-button large primary contained" onClick={this.handleSubmitClick} type="button">Submit</button>;
      }
    } else {
      <button className="quill-button large primary contained disabled" type="button">Submit</button>;
    }
  }

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getQuestion={this.getQuestion} />;
  }

  render() {
    const { language, question, } = this.props
    const { responses, } = this.state
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
            <Feedback
              getQuestion={this.getQuestion}
              question={question}
              renderFeedbackStatements={this.renderFeedbackStatements}
              responses={responses}
              sentence={this.getInstructionText()}
            />
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
