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
      text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.text || "")))
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.boilerplate !== this.props.boilerplate) {
      this.setState({text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(nextProps.boilerplate)))},
      () => {
        this.props.handleTextChange(stateToHTML(this.state.text.getCurrentContent()))
      }
    )
    }
  },

  getState: function () {
    return EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.text || "")))
  },

  handleTextChange: function (e) {
    this.setState({text: e}, () => {
      this.props.handleTextChange(stateToHTML(this.state.text.getCurrentContent()))
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
            <Editor editorState={this.state.text} onChange={this.handleTextChange} plugins={[richButtonsPlugin]}/>
          </div>
        </div>
      </div>
    )
  }

})
