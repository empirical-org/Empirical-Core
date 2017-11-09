import React, {Component} from 'react'
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import { stateToHTML } from 'draft-js-export-html';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';

class MultipleTextEditor extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const richButtonsPlugin = createRichButtonsPlugin();
    const {
      // inline buttons
      ItalicButton, BoldButton, UnderlineButton, BlockquoteButton
    } = richButtonsPlugin;

    const MyIconButton = ({className, toggleInlineStyle, isActive, label, inlineStyle, onMouseDown, title}) =>
      <a onClick={toggleInlineStyle} onMouseDown={onMouseDown}>
        <span
          className={`${className}`}
          title={title ? title : label}
          style={{ color: isActive ? '#000' : '#777' }}>{title}</span>
      </a>;

    this.state = {
      text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.text || ''))),
      components: { ItalicButton, BoldButton, UnderlineButton, BlockquoteButton, MyIconButton },
      plugins: [richButtonsPlugin],
      hasFocus: false
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
        this.setState({
          text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(nextProps.text || ''))),
        });
    }
  }

  getState() {
    return EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.text || '')));
  }

  handleTextChange(e) {
    this.setState({ text: e, }, () => {
      this.props.handleTextChange(stateToHTML(this.state.text.getCurrentContent()));
    });
  }

  render() {
    const { ItalicButton, BoldButton, UnderlineButton, BlockquoteButton, MyIconButton} = this.state.components;
    const textBoxClass = this.state.hasFocus ? 'card-content hasFocus' : 'card-content';
    const errorClass = this.props.incompletePrompt ? 'incomplete-prompt' : ''
    return (
      <div className={`customize-lessons-editor card is-fullwidth ${errorClass}`}>
        <div className="buttons-toolbar">
          <div className="buttons-wrapper">
            <BoldButton><MyIconButton className="bold" title="B" /></BoldButton>
            <ItalicButton><MyIconButton className="italic" title="I" /></ItalicButton>
            <UnderlineButton><MyIconButton className="underline" title="U" /></UnderlineButton>
            <BlockquoteButton><MyIconButton className="quote" title="Quote" /></BlockquoteButton>
          </div>
        </div>
        <div className={textBoxClass}>
          <div className="content">
            <Editor
              editorState={this.state.text}
              onChange={this.handleTextChange}
              plugins={this.state.plugins}
              onFocus={() => this.setState({ hasFocus: true, })}
              onBlur={() => this.setState({ hasFocus: false, })}
            />
          </div>
        </div>
      </div>
    );
  }

}

export default MultipleTextEditor;
