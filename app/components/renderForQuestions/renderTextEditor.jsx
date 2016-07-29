import React from 'react'
import _ from 'underscore'
import handleFocus from './handleFocus.js'
import {EditorState, ContentState, convertFromHTML, convertToRaw, convertFromRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import {stateToHTML} from 'draft-js-export-html';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
import {getInlineStyleRangeObject} from '../../libs/markupUserResponses';

export default React.createClass({
  getInitialState: function () {
    return {
      text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.value || "")))
    }
  },

  getErrorsForAttempt: function (attempt) {
    console.log("gotten errors: ", _.pick(attempt, 'typingError', 'caseError', 'punctuationError', 'minLengthError', 'maxLengthError'))
    return _.pick(attempt, 'typingError', 'caseError', 'punctuationError', 'minLengthError', 'maxLengthError')
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.latestAttempt !== this.props.latestAttempt) {
      if (nextProps.latestAttempt.found) {
        const parentID = nextProps.latestAttempt.response.parentID
        const nErrors = _.keys(this.getErrorsForAttempt(nextProps.latestAttempt)).length;
        var targetText;
        if (parentID) {
          const parentResponse = this.props.getResponse(nextProps.latestAttempt.response.parentID)
          targetText = parentResponse.text
        } else if (nErrors > 0) {
          targetText = nextProps.latestAttempt.response.text
        }
        console.log("Target text: ", targetText);
        // console.log("New: ", nextProps.latestAttempt.response, "old: ", nextProps.latestAttempt.submitted);
        // const parentResponse = this.props.getResponse(nextProps.latestAttempt.response.parentID)
        // console.log("parentResponse: ", parentResponse)
        const newStyle = getInlineStyleRangeObject(targetText, nextProps.latestAttempt.submitted)
        var state = convertToRaw(this.state.text.getCurrentContent());
        // console.log("state", state)
        state.blocks[0].inlineStyleRanges = [newStyle]
        this.setState({
          text: EditorState.createWithContent(convertFromRaw(state))
        }, () => {
          this.props.handleChange(stateToHTML(this.state.text.getCurrentContent()))
        });
      }
    }
  },

  // getState: function () {
  //   return EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.text || "")))
  // },

  handleTextChange: function (e) {
    this.setState({text: e}, () => {
      this.props.handleChange(convertToRaw(this.state.text.getCurrentContent()).blocks[0].text)
    });
  },

  render: function () {
    return (
      <div className="card is-fullwidth">
        <div className="card-content">
          <div className="content">
            <Editor editorState={this.state.text} onChange={this.handleTextChange}/>
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
