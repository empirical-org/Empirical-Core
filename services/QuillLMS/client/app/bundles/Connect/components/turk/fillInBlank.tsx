declare function require(name:string);

import { stringNormalize } from 'quill-string-normalizer';
import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'underscore';

import { Feedback, fillInBlankInputLabel, hashToCollection, Prompt } from '../../../Shared/index';
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import Cues from '../renderForQuestions/cues.jsx';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';

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
    marginRight: 10,
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
    const splitPrompt = q.prompt.replace(/<p>/g, '').replace(/<\/p>/g, '').split('___');
    const numberOfInputVals = q.prompt.match(/___/g).length
    this.setState({
      splitPrompt,
      inputVals: this.generateInputs(numberOfInputVals),
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
    const { question, } = this.props
    return question
  }

  getInstructionText = () => {
    const q = this.getQuestion()
    let text = q.instructions
    return (<p dangerouslySetInnerHTML={{ __html: text, }} />);
  }

  generateInputs(numberOfInputVals: number) {
    const inputs:Array<string> = [];
    for (let i = 0; i < numberOfInputVals; i+=1) {
      inputs.push('');
    }
    return inputs;
  }

  updateResponseResource = (response) => {
    const { dispatch, } = this.props

    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, dispatch);
  }

  handleChange(i, e) {
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
    const cueMatch = (inputVal && cues.some(c => stringNormalize(c).toLowerCase() === stringNormalize(inputVal).toLowerCase())) || inputVal === ''
    if (inputSufficient && cueMatch) {
      newErrors.delete(i);
    } else {
      newErrors.add(i);
    }
    // following condition will return false if no new errors
    if (newErrors.size) {
      const newInputVals = inputVals
      this.setState({ inputErrors: newErrors, inputVals: newInputVals })
    } else {
      this.setState({ inputErrors: newErrors });
    }
  }

  renderInput = (i) => {
    const { inputErrors, cues, inputVals, blankAllowed, } = this.state
    let className = 'fill-in-blank-input'
    if (inputErrors.has(i)) {
      className += ' error'
    }
    const longestCue = cues && cues.length ? cues.sort((a, b) => b.length - a.length)[0] : null
    const width = longestCue ? (longestCue.length * 15) + 10 : 50
    const styling = { width: `${width}px`}
    return (
      <input
        aria-label={fillInBlankInputLabel(cues, blankAllowed)}
        className={className}
        id={`input${i}`}
        key={i + 100}
        onBlur={this.getBlurHandler(i)}
        onChange={this.getChangeHandler(i)}
        style={styling}
        type="text"
        value={inputVals[i]}
      />
    );
  }

  getPromptElements = () => {
    const { splitPrompt, } = this.state;
    if (!splitPrompt) { return }

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

  zipInputsAndText = () => {
    const { splitPrompt, inputVals, } = this.state
    const trimmedInputVals = inputVals.map(iv => iv.trim())
    const zipped = _.zip(splitPrompt, trimmedInputVals);
    return _.flatten(zipped).join('').trim();
  }

  handleSubmitResponse = () => {
    const { inputErrors, blankAllowed, inputVals, responses, } = this.state;
    const { question, submitResponse, nextQuestion,} = this.props;
    const { caseInsensitive, conceptID, key } = question;

    if (!inputErrors.size) {
      if (!blankAllowed) {
        if (inputVals.filter(Boolean).length !== inputVals.length) {
          inputVals.forEach((val, i) => this.validateInput(i))
          return
        }
      }
      const zippedAnswer = this.zipInputsAndText();
      const defaultConceptUID = conceptID;
      const questionUID = key;
      const responsesArray = hashToCollection(responses);
      const response = {response: checkFillInTheBlankQuestion(questionUID, zippedAnswer, responsesArray, caseInsensitive, defaultConceptUID)}
      this.setResponse(response);
      this.updateResponseResource(response)
      submitResponse(response);
      this.setState({
        response: '',
      });
      nextQuestion();
    }
  }

  setResponse(response) {
    const { setResponse, } = this.props
    if (setResponse) {
      setResponse(response)
    }
  }

  renderMedia = () => {
    const { question, } = this.props
    if (question.mediaURL) {
      return (
        <div className='ell-illustration' style={{ marginTop: 15, minWidth: 200 }}>
          <img alt={question.mediaAlt} src={question.mediaURL} />
        </div>
      );
    }
  }

  customText = () => {
    const cuesLabel = this.getQuestion().cuesLabel
    if (cuesLabel) {
      return cuesLabel
    }
  }

  getSubmitButtonText = () => {
    return 'Submit';
  }

  renderFeedback = () => {
    const { question, } = this.props
    const { inputErrors, } = this.state

    if (inputErrors && inputErrors.size) {
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

    return <Feedback feedback={this.getInstructionText()} feedbackType="instructions" />
  }

  render() {
    const { language, question, } = this.props
    const { responses, } = this.state
    let fullPageInstructions: any = { display: 'block' }
    if (language === 'arabic' && !(question.mediaURL)) {
      fullPageInstructions = { maxWidth: 800, width: '100%' }
    }
    const button = responses ? <button className="quill-button focus-on-light large primary contained" onClick={this.handleSubmitResponse} type="button">{this.getSubmitButtonText()}</button> : <button className="quill-button focus-on-light large primary contained disabled" type="button">Submit</button>;
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
          {button}
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
