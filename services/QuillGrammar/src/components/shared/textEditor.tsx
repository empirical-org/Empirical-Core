import * as React from 'react';
import Editor from 'draft-js-plugins-editor'
import { convertFromHTML, convertToHTML } from 'draft-convert'
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'

// interface TextEditorProps {
//   text: string;
//   boilerplate: string;
//   handleTextChange: Function;
// }
//
// interface TextEditorState {
//   text: any;
// }

export default class TextEditor extends React.Component <any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      text: this.props.EditorState.createWithContent(convertFromHTML(this.props.text || ''))
    }

    this.richButtonsPlugin = createRichButtonsPlugin();
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.boilerplate !== this.props.boilerplate) {
      this.setState({text: this.props.EditorState.createWithContent(convertFromHTML(nextProps.boilerplate))},
      () => {
        this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()))
      }
    )
    }
  }

  handleTextChange = (e: Event) => {
    this.setState({text: e}, () => {
      this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()).replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'))
    });
  }

  render() {
    const {
      // inline buttons
      ItalicButton, BoldButton, UnderlineButton,
      // block buttons
      BlockquoteButton, ULButton, H3Button
    } = this.richButtonsPlugin;

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
            <Editor editorState={this.state.text} onChange={this.handleTextChange} plugins={[this.richButtonsPlugin]} />
          </div>
        </div>
      </div>
    )
  }

}
