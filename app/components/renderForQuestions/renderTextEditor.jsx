import React from 'react'
import _ from 'underscore'
import Textarea from 'react-textarea-autosize';
import {generateStyleObjects} from '../../libs/markupUserResponses';
var C = require("../../constants").default

const noUnderlineErrors = []

const feedbackStrings = C.FEEDBACK_STRINGS

export default React.createClass({
  getInitialState: function () {
    return {
      text: this.props.value || ""
    }
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES)
  },

  componentWillReceiveProps: function (nextProps) {
    var input = this.refs.answerBox // .getDOMNode();
    window.answerBox = input;
            // input.focus();
            // input.setSelectionRange(0, input.value.length);
    if (nextProps.latestAttempt !== this.props.latestAttempt) {
      if (nextProps.latestAttempt && nextProps.latestAttempt.found) {
        const parentID = nextProps.latestAttempt.response.parentID;
        const errorKeys = _.keys(this.getErrorsForAttempt(nextProps.latestAttempt))
        const nErrors = errorKeys.length;
        var targetText;
        if (parentID) {
          const parentResponse = this.props.getResponse(parentID)
          targetText = parentResponse.text
          const newStyle = this.getUnderliningFunctionFromAuthor(nextProps.latestAttempt.response.author, targetText, nextProps.latestAttempt.submitted)
          if (newStyle) {
            this.applyNewStyle(newStyle)
          }
          return
        } else if (nErrors > 0) {
          targetText = nextProps.latestAttempt.response.text
        } else {
          this.clearStyle()
          return
        }
        const newStyle = this.getUnderliningFunction(errorKeys[0], targetText, nextProps.latestAttempt.submitted)
        if (newStyle) {
          this.applyNewStyle(newStyle)
        }
      }
    }
  },

  getUnderliningFunction: function (errorType, targetString, userString) {
    switch (errorType) {
      case "punctuationError":
      case "typingError":
      case "caseError":
      case "modifiedWordError":
      case "additionalWordError":
      case "missingWordError":
        return generateStyleObjects(targetString, userString)
      case "flexibleModifiedWordError":
      case "flexibleAdditionalWordError":
      case "flexibleMissingWordError":
        return generateStyleObjects(targetString, userString, true)
      default:
        return undefined
    }
  },

  getUnderliningFunctionFromAuthor: function (author, targetString, userString) {
    switch (author) {
      case "Punctuation Hint":
      case "Capitalization Hint":
      case "Modified Word Hint":
      case "Additional Word Hint":
      case "Missing Word Hint":
        return generateStyleObjects(targetString, userString)
      case "Flexible Modified Word Hint":
      case "Flexible Additional Word Hint":
      case "Flexible Missing Word Hint":
        return generateStyleObjects(targetString, userString, true)
      default:
        return undefined
    }
  },

  applyNewStyle: function (newStyle) {
    if (newStyle.inlineStyleRanges[0]) {
      const offset = newStyle.inlineStyleRanges[0].offset;
      const end = offset + newStyle.inlineStyleRanges[0].length
      var input = this.refs.answerBox;
      input.selectionStart = offset
      input.selectionEnd = end
    }
  },

  clearStyle: function () {
    var input = this.refs.answerBox;
    input.selectionStart = 0
    input.selectionEnd = 0
  },

  handleTextChange: function (e) {
    if (!this.props.disabled) {
      if (e.key === 13 /* `Enter` key */) {
        this.props.checkAnswer()
      } else {
        this.setState({text: e.target.value}, () => {
          this.props.handleChange(this.state.text)
        });
      }
    }
  },

  handleKeyDown: function (e) {
    if (!this.props.disabled) {
      if (e.key === "Enter") {
        e.preventDefault()
        this.props.checkAnswer()
      }
    }
  },

  render: function () {
    return (
      <div className={"student text-editor card is-fullwidth " + (this.props.disabled ? 'disabled-editor' : '')}>
        <div className="card-content">
          <div className="content">
            <Textarea
              value={this.state.text}
              onChange={this.handleTextChange}
              onKeyDown={this.handleKeyDown}
              placeholder="Type your answer here. Remember, your answer should be just one sentence."
              ref="answerBox"
              className="connect-text-area"
            ></Textarea>
          </div>
        </div>
      </div>
    )
  }
})
