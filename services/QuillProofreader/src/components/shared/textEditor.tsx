import * as React from 'react';
import * as ReactQuill from 'react-quill'; // Typescript
// const { convertFromHTML, convertToHTML } = require('draft-convert')
import * as jsdiff from 'diff'
// import createRichButtonsPlugin from 'draft-js-richbuttons-plugin'

// const richButtonsPlugin = createRichButtonsPlugin();
// const {
//   // inline buttons
//   ItalicButton, BoldButton, UnderlineButton,
//   // block buttons
//   BlockquoteButton, ULButton, H3Button
// } = richButtonsPlugin;
//
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

    this.state = { text: props.text }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handlePassageChange = this.handlePassageChange.bind(this)
    this.standardizedPassage = this.standardizedPassage.bind(this)
    this.onChangeSelection = this.onChangeSelection.bind(this)
  }

  handlePassageChange(value: string) {
    console.log('original', this.props.text)
    console.log('new', value)
    const strippedOriginal = this.standardizedPassage(this.props.text)
    const strippedNew = this.standardizedPassage(value)
    console.log('strippedOriginal', strippedOriginal)
    console.log('strippedNew', strippedNew)

    //
    const diff = jsdiff.diffWords(strippedOriginal, strippedNew)
    const relevantDiff = diff.filter(d => d.added || d.removed)
    if (relevantDiff.length) {
      let valueWithHighlightedChanges = ''
      diff.forEach(diff => {
        console.log(diff)
        if (diff.added) {
          valueWithHighlightedChanges += ` <strong>${diff.value}</strong> `
        } else if (!diff.removed) {
          valueWithHighlightedChanges += diff.value
        }
      })
      return valueWithHighlightedChanges
    }
  }

  standardizedPassage(string: string) {
    // return string
    return string.replace(/<(?:p|\/p|strong|\/strong|\n)*?>/gm, '').replace(/&#x27;/gm, "'").replace(/<br\/><br\/>/gm, '<br>')
  }


  handleTextChange(e) {
    const html = e
    if (html !== this.state.text) {
      const newText = this.handlePassageChange(html)
      console.log('newText', newText)
      if (newText) {
        // this.setState({text: newText})
        this.setState({text: newText }, () => {
          this.props.handleTextChange(newText)
          // this.setState({selection: this.state.lastSelectionIndex})
          const quillRef = this.refs.myQuillRef.getEditor();
          setTimeout(() => {
            // this.setState({selection: newText.selectionIndex})
            // quillRef.focus();
            quillRef.setSelection(this.state.lastSelectionIndex, 0);
          }, 100);

        })
        // this.props.handleTextChange(newText)
      }
    }
  }

  onChangeSelection(range) {
    if (range && range.index !== 0) {
      this.setState({lastSelectionIndex: range.index })
    }
    console.log('range', range)
  }

  render() {
    // const selectionObj = this.state.selectionIndex ? { start: this.state.selectionIndex } : {}
    return (
      <ReactQuill
        value={this.state.text}
        onChange={this.handleTextChange}
        ref={'myQuillRef'}
        onChangeSelection={this.onChangeSelection}
      />
    )
  }

}

export default TextEditor
