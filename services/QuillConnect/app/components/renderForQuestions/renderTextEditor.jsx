import * as React from 'react';
import _ from 'underscore';
import ContentEditable from 'react-contenteditable';
import { generateStyleObjects } from '../../libs/markupUserResponses';
import { sendActivitySessionInteractionLog } from '../../libs/sendActivitySessionInteractionLog';
import { getParameterByName } from '../../libs/getParameterByName';
const C = require('../../constants').default;

const noUnderlineErrors = [];

const feedbackStrings = C.FEEDBACK_STRINGS;

export default class RenderTextEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      text: props.value || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const { latestAttempt, getResponse, } = this.props
    if (nextProps.latestAttempt !== latestAttempt) {
      if (nextProps.latestAttempt && nextProps.latestAttempt.found) {
        const parentID = nextProps.latestAttempt.response.parentID;
        const errorKeys = _.keys(this.getErrorsForAttempt(nextProps.latestAttempt));
        const nErrors = errorKeys.length;
        let targetText;
        if (parentID) {
          const parentResponse = getResponse(parentID);
          targetText = parentResponse.text;
          const newStyle = this.getUnderliningFunctionFromAuthor(nextProps.latestAttempt.response.author, targetText, nextProps.latestAttempt.submitted);
          if (newStyle) {
            this.applyNewStyle(newStyle);
          }
          return;
        } else if (nErrors > 0) {
          targetText = nextProps.latestAttempt.response.text;
        } else {
          this.clearStyle();
          return;
        }
        const newStyle = this.getUnderliningFunction(errorKeys[0], targetText, nextProps.latestAttempt.submitted);
        if (newStyle) {
          this.applyNewStyle(newStyle);
        }
      }
    }
  }

  setAnswerBoxRef = node => this.answerBox = node

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  }

  getUnderliningFunction(errorType, targetString, userString) {
    switch (errorType) {
      case 'punctuationError':
      case 'typingError':
      case 'caseError':
      case 'modifiedWordError':
      case 'additionalWordError':
      case 'missingWordError':
        return generateStyleObjects(targetString, userString);
      case 'flexibleModifiedWordError':
      case 'flexibleAdditionalWordError':
      case 'flexibleMissingWordError':
        return generateStyleObjects(targetString, userString, true);
      default:
        return undefined;
    }
  }

  getUnderliningFunctionFromAuthor(author, targetString, userString) {
    switch (author) {
      case 'Punctuation Hint':
      case 'Capitalization Hint':
      case 'Modified Word Hint':
      case 'Additional Word Hint':
      case 'Missing Word Hint':
        return generateStyleObjects(targetString, userString);
      case 'Flexible Modified Word Hint':
      case 'Flexible Additional Word Hint':
      case 'Flexible Missing Word Hint':
        return generateStyleObjects(targetString, userString, true);
      default:
        return undefined;
    }
  }

  applyNewStyle(newStyle) {
    if (newStyle.inlineStyleRanges[0]) {
      const offset = newStyle.inlineStyleRanges[0].offset;
      const end = offset + newStyle.inlineStyleRanges[0].length;
      const input = this.refs.answerBox;
      input.selectionStart = offset;
      input.selectionEnd = end;
    }
  }

  clearStyle() {
    const input = this.refs.answerBox;
    input.selectionStart = 0;
    input.selectionEnd = 0;
  }

  handleKeyUp = () => {
    const { questionID, } = this.props
    sendActivitySessionInteractionLog(getParameterByName('student'), { info: 'textbox interaction', current_question: questionID, });
  }

  handleTextChange = (e) => {
    const { disabled, onChange, } = this.props
    if (disabled) { return }

    const stripBTags = e.target.value.replace(/<b>|<\/b>/g, '')
    onChange(stripBTags, this.answerBox);
  }

  handleKeyDown = (e) => {
    const { disabled, onSubmitResponse, } = this.props
    if (disabled || e.key !== 'Enter') { return }

    e.preventDefault();
    onSubmitResponse();
  }

  displayedHTML() {
  const { value, latestAttempt, } = this.props
    if (!(latestAttempt && latestAttempt.response && latestAttempt.response.misspelled_words)) {
      return value
    }
    const wordArray = value.split(' ')
    const newWordArray = wordArray.map(word => {
      const punctuationStrippedWord = word.replace(/[^A-Za-z0-9\s]/g, '')
      if (latestAttempt.response.misspelled_words.includes(punctuationStrippedWord)) {
        return `<b>${word}</b>`
      } else {
        return word
      }
    })

    return newWordArray.join(' ')
  }

  render() {
    const { hasError, disabled, value, spellCheck, placeholder, } = this.props
    const tabIndex = disabled ? -1 : 0
    return (
      <div className={`student text-editor card is-fullwidth ${hasError ? 'error' : ''} ${disabled ? 'disabled-editor' : ''}`}>
        <div className="card-content">
          <div className="content">
            <ContentEditable
              className="connect-text-area"
              data-gramm={false}
              disabled={disabled}
              html={this.displayedHTML()}
              innerRef={this.setAnswerBoxRef}
              onChange={this.handleTextChange}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
              placeholder={placeholder}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
