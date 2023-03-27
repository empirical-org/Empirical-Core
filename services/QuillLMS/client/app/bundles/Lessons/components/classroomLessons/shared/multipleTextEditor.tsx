import Editor from '@draft-js-plugins/editor';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import * as React from 'react';

import { richButtonsPlugin } from '../../../../Shared/index';

class MultipleTextEditor extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const rbp = richButtonsPlugin();
    const {
      // inline buttons
      ItalicButton, BoldButton, UnderlineButton,
    } = rbp;
    this.state = {
      text: EditorState.createWithContent(convertFromHTML(props.text || '')),
      components: { ItalicButton, BoldButton, UnderlineButton, },
      plugins: [rbp],
      hasFocus: false,
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      if (nextProps.text === nextProps.lessonPrompt || nextProps.text === '' || this.props.text === '') {
        if (nextProps.text !== convertToHTML(this.state.text.getCurrentContent())) {
          this.setState({
            text: EditorState.createWithContent(convertFromHTML(nextProps.text || '')),
          });
        }
      }
    }
    if (nextProps.boilerplate !== this.props.boilerplate) {
      this.setState({ text: EditorState.createWithContent(convertFromHTML(nextProps.boilerplate)), },
        () => {
          this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()).replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'));
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
    const { ItalicButton, BoldButton, UnderlineButton, } = this.state.components;
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
