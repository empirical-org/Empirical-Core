import React from 'react';
import {EditorState, ContentState, convertFromHTML, convertToRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import {stateToHTML} from 'draft-js-export-html';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
const richButtonsPlugin = createRichButtonsPlugin();
const {
  // inline buttons
  ItalicButton, BoldButton, UnderlineButton,
  // block buttons
  BlockquoteButton
} = richButtonsPlugin;

export default React.createClass({
  getInitialState: function () {
    return {
      feedback: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.feedback || "")))
    }
  },

  handleFeedbackChange: function (e) {
    this.setState({feedback: e}, () => {
      this.props.handleFeedbackChange(stateToHTML(this.state.feedback.getCurrentContent()))
    });
  },

  render: function () {
    return (
      <div className="card is-fullwidth">
        <header className="card-header">
          <div className="myToolbar" style={{margin: '1em'}}>
            <BoldButton/>
            <ItalicButton/>
            <UnderlineButton/>
            <BlockquoteButton/>
          </div>
        </header>
        <div className="card-content">
          <div className="content">
            <Editor editorState={this.state.feedback} onChange={this.handleFeedbackChange} plugins={[richButtonsPlugin]}/>
          </div>
        </div>
      </div>
    )
  }

})
