import React from 'react';
import Editor from 'draft-js-plugins-editor'
const { convertFromHTML, convertToHTML } = require('draft-convert')
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'
import Immutable from 'immutable'

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
    this.handlePastedText = this.handlePastedText.bind(this)
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
    console.log('e', e)
    this.setState({text: e}, () => {
      console.log('this.state.text.getCurrentContent()', this.state.text.getCurrentContent())
      this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()).replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'))
    });
  }

  handlePastedText(text, html, editorState){
//     console.log('wtf')
//     debugger;
//     return false
    const contentState = convertFromHTML({
      htmlToEntity: (nodeName, node, createEntity) => {
        switch (nodeName) {
          if (nodeName === 'p') {
            return createEntity(
              'PARAGRAPH',
              'MUTABLE'
            )
          }
        }
      },
    })(html || text);
    const blockMap = contentState.blockMap
    const newState = this.props.Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap)
    this.handleTextChange(this.props.EditorState.push(editorState, newState, 'insert-fragment'))
    return 'handled'
}

  render() {

    return (
      <div className="card is-fullwidth">
        <header className="card-header">
          <div className="myToolbar" style={{margin: '1em'}}>
            <H3Button/>
            <BoldButton/>
            <ItalicButton/>
            <UnderlineButton/>
            <BlockquoteButton/>
            <ULButton/>
          </div>
        </header>
        <div className="card-content">
          <div className="content landing-page-html-editor">
            <Editor
              editorState={this.state.text}
              onChange={this.handleTextChange}
              plugins={[richButtonsPlugin]}
              blockRenderMap={customRenderMap}
              handlePastedText={this.handlePastedText}
            />
          </div>
        </div>
      </div>
    )
  }

}

export default TextEditor
