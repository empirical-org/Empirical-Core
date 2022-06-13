import React, {Component} from 'react'
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
const {convertFromHTML, convertToHTML} = require('draft-convert')

import { richButtonsPlugin, } from '../../../../../Shared/index'

class MultipleTextEditor extends React.Component {
  constructor(props) {
    super(props);

    const rbp = richButtonsPlugin();
    const {
      // inline buttons
      ItalicButton, BoldButton, UnderlineButton, BlockquoteButton
    } = rbp;

    const InlineButton = ({className, toggleInlineStyle, isActive, label, inlineStyle, onMouseDown, title}) =>
      (<a onClick={toggleInlineStyle} onMouseDown={onMouseDown}>
        <span
          className={`${className}`}
          style={{ color: isActive ? '#000' : '#777' }}
          title={title ? title : label}
        >{title}
        </span>
      </a>);

    const BlockButton = ({className, toggleBlockType, isActive, label, blockType, title}) =>
      (<a onClick={toggleBlockType}>
        <span
          className={`${className}`}
          style={{ color: isActive ? '#000' : '#777' }}
          title={title ? title : label}
        >{title}
        </span>
      </a>);

    this.state = {
      text: EditorState.createWithContent(convertFromHTML(this.props.text || '')),
      components: { ItalicButton, BoldButton, UnderlineButton, BlockquoteButton, InlineButton, BlockButton },
      plugins: [rbp],
      hasFocus: false
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      if (nextProps.text === '' || this.props.text === '' || nextProps.reset) {
        if (nextProps.text !== convertToHTML(this.state.text.getCurrentContent())) {
          this.setState({
            text: EditorState.createWithContent(convertFromHTML(nextProps.text || '')),
          });
        }
      }
    }
  }

  handleTextChange(e) {
    this.setState({ text: e, }, () => {
      this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()).replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'));
    });
  }

  render() {
    const { ItalicButton, BoldButton, UnderlineButton, BlockquoteButton, InlineButton, BlockButton} = this.state.components;
    const textBoxClass = this.state.hasFocus ? 'card-content hasFocus' : 'card-content';
    const errorClass = this.props.incompletePrompt ? 'incomplete-prompt' : ''
    const editorFocusClass = this.state.hasFocus ? 'editor-focused' : ''
    const blockquote = this.props.showBlockquote ? <BlockquoteButton><BlockButton className="quote" title="Quote" /></BlockquoteButton> : null
    return (
      <div className={`customize-lessons-editor card is-fullwidth ${errorClass} ${editorFocusClass}`}>
        <div className="buttons-toolbar">
          <div className="buttons-wrapper">
            <BoldButton><InlineButton className="bold" title="B" /></BoldButton>
            <ItalicButton><InlineButton className="italic" title="I" /></ItalicButton>
            <UnderlineButton><InlineButton className="underline" title="U" /></UnderlineButton>
            {blockquote}
          </div>
        </div>
        <div className={textBoxClass}>
          <div className="content">
            <Editor
              editorState={this.state.text}
              onBlur={() => this.setState({ hasFocus: false, })}
              onChange={this.handleTextChange}
              onFocus={() => this.setState({ hasFocus: true, })}
              plugins={this.state.plugins}
            />
          </div>
        </div>
      </div>
    );
  }

}

export default MultipleTextEditor;
