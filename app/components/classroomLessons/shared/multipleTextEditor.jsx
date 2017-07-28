import * as React from 'react';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import { stateToHTML } from 'draft-js-export-html';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';

class MultipleTextEditor extends React.Component {
  constructor(props) {
    super(props)
    const richButtonsPlugin = createRichButtonsPlugin();
    const {
      // inline buttons
      ItalicButton, BoldButton, UnderlineButton,
    } = richButtonsPlugin;
    this.state = {
      text: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.text || ''))),
      components: { ItalicButton, BoldButton, UnderlineButton },
      plugins: richButtonsPlugin,
    };
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
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
    const { ItalicButton, BoldButton, UnderlineButton } = this.state.components;
    return (
      <div className="card is-fullwidth">
        <header className="card-header">
          <div className="myToolbar" style={{ margin: '1em', }}>
            <BoldButton />
            <ItalicButton />
            <UnderlineButton />
          </div>
        </header>
        <div className="card-content">
          <div className="content">
            <Editor editorState={this.state.text} onChange={this.handleTextChange} plugins={[this.state.plugins]} />
          </div>
        </div>
      </div>
    );
  }

};

export default MultipleTextEditor;
