import * as React from 'react';
import Editor from 'draft-js-plugins-editor'
const { convertFromHTML, convertToHTML } = require('draft-convert')
import * as jsdiff from 'diff'
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

class TextEditor extends React.Component <any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      text: this.props.EditorState.createWithContent(convertFromHTML(this.props.text || ''))
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.standardizedPassage = this.standardizedPassage.bind(this)
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.boilerplate !== this.props.boilerplate) {
      this.setState({text: this.props.EditorState.createWithContent(convertFromHTML(nextProps.boilerplate))},
      () => {
        this.props.handleTextChange(convertToHTML(this.state.text.getCurrentContent()))
      }
    )
    }
  }

  handlePassageChange(value: string) {
    // const strippedOriginal = this.standardizedPassage(this.props.text)
    // const strippedNew = this.standardizedPassage(value)
    const diff = jsdiff.diffWords(this.props.text, value)
    const relevantDiff = diff.filter(d => d.added || d.removed)
    if (relevantDiff.length) {
      console.log('diff', diff)
      console.log('relevantDiff', relevantDiff)
      let valueWithHighlightedChanges = ''
      diff.forEach(diff => {
        if (diff.added) {
          valueWithHighlightedChanges += ` <strong>${diff.value}</strong> `
        } else if (!diff.removed) {
          valueWithHighlightedChanges += diff.value
        }
      })
      console.log('valueWithHighlightedChanges', valueWithHighlightedChanges)
      return valueWithHighlightedChanges
    }
  }

  standardizedPassage(string: string) {
    return string.replace(/<(?:.|\n)*?>/gm, '').replace(/&#x27;/gm, "'")
  }


  handleTextChange(e) {
    const html = convertToHTML(e.getCurrentContent())
    const newText = this.handlePassageChange(html)
    console.log('newText', newText)
    if (newText) {
      this.setState({text: this.props.EditorState.createWithContent(convertFromHTML(newText))}, () => {
        this.props.handleTextChange(newText)
      });
    }
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
            <Editor editorState={this.state.text} onChange={this.handleTextChange} plugins={[richButtonsPlugin]}/>
          </div>
        </div>
      </div>
    )
  }

}

export default TextEditor
