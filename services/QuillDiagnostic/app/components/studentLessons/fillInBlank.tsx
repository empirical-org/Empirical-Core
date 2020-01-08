declare function require(name:string);
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
import translations from '../../libs/translations/index.js';
import translationMap from '../../libs/translations/ellQuestionMapper.js';
import {
  hashToCollection,
  WarningDialogue,
  Prompt,
  Instructions
} from 'quill-component-library/dist/componentLibrary'
import Feedback from '../renderForQuestions/feedback'
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import { Attempt } from '../renderForQuestions/answerState.js';

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

    const q = this.getQuestion();
    const splitPrompt = q.prompt.split('___');

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

  getQuestion = () => {
    const { question, } = this.props;
    return question;
  }

  getInstructionText() {
    const { language, } = this.props
    const textKey = translationMap[this.getQuestion().key];
    let text = translations.english[textKey];
    if (language && language !== 'english') {
      const textClass = language === 'arabic' ? 'right-to-left' : '';
      text += `<br/><br/><span class="${textClass}">${translations[language][textKey]}</span>`;
    }
    return (<p dangerouslySetInnerHTML={{ __html: text, }} />);
  }

  generateInputs(promptArray) {
    const inputs:Array<string> = [];
    for (let i = 0; i < promptArray.length - 2; i+=1) {
      inputs.push('');
    }
    return inputs;
  }

  handleChange = (i, e) => {
    const { inputVals, } = this.state
    const existing = [...inputVals];
    existing[i] = e.target.value.trim();
    this.setState({
      inputVals: existing,
    });
  }

  getChangeHandler = index => {
    return (e) => {
      this.handleChange(index, e);
    };
  }

  getBlurHandler = index => {
    return () => {
      this.validateInput(index)
    }
  }

  renderText(text, i) {
    let style = {};
    if (text.length > 0) {
      style = styles.text;
    }
    return <span key={i} style={style}>{text}</span>;
  }

  validateInput = (i) => {
    const { inputErrors, inputVals, blankAllowed, cues, } = this.state
    const newErrors = new Set(inputErrors);
    const inputVal = inputVals[i] || '';
    const inputSufficient = blankAllowed ? true : inputVal;

    if (!inputSufficient || (inputVal && cues.indexOf(inputVal.toLowerCase()) === -1)) {
      newErrors.add(i);
    } else {
      newErrors.delete(i);
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

  renderInput = (i) => {
    const { inputErrors, inputVals, } = this.state
    let styling:any = styles.input;
    let warning;
    if (inputErrors.has(i)) {
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
          onBlur={this.getBlurHandler(i)}
          onChange={this.getChangeHandler(i)}
          style={styling}
          type="text"
          value={inputVals[i]}
        />
      </span>
    );
  }

  getPromptElements = () => {
    const { splitPrompt, } = this.state
    if (splitPrompt) {
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

  zipInputsAndText = () => {
    const { splitPrompt, inputVals, } = this.state
    const zipped = _.zip(splitPrompt, inputVals);
    return _.flatten(zipped).join('');
  }

  handleSubmitResponse = () => {
    const { inputErrors, blankAllowed, inputVals, responses, } = this.state
    const { submitResponse, } = this.props
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

  setResponse = (response) => {
    const { setResponse, } = this.props
    if (!setResponse) { return }

    setResponse(response)
  }

  updateResponseResource = (response) => {
    const { dispatch, } = this.props
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, dispatch);
  }

  renderMedia() {
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
    const { language, } = this.props
    const cuesLabel = this.getQuestion().cuesLabel
    if (cuesLabel) {
      return cuesLabel
    } else {
      let text = translations.english['add word bank cue'];
      text = `${text}${blankAllowed ? ' or leave blank' : ''}`;
      if (language && language !== 'english') {
        text += ` / ${translations[language]['add word bank cue']}`;
      }
      return text;
    }
  }

  getLatestAttempt = (): Attempt | undefined => {
    const { question, } = this.props
    return _.last(question.attempts || []);
  }

  showNextQuestionButton = () => {
    const { question, } = this.props;
    const latestAttempt = this.getLatestAttempt();
    return (question.attempts.length > 4 || (latestAttempt && latestAttempt.response.optimal))
  }

  renderButton = () => {
    const { nextQuestion, question, } = this.props
    const { responses, } = this.state
    if (this.showNextQuestionButton()) {
      return (
        <button className="button student-submit" onClick={nextQuestion} type="button">Next</button>
      );
    } else if (responses) {
      if (question.attempts.length > 0) {
        const buttonClass = "button student-recheck";
        return <button className={buttonClass} onClick={this.handleSubmitResponse} type="button">Recheck Your Answer</button>;
      } else {
        return <button className="button student-submit" onClick={this.handleSubmitResponse} type="button">Submit</button>;
      }
    } else {
      <button className="button student-submit is-disabled" type="button">Submit</button>;
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
    return (
      <div className="student-container-inner-diagnostic">
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
      </div>
    );
  }

}

function select(props) {
  return {
  };
}

export default connect(select)(PlayFillInTheBlankQuestion);
