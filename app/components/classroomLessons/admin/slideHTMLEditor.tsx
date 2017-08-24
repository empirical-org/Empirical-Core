declare function require(name:string);

import * as React from 'react';
const { EditorState, ContentState, convertFromHTML, convertToRaw } = require('draft-js')
const Editor = require('draft-js-plugins-editor').default
const DraftPasteProcessor = require('draft-js/lib/DraftPasteProcessor').default
const stateToHTML = require('draft-js-export-html').stateToHTML
const createRichButtonsPlugin = require('draft-js-richbuttons-plugin').default

class MultipleTextEditor extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const richButtonsPlugin = createRichButtonsPlugin();
    const {
      ItalicButton, BoldButton, UnderlineButton,
      BlockquoteButton, OLButton, ULButton, H4Button
    } = richButtonsPlugin;
    this.state = {
      text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.text || ''))),
      components: { ItalicButton, BoldButton, UnderlineButton, BlockquoteButton, OLButton, ULButton, H4Button},
      plugins: [richButtonsPlugin],
      hasFocus: false,
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      if (nextProps.text === nextProps.lessonPrompt || nextProps.text === '') {
        this.setState({
          text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(nextProps.text || ''))),
        });
      }
    }
    if (nextProps.boilerplate !== this.props.boilerplate) {
      this.setState({ text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(nextProps.boilerplate))), },
      () => {
        this.props.handleTextChange(stateToHTML(this.state.text.getCurrentContent()));
      }
    );
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
    const { ItalicButton, BoldButton, UnderlineButton, BlockquoteButton, OLButton, ULButton, H4Button } = this.state.components;
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
            </div>
          </div>
        </header>
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
