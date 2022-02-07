declare function require(name:string);

import * as React from 'react';
const { EditorState, ContentState, convertToRaw } = require('draft-js')
const Editor = require('@draft-js-plugins/editor').default
const {convertFromHTML, convertToHTML} = require('draft-convert')
const DraftPasteProcessor = require('draft-js/lib/DraftPasteProcessor').default

import { richButtonsPlugin, } from '../../../../Shared/index'

class MultipleTextEditor extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const rbp = richButtonsPlugin();
    const InlineButton = ({className, toggleInlineStyle, isActive, label, inlineStyle, onMouseDown, title}) =>
      (<a onClick={toggleInlineStyle} onMouseDown={onMouseDown}>
        <span
          className={`${className}`}
          style={{ color: isActive ? '#990000' : '#777' }}
          title={title ? title : label}
        >{title}
        </span>
      </a>);
    const {
      ItalicButton, BoldButton, UnderlineButton,
      BlockquoteButton, OLButton, ULButton, H4Button, MonospaceButton
    } = rbp;
    this.state = {
      text: EditorState.createWithContent(convertFromHTML(this.props.text || '')),
      components: { ItalicButton, BoldButton, UnderlineButton, BlockquoteButton, OLButton, ULButton, H4Button, MonospaceButton, InlineButton},
      plugins: [rbp],
      hasFocus: false,
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      if (nextProps.text === nextProps.lessonPrompt || nextProps.text === '') {
        this.setState({
          text: EditorState.createWithContent(convertFromHTML(nextProps.text || '')),
        });
      }
    }
    if (nextProps.boilerplate !== this.props.boilerplate) {
      this.setState({ text: EditorState.createWithContent(convertFromHTML(nextProps.boilerplate)), },
        () => {
          this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()));
        }
      );
    }
  }

  handleTextChange(e) {
    this.setState({ text: e, }, () => {
      this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()).replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'));
    });
  }

  render() {
    const { ItalicButton, BoldButton, UnderlineButton, BlockquoteButton, OLButton, ULButton, H4Button, MonospaceButton, InlineButton } = this.state.components;
    const textBoxClass = this.state.hasFocus ? 'card-content hasFocus' : 'card-content';
    return (
      <div className="card is-fullwidth">
        <header className="card-header">
          <div className="myToolbar">
            <p className="teacher-model-instructions">
              {this.props.title}
            </p>
            <div className="buttons-wrapper">
              <BoldButton />
              <ItalicButton />
              <UnderlineButton />
              <BlockquoteButton />
              <OLButton />
              <ULButton />
              <H4Button />
              <MonospaceButton><InlineButton className="alignLeft" title="Align Left" /></MonospaceButton>
            </div>
          </div>
        </header>
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
