declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import * as  _ from 'underscore';
const qml = require('quill-marking-logic')
const checkFillInTheBlankQuestion = qml.checkFillInTheBlankQuestion
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import { hashToCollection } from '../../libs/hashToCollection';
// import { submitResponse, } from '../../actions/diagnostics.js';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import Cues from '../renderForQuestions/cues.jsx';
import WarningDialogue from '../fillInBlank/warningDialogue.jsx'
import Prompt from '../fillInBlank/prompt.jsx'
import Instructions from '../fillInBlank/instructions.jsx'
import Feedback from '../renderForQuestions/feedback'
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';

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
    marginRight: 10,
  },
};

export class PlayFillInTheBlankQuestion extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    const q = this.getQuestion();
    const splitPrompt = q ? q.prompt.split('___') : '';
    this.state = {
      splitPrompt,
      inputVals: this.generateInputs(splitPrompt),
      inputErrors: new Set(),
      cues: q.cues,
      blankAllowed: q.blankAllowed,
    };
  }

  componentDidMount() {
    getGradedResponsesWithCallback(
      this.getQuestion().key,
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
    if (latestAttempt) {
      const component = <span dangerouslySetInnerHTML={{__html: latestAttempt.response.feedback}}/>
      instructions = latestAttempt.response.feedback ? component :
      'Revise your work. Fill in the blanks with the word or phrase that best fits the sentence.';
    } else if (this.props.question.instructions && this.props.question.instructions !== '') {
      instructions = this.props.question.instructions;
    } else {
      instructions = 'Fill in the blanks with the word or phrase that best fits the sentence.';
    }
  }

  generateInputs(promptArray) {
    const inputs:Array<string> = [];
    for (let i = 0; i < promptArray.length - 2; i++) {
      inputs.push('');
    }
    return inputs;
  }

  handleChange(i, e) {
    const existing = [...this.state.inputVals];
    existing[i] = e.target.value.trim();
    this.setState({
      inputVals: existing,
    });
  }

  getChangeHandler(index) {
    return (e) => {
      this.handleChange(index, e);
    };
  }

  renderText(text, i) {
    let style = {};
    if (text.length > 0) {
      style = styles.text;
    }
    return <span key={i} style={style}>{text}</span>;
  }

  validateInput(i) {
    const newErrors = new Set(this.state.inputErrors);
    const inputVal = this.state.inputVals[i] || '';
    const inputSufficient = this.state.blankAllowed ? true : inputVal;

    if (!inputSufficient || (inputVal && this.state.cues.indexOf(inputVal.toLowerCase()) === -1)) {
      newErrors.add(i);
    } else {
      newErrors.delete(i);
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
    const rectangle:ClientRect|null = document.getElementById(`input${i}`) && document.getElementById(`input${i}`).getBoundingClientRect();
    let chevyStyle:any = this.chevyStyleLeft();
    if (rectangle && body && rectangle.left > (body.width / 2)) {
      warningStyle.right = '-73px';
      chevyStyle = this.chevyStyleRight();
    }
    return (
      <WarningDialogue
        key={`warning${i}`}
        style={warningStyle}
        chevyStyle={chevyStyle}
        text={this.warningText()}
      />
    );
  }

  warningText() {
    const text = 'Use one of the words below';
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
    return (
      <span key={`span${i}`}>
        <div style={{ position: 'relative', height: 0, width: 0, }}>
          {warning}
        </div>
        <input
          id={`input${i}`}
          key={i + 100}
          style={styling}
          type="text"
          onChange={this.getChangeHandler(i)}
          value={this.state.inputVals[i]}
          onBlur={() => this.validateInput(i)}
        />
      </span>
    );
  }

  getPromptElements() {
    if (this.state.splitPrompt) {
      const { splitPrompt, } = this.state;
      const l = splitPrompt.length;
      const splitPromptWithInput:Array<JSX.Element> = [];
      splitPrompt.forEach((section, i) => {
        if (i !== l - 1) {
          splitPromptWithInput.push(this.renderText(section, i));
          splitPromptWithInput.push(this.renderInput(i));
        } else {
          splitPromptWithInput.push(this.renderText(section, i));
        }
      });
      return splitPromptWithInput;
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

  getLatestAttempt() {
    return _.last(this.props.question.attempts || []);
  }

  showNextQuestionButton() {
    const { question, } = this.props;
    const latestAttempt = this.getLatestAttempt();
    const readyForNext =
      question.attempts ? question.attempts.length > 4 : false || (latestAttempt && latestAttempt.response.optimal);
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
    return (
      <div className="student-container-inner-diagnostic">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={fullPageInstructions}>
            <div>
              <Prompt style={styles.container} elements={this.getPromptElements()} />
              <Cues
                getQuestion={this.getQuestion}
                customText={this.customText()}
                displayArrowAndText={true}
              />
              <Feedback
                question={this.props.question}
                sentence={this.getInstructionText()}
                responses={this.state.responses}
                getQuestion={this.getQuestion}
                renderFeedbackStatements={this.renderFeedbackStatements}
              />
            </div>
          </div>
          {this.renderMedia()}
        </div>
        <div style={{marginTop: 20}} className="question-button-group button-group">
          {this.renderButton()}
        </div>
      </div>
    );
  }

}

function select(props) {
  return {
  };
}

export default connect(select)(PlayFillInTheBlankQuestion);
