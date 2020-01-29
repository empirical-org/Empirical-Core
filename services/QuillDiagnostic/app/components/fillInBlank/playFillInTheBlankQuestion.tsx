import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'underscore';
import { checkFillInTheBlankQuestion } from '../../../../../packages/quill-marking-logic/src/libs/graders/fill_in_the_blank'
import { getGradedResponsesWithCallback } from '../../actions/responses.js';
import {
  hashToCollection,
  Prompt,
  Feedback
 } from 'quill-component-library/dist/componentLibrary';
import { submitResponse, } from '../../actions/diagnostics.js';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import Cues from '../renderForQuestions/cues.jsx';
import translations from '../../libs/translations/index.js';
import translationMap from '../../libs/translations/ellQuestionMapper.js';
import { stringNormalize } from 'quill-string-normalizer'

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

    document.addEventListener('keydown', this.handleKeyDown, true)
    this.setQuestionValues(question)
  }

  componentWillReceiveProps(nextProps) {
    const { question, } = this.props
    if (nextProps.question.prompt !== question.prompt) {
      this.setQuestionValues(nextProps.question)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, true)
  }

  handleKeyDown = (e) => {
    if (e.key !== 'Enter') { return }

    e.preventDefault()
    this.handleSubmitResponse()
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
    const { language, } = this.props
    const q = this.getQuestion()
    const textKey = translationMap[q.key];
    let text = q.instructions ? q.instructions : translations.english[textKey];
    if (language && language !== 'english') {
      const textClass = language === 'arabic' ? 'right-to-left' : '';
      text += `<br/><br/><span class="${textClass}">${translations[language][textKey]}</span>`;
    }
    return (<p dangerouslySetInnerHTML={{ __html: text, }} />);
  }

  generateInputs(numberOfInputVals: number) {
    const inputs:Array<string> = [];
    for (let i = 0; i < numberOfInputVals; i+=1) {
      inputs.push('');
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
    const textArray = text.split(' ')
    const spanArray:Array<JSX.Element> = []
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
    const autofocus = i === 0
    return (
      <span key={`span${i}`}>
        <input
          autoFocus={autofocus}
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

  getPromptElements = () => {
    const { splitPrompt, } = this.state

    if (splitPrompt) {
      const l = splitPrompt.length;
      const splitPromptWithInput:Array<JSX.Element|Array<JSX.Element>> = [];
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
    const zipped = _.zip(splitPrompt, inputVals);
    return _.flatten(zipped).join('').trim();
  }

  handleSubmitResponse = () => {
    const { inputErrors, responses, blankAllowed, inputVals, } = this.state
    const { question, nextQuestion, } = this.props
    if (!inputErrors.size && responses) {
      if (!blankAllowed) {
        if (inputVals.filter(Boolean).length !== inputVals.length) {
          inputVals.forEach((val, i) => this.validateInput(i))
          return
        }
      }
      const zippedAnswer = this.zipInputsAndText();
      const questionUID = question.key
      const responsesArray = hashToCollection(responses)
      //const caseSensitive = question.caseSensitive
      const caseSensitive = false
      console.log(caseSensitive)
      const response = {response: checkFillInTheBlankQuestion(questionUID, zippedAnswer, responsesArray, caseSensitive)}
      this.setResponse(response);
      this.updateResponseResource(response);
      this.submitResponse(response);
      this.setState({
        response: '',
      });
      nextQuestion();
    }
  }

  setResponse = (response) => {
    const { setResponse, } = this.props
    if (!setResponse) { return }

    setResponse(response)
  }

  submitResponse = (response) => {
    const { sessionKey, } = this.state
    submitQuestionResponse(response, this.props, sessionKey, submitResponse);
  }

  updateResponseResource = (response) => {
    const { question, dispatch, } = this.props
    updateResponseResource(response, question.key, question.attempts, dispatch);
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
    const { language, } = this.props
    const { blankAllowed, } = this.state
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

  getSubmitButtonText = () => {
    const { language, } = this.props
    let text = translations.english['submit button text'];
    if (language && language !== 'english') {
      text += ` / ${translations[language]['submit button text']}`;
    }
    return text;
  }

  renderFeedback = () => {
    const { question, } = this.props
    const { inputErrors, } = this.state

    if (inputErrors && inputErrors.size) {
      const blankFeedback = question.blankAllowed ? ' or leave it blank' : ''
      const feedbackText = `Choose one of the options provided${blankFeedback}. Make sure it is spelled correctly.`
      const feedback = <p>{feedbackText}</p>
      return (<Feedback
        feedback={feedback}
        feedbackType="revise-unmatched"
      />)
    }

    return <Feedback feedback={this.getInstructionText()} feedbackType="instructions" />
  }

  render() {
    const { language, question, } = this.props
    const { responses, } = this.state

    let fullPageInstructions
    if (question.mediaURL) {
      fullPageInstructions = { display: 'block' }
    } else {
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
                getQuestion={this.getQuestion}
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
