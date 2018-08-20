import React from 'react';
import _ from 'underscore';
import Textarea from 'react-textarea-autosize';
import { generateStyleObjects } from '../../libs/markupUserResponses';
import { getParameterByName } from '../../libs/getParameterByName';
import { sendActivitySessionInteractionLog } from '../../libs/sendActivitySessionInteractionLog';

const C = require('../../constants').default;

const noUnderlineErrors = [];

const feedbackStrings = C.FEEDBACK_STRINGS;

const timeBetweenActivitySessionInteractionLogsInMS = 5000;

export default React.createClass({
  getInitialState() {
    return {
      text: this.props.value || '',
    };
  },

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  },

  reportActivtySessionTextBoxInteraction() {
    sendActivitySessionInteractionLog(getParameterByName('student'), { info: 'textbox interaction', });
  },

  componentWillMount() {
    this.reportActivtySessionTextBoxInteraction = _.debounce(
      this.reportActivtySessionTextBoxInteraction,
      timeBetweenActivitySessionInteractionLogsInMS,
      true
    );
  },

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
  },

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
  },

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
  },

  applyNewStyle(newStyle) {
    if (newStyle.inlineStyleRanges[0]) {
      const offset = newStyle.inlineStyleRanges[0].offset;
      const end = offset + newStyle.inlineStyleRanges[0].length;
      const input = this.refs.answerBox;
      input.selectionStart = offset;
      input.selectionEnd = end;
    }
  },

  clearStyle() {
    const input = this.refs.answerBox;
    input.selectionStart = 0;
    input.selectionEnd = 0;
  },

  handleTextChange(e) {
    if (!this.props.disabled) {
      this.props.handleChange(e.target.value, this.props.editorIndex);
    } else {
      console.log("I'm disable RN");
    }
  },

  handleKeyDown(e) {
    if (!this.props.disabled) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.props.checkAnswer();
      }
    }
  },

  render() {
    return (
      <div className={`student text-editor card is-fullwidth ${this.props.hasError ? 'red-outline' : ''} ${this.props.disabled ? 'disabled-editor' : ''}`}>
        <div className="card-content">
          <div className="content">
            <Textarea
              spellCheck={this.props.spellCheck || false}
              autoCapitalize="off"
              autoCorrect="off"
              value={this.props.value}
              onInput={this.handleTextChange}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.reportActivtySessionTextBoxInteraction}
              placeholder={this.props.placeholder}
              ref="answerBox"
              className="connect-text-area"
              autoFocus
            />
          </div>
        </div>
      </div>
    );
  },
});
