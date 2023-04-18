import React from 'react';
import Textarea from 'react-textarea-autosize';
import _ from 'underscore';
import { generateStyleObjects } from '../../libs/markupUserResponses';
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

  componentDidMount() {
    window.addEventListener('paste', (e) => {
      e.preventDefault()
      return false
    }, true);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  handleTextChange = (e) => {
    const { disabled, onChange, editorIndex, } = this.props
    if (disabled) { return }

    onChange(e.target.value, editorIndex);
  }

  handleDrop = (e) => e.preventDefault()

  handleKeyDown = (e) => {
    const { disabled, onSubmitResponse, } = this.props
    if (disabled || e.key !== 'Enter') { return }

    e.preventDefault();
    onSubmitResponse();
  }

  render() {
    const { hasError, disabled, value, spellCheck, placeholder, } = this.props
    return (
      <div className={`student text-editor card is-fullwidth ${hasError ? 'error' : ''} ${disabled ? 'disabled-editor' : ''}`}>
        <div className="card-content">
          <div className="content">
            <Textarea
              autoCapitalize="off"
              autoCorrect="off"
              className="connect-text-area"
              onDrop={this.handleDrop}
              onInput={this.handleTextChange}
              onKeyDown={this.handleKeyDown}
              placeholder={placeholder}
              ref="answerBox"
              spellCheck={spellCheck || false}
              value={value}
            />
          </div>
        </div>
      </div>
    );
  }
}
