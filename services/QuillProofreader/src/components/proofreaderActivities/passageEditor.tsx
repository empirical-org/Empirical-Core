import * as React from 'react';
import ReactQuill from 'react-quill'; // Typescript
import * as jsdiff from 'diff'
import * as _ from 'underscore'

interface PassageEditorState {
  text: string;
  lastSelectionIndex?: number;
}

interface PassageEditorProps {
  handleTextChange: Function;
  text: string;
}

class PassageEditor extends React.Component <PassageEditorProps, PassageEditorState> {
  constructor(props: PassageEditorProps) {
    super(props)

    this.state = {
      text: props.text
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handlePassageChange = this.handlePassageChange.bind(this)
    this.standardizedPassage = this.standardizedPassage.bind(this)
    this.onChangeSelection = this.onChangeSelection.bind(this)
  }

  componentDidMount() {
    const quillRef = document.getElementsByClassName('ql-editor')
    if (quillRef && quillRef[0]) {
      quillRef[0].setAttribute("spellcheck", "false")
    }
  }

  handlePassageChange(value: string):string|void {
    const strippedOriginal = this.standardizedPassage(this.props.text)
    const strippedNew = this.standardizedPassage(value)
    const diffs = jsdiff.diffWords(strippedOriginal, strippedNew)
    const relevantDiffs = diffs.filter((d: { added?: boolean, removed?: boolean, value?: string }) => d.added || d.removed)
    if (relevantDiffs.length) {
      let valueWithHighlightedChanges = ''
      diffs.forEach((diff: { added?: boolean, removed?: boolean, value?: string }, index: number) => {
        const nextDiff = diffs[index + 1]
        let diffVal
        // if (nextDiff && nextDiff.value === '<u>') {
        //   diffVal = '<u>' + diff.value
        // } else if (diff.value !== '<u>') {
          diffVal = diff.value
        // }
        if (diff.added && diffVal && !/<p>|<\/p>/.test(diffVal)) {
          valueWithHighlightedChanges += `<strong>${diffVal}</strong>`
        } else if (!diff.removed) {
          valueWithHighlightedChanges += diffVal
        }
      })
      return valueWithHighlightedChanges
    }
  }

  standardizedPassage(string: string):string {
    return string.replace(/<(?:strong|\/strong)>|<br>/gm, '').replace(/\s+(\.)/gm, '.')
  }


  handleTextChange(text: string) {
    const html = text
    if (html !== this.state.text) {
      const newText = this.handlePassageChange(html)
      if (newText) {
        this.setState({text: newText }, () => {
          this.props.handleTextChange(newText)
          const quillRef = this.refs.editor.getEditor();
          // have to wait to make sure new text has rendered
          setTimeout(() => {
            quillRef.setSelection(this.state.lastSelectionIndex, 0);
          }, 100);

        })
      }
    }
  }

  onChangeSelection(range: null|{ index: number, length: number }) {
    if (range && range.index !== 0) {
      this.setState({lastSelectionIndex: range.index })
    }
  }

  render() {
    return (
      // onChange={_.debounce(this.handleTextChange, 5000)}

      <ReactQuill
        modules={{toolbar: null}}
        value={this.state.text}
        onChange={this.handleTextChange}
        ref={'editor'}
        onChangeSelection={this.onChangeSelection}
      />
    )
  }

}

export default PassageEditor
