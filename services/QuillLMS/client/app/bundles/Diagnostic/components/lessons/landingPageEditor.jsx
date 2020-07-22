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

export default class extends React.Component {
  state = {
    text: EditorState.createWithContent(convertFromHTML(this.props.text || ''))
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { boilerplate, handleTextChange } = this.props
    const { text } = this.state;
    if (nextProps.boilerplate !== boilerplate) {
      this.setState({text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(nextProps.boilerplate)))},
      () => {
        handleTextChange(convertToHTML(text.getCurrentContent()))
      }
    )
    }
  }

  handleTextChange = (e) => {
    const { handleTextChange } = this.props;
    const { text } = this.state;
    this.setState({text: e}, () => {
      handleTextChange(convertToHTML(text.getCurrentContent()).replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'))
    });
  };

  render() {
    const { text } = this.state;
    return (
      <div className="card is-fullwidth">
        <header className="card-header">
          <div className="myToolbar" style={{margin: '1em'}}>
            <H3Button />
            <BoldButton />
            <ItalicButton />
            <UnderlineButton />
            <BlockquoteButton />
            <ULButton />
          </div>
        </header>
        <div className="card-content">
          <div className="content landing-page-html-editor">
            <Editor editorState={text} onChange={this.handleTextChange} plugins={[richButtonsPlugin]} />
          </div>
        </div>
      </div>
    )
  }
}
