import React from 'react';
import _ from 'underscore';
import ContentEditable from 'react-sane-contenteditable';
import { generateStyleObjects } from '../../libs/markupUserResponses';
import { getParameterByName } from '../../libs/getParameterByName';
import { sendActivitySessionInteractionLog } from '../../libs/sendActivitySessionInteractionLog';

const C = require('../../constants').default;

const noUnderlineErrors = [];

const feedbackStrings = C.FEEDBACK_STRINGS;

const timeBetweenActivitySessionInteractionLogsInMS = 2000;

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      text: this.props.value || '',
    }
  }

  componentWillMount() {
    this.reportActivtySessionTextBoxInteraction = _.debounce(
      this.reportActivtySessionTextBoxInteraction,
      timeBetweenActivitySessionInteractionLogsInMS,
      true
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.latestAttempt !== this.props.latestAttempt) {
      if (nextProps.latestAttempt && nextProps.latestAttempt.found) {
        const parentID = nextProps.latestAttempt.response.parentID;
        const errorKeys = _.keys(this.getErrorsForAttempt(nextProps.latestAttempt));
        const nErrors = errorKeys.length;
        let targetText;
        if (parentID) {
          const parentResponse = this.props.getResponse(parentID);
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

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  }

  reportActivtySessionTextBoxInteraction() {
    sendActivitySessionInteractionLog(getParameterByName('student'), { info: 'textbox interaction', current_question: this.props.questionID, });
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
      const input = this.answerBox;
      input.selectionStart = offset;
      input.selectionEnd = end;
    }
  }

  clearStyle() {
    const input = this.refs.answerBox;
    input.selectionStart = 0;
    input.selectionEnd = 0;
  }

  handleTextChange = (e, value) => {
    if (!this.props.disabled) {
      const stripBTags = value.replace(/<b>|<\/b>/g, '')
      this.props.handleChange(stripBTags, this.props.editorIndex);
    }
  }

  handleKeyDown = (e) => {
    if (!this.props.disabled) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.props.checkAnswer();
      }
    }
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
    const { disabled, hasError, placeholder, spellCheck, } = this.props
    return (
      <div className={`student text-editor card is-fullwidth ${hasError ? 'red-outline' : ''} ${disabled ? 'disabled-editor' : ''}`}>
        <div className="card-content">
          <div className="content">
            <ContentEditable
              className="connect-text-area"
              content={this.displayedHTML()}
              editable={!disabled}
              innerRef={node => this.answerBox = node}
              onChange={this.handleTextChange}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.reportActivtySessionTextBoxInteraction}
              placeholder={placeholder}
              spellCheck={spellCheck || false}
            />
          </div>
        </div>
      </div>
    );
  }
}
