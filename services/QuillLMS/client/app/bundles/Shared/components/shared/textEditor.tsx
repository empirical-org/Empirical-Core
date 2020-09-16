import * as React from 'react';
import Editor from 'draft-js-plugins-editor'
import { convertFromHTML, convertToHTML } from 'draft-convert'
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'
import * as Immutable from 'immutable'

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
//
const customRenderMap = Immutable.Map({
  unstyled: {
    element: 'div',
    // will be used in convertFromHTMLtoContentBlocks
    aliasedElements: ['p'],
  },
})

class TextEditor extends React.Component <any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      text: this.props.EditorState.createWithContent(convertFromHTML(this.props.text || ''))
    }

    this.handleTextChange = this.handleTextChange.bind(this)
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.boilerplate !== this.props.boilerplate) {
      this.setState({text: this.props.EditorState.createWithContent(this.props.ContentState.createFromBlockArray(convertFromHTML(nextProps.boilerplate)))},
      () => {
        this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()))
      }
    )
    }
  }

  handleTextChange(e: Event) {
    this.setState({text: e}, () => {
      this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()).replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'))
    });
  }

  render() {

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
            <Editor
              blockRenderMap={customRenderMap}
              editorState={this.state.text}
              onChange={this.handleTextChange}
              plugins={[richButtonsPlugin]}
            />
          </div>
        </div>
      </div>
    )
  }

}

export { TextEditor }
