import React from 'react';
import { EditorState } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert'
import Editor from 'draft-js-plugins-editor';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
const richButtonsPlugin = createRichButtonsPlugin();
const {
  // inline buttons
  ItalicButton, BoldButton, UnderlineButton,
  // block buttons
  BlockquoteButton, ULButton,
} = richButtonsPlugin;

export default React.createClass({
  getInitialState() {
    return {
      text: EditorState.createWithContent(convertFromHTML(this.props.text || '')),
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.boilerplate !== this.props.boilerplate) {
      this.setState({ text: EditorState.createWithContent(convertFromHTML(nextProps.boilerplate)), },
      () => {
        this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()));
      }
    );
    }
  },

  getState() {
    return EditorState.createWithContent(convertFromHTML(this.props.text || ''));
  },

  handleTextChange(e) {
    this.setState({ text: e, }, () => {
      this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()));
    });
  },

  render() {
    return (
      <div className="card is-fullwidth">
        <header className="card-header">
          <div className="myToolbar" style={{ margin: '1em', }}>
            <BoldButton />
            <ItalicButton />
            <UnderlineButton />
            <BlockquoteButton />
            <ULButton />
          </div>
        </header>
        <div className="card-content">
          <div className="content">
            <Editor editorState={this.state.text} onChange={this.handleTextChange} plugins={[richButtonsPlugin]} />
          </div>
        </div>
      </div>
    );
  },

});
