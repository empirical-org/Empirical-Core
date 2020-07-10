import * as React from 'react';
import Editor from 'draft-js-plugins-editor'
import { convertFromHTML, convertToHTML } from 'draft-convert'
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'

const richButtonsPlugin = createRichButtonsPlugin();
const {
  // inline buttons
  ItalicButton, BoldButton, UnderlineButton,
  // block buttons
  BlockquoteButton, ULButton, H3Button
} = richButtonsPlugin;

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
      text: props.EditorState.createWithContent(convertFromHTML(props.text || ''))
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const { boilerplate, EditorState, handleTextChange, } = this.props
    if (nextProps.boilerplate !== boilerplate) {
      this.setState({text: EditorState.createWithContent(convertFromHTML(nextProps.boilerplate))},
      () => {
        const { text, } = this.state
        handleTextChange(convertToHTML(text.getCurrentContent()))
      }
    )
    }
  }

  handleTextChange = (e: Event) => {
    const { handleTextChange, } = this.props

    this.setState({text: e}, () => {
      const { text, } = this.state
      handleTextChange(convertToHTML(text.getCurrentContent()).replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'))
    });
  }

  render() {
    const { text, } = this.state
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
