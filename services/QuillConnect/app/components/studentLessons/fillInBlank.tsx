declare function require(name:string): any
import * as React from 'react';
import { connect } from 'react-redux';
import * as  _ from 'underscore';
const qml = require('quill-marking-logic')
const checkFillInTheBlankQuestion = qml.checkFillInTheBlankQuestion
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
// import { submitResponse, } from '../../actions/diagnostics.js';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import Cues from '../renderForQuestions/cues.jsx';
import {
  WarningDialogue,
  Prompt,
  Instructions,
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

    this.checkAnswer = this.checkAnswer.bind(this);
    this.getQuestion = this.getQuestion.bind(this)
    this.getGradedResponsesWithCallback = this.getGradedResponsesWithCallback.bind(this)
    this.setQuestionValues = this.setQuestionValues.bind(this)

    this.state = {}
  }

  componentDidMount() {
    this.setQuestionValues(this.props.question)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.question.prompt !== this.props.question.prompt) {
      this.setQuestionValues(nextProps.question)
    }
  }

  setQuestionValues(question) {
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

  getGradedResponsesWithCallback(question) {
    getGradedResponsesWithCallback(
      question.key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  }

  getQuestion() {
    const { question, } = this.props;
    return question;
  }

  getInstructionText() {
    let instructions;
    const latestAttempt = this.getLatestAttempt();
    if (latestAttempt && latestAttempt.response && latestAttempt.response.feedback) {
      const component = <span dangerouslySetInnerHTML={{__html: latestAttempt.response.feedback}} />
      instructions = latestAttempt.response.feedback ? component :
      'Revise your work. Fill in the blanks with the word or phrase that best fits the sentence.';
    } else if (this.props.question.instructions && this.props.question.instructions !== '') {
      instructions = this.props.question.instructions;
    } else {
      instructions = 'Fill in the blanks with the word or phrase that best fits the sentence.';
    }
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

  handleChange(i, e) {
    const existing = [...this.state.inputVals];
    existing[i] = e.target.value;
    this.setState({
      inputVals: existing,
    });
  }

  getChangeHandler(index) {
    return (e) => {
      this.handleChange(index, e);
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

  validateInput(i) {
    const newErrors = new Set(this.state.inputErrors);
    const inputVal = this.state.inputVals[i] || '';
    const inputSufficient = this.state.blankAllowed ? true : inputVal;
    const cueMatch = (inputVal && this.state.cues.some(c => stringNormalize(c).toLowerCase() === stringNormalize(inputVal).toLowerCase().trim())) || inputVal === ''
    if (inputSufficient && cueMatch) {
      newErrors.delete(i);
    } else {
      newErrors.add(i);
    }

    // following condition will return false if no new errors
    if (newErrors.size) {
      const newInputVals = this.state.inputVals
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

  warningText() {
    const text = 'Use one of the options below';
    return `${text}${this.state.blankAllowed ? ' or leave blank.' : '.'}`;
  }

  chevyStyleRight() {
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

  renderInput(i) {
    let styling:any = styles.input;
    let warning;
    if (this.state.inputErrors.has(i)) {
      warning = this.renderWarning(i);
      styling = Object.assign({}, styling);
      styling.borderColor = '#ff7370';
      styling.borderWidth = '2px';
      delete styling.borderImageSource;
    }
    const longestCue = this.state.cues && this.state.cues.length ? this.state.cues.sort((a, b) => b.length - a.length)[0] : null
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
          onBlur={() => this.validateInput(i)}
          onChange={this.getChangeHandler(i)}
          style={styling}
          type="text"
          value={this.state.inputVals[i]}
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

  renderConceptExplanation() {
    const latestAttempt:Attempt|undefined = this.getLatestAttempt();
    if (latestAttempt && latestAttempt.response && !latestAttempt.response.optimal ) {
      if (latestAttempt.response.conceptResults) {
          const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.conceptResults);
          if (conceptID) {
            const data = this.props.conceptsFeedback.data[conceptID.conceptUID];
            if (data) {
              return <ConceptExplanation {...data} />;
            }
          }
      } else if (latestAttempt.response.concept_results) {
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

  getPromptElements() {
    if (this.state.splitPrompt) {
      const { splitPrompt, } = this.state;
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

  zipInputsAndText() {
    const zipped = _.zip(this.state.splitPrompt, this.state.inputVals);
    return _.flatten(zipped).join('');
  }

  checkAnswer() {
    if (!this.state.inputErrors.size) {
      if (!this.state.blankAllowed) {
        if (this.state.inputVals.length === 0) {
          this.validateInput(0);
          return;
        }
      }
      const zippedAnswer = this.zipInputsAndText();
      const questionUID = this.getQuestion().key
      const responses = hashToCollection(this.state.responses)
      const response = {response: checkFillInTheBlankQuestion(questionUID, zippedAnswer, responses)}
      this.updateResponseResource(response);
      this.props.submitResponse(response);
    }
  }

  setResponse(response) {
    if (this.props.setResponse) {
      this.props.setResponse(response)
    }
  }

  updateResponseResource(response) {
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, this.props.dispatch);
  }

  renderMedia() {
    if (this.getQuestion().mediaURL) {
      return (
        <div className='ell-illustration' style={{ marginTop: 15, minWidth: 200 }}>
          <img src={this.getQuestion().mediaURL} />
        </div>
      );
    }
  }

  customText() {
    // HARDCODED
    let text = 'Add words';
    text = `${text}${this.state.blankAllowed ? ' or leave blank' : ''}`;
    return text;
  }

  getLatestAttempt(): Attempt | undefined {
    return _.last(this.props.question.attempts || []);
  }

  showNextQuestionButton() {
    const { question, } = this.props;
    const latestAttempt = this.getLatestAttempt();
    const readyForNext = (question.attempts && question.attempts.length > 4) || (latestAttempt && latestAttempt.response.optimal);
    if (readyForNext) {
      return true;
    } else {
      return false;
    }
  }

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
      <button className="button student-submit is-disabled" onClick={() => {}}>Submit</button>;
    }
  }

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getQuestion={this.getQuestion} />;
  }

  render() {
    let fullPageInstructions
    if (this.props.language === 'arabic' && !(this.getQuestion().mediaURL)) {
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
              question={this.props.question}
              renderFeedbackStatements={this.renderFeedbackStatements}
              responses={this.state.responses}
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
