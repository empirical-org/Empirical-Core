import React from 'react';
import { EditorState, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { convertFromHTML, convertToHTML } from 'draft-convert'
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';

const richButtonsPlugin = createRichButtonsPlugin();
const {
  // inline buttons
  ItalicButton, BoldButton, UnderlineButton,
  // block buttons
  BlockquoteButton, ULButton, H3Button
} = richButtonsPlugin;

export default React.createClass({
  getInitialState: function () {
    console.log(this.props.text)
    return {
      text: EditorState.createWithContent(convertFromHTML(this.props.text || ''))
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.boilerplate !== this.props.boilerplate) {
      this.setState({text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(nextProps.boilerplate)))},
      () => {
        this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()))
      }
    )
    }
  },

  handleTextChange: function (e) {
    this.setState({text: e}, () => {
      this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()).replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'))
    });
  },

  render: function () {

    return (
      <div className="card is-fullwidth">
        <header className="card-header">
          <div className="myToolbar" style={{margin: '1em'}}>
            <H3Button/>
            <BoldButton/>
            <ItalicButton/>
            <UnderlineButton/>
            <BlockquoteButton/>
            <ULButton/>
          </div>
        </header>
        <div className="card-content">
          <div className="content landing-page-html-editor">
            <Editor editorState={this.state.text} onChange={this.handleTextChange} plugins={[richButtonsPlugin]}/>
          </div>
        </div>
      </div>
    )
  }

})
