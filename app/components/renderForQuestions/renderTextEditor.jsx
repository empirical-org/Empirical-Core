import React from 'react'
import _ from 'underscore'
import handleFocus from './handleFocus.js'
import {EditorState, ContentState, convertFromHTML, convertToRaw, convertFromRaw, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;
import Editor from 'draft-js-plugins-editor';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import {stateToHTML} from 'draft-js-export-html';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
import {generateStyleObjects} from '../../libs/markupUserResponses';
var C = require("../../constants").default

const noUnderlineErrors = []

const feedbackStrings = C.FEEDBACK_STRINGS

export default React.createClass({
  getInitialState: function () {
    return {
      text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.value || "")))
    }
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES)
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.latestAttempt !== this.props.latestAttempt) {
      if (nextProps.latestAttempt && nextProps.latestAttempt.found) {
        const parentID = nextProps.latestAttempt.response.parentID;
        const errorKeys = _.keys(this.getErrorsForAttempt(nextProps.latestAttempt))
        const nErrors = errorKeys.length;
        var targetText;
        if (parentID) {
          const parentResponse = this.props.getResponse(nextProps.latestAttempt.response.parentID)
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
    var state = convertToRaw(this.state.text.getCurrentContent());
    state.blocks[0].text = newStyle.text;
    state.blocks[0].inlineStyleRanges = newStyle.inlineStyleRanges
    this.setState({
      text: EditorState.createWithContent(convertFromRaw(state))
    }, () => {
      this.props.handleChange(stateToHTML(this.state.text.getCurrentContent()).blocks[0].text)
    });
  },

  clearStyle: function () {
    var state = convertToRaw(this.state.text.getCurrentContent());
    state.blocks[0].inlineStyleRanges = []
    this.setState({
      text: EditorState.createWithContent(convertFromRaw(state))
    }, () => {
      this.props.handleChange(stateToHTML(this.state.text.getCurrentContent()))
    });
  },

  // getState: function () {
  //   return EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.text || "")))
  // },

  handleKeyCommand: function (command) {
    if (command === 'student-editor-submit') {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      this.props.checkAnswer()
      return "handled"
    }
    return 'not-handled';
  },

  myKeyBindingFn: function (e) {
    if (e.keyCode === 13 /* `S` key */) {
      return 'student-editor-submit';
    }
    return getDefaultKeyBinding(e);
  },

  handleTextChange: function (e) {
    if (!this.props.disabled) {
      this.setState({text: e}, () => {
        this.props.handleChange(convertToRaw(this.state.text.getCurrentContent()).blocks[0].text)
      });
    }
  },

  render: function () {
    return (
      <div className={"student text-editor card is-fullwidth " + (this.props.disabled ? 'disabled-editor' : '')}>
        <div className="card-content">
          <div className="content">
            <Editor
              editorState={this.state.text}
              onChange={this.handleTextChange}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.myKeyBindingFn}
            />
          </div>
        </div>
      </div>
    )
  }

})

// export default React.createClass({
//
//   render: function() {
//     return (
//       <div className="control">
//         <Textarea className={this.props.className} onFocus={handleFocus}
//                   defaultValue={this.props.defaultValue} onChange={this.props.handleChange} value={this.props.value}
//                   placeholder="Type your answer here. Rememeber, your answer should be just one sentence." />
//       </div>
//     )
//   }
// })
