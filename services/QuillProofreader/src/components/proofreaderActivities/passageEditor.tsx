import * as React from 'react';
// import ReactQuill, { Quill } from 'react-quill'; // Typescript
import { Editor } from 'slate-react'
import { Value } from 'slate'
import Html from 'slate-html-serializer'

import * as jsdiff from 'diff'

const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code',
}
​
// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
  span: 'span'
}
​
const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'block') {
        switch (obj.type) {
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            )
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>
          case 'quote':
            return <blockquote>{children}</blockquote>
        }
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'mark',
          type: type,
          data: {
            id: el.getAttribute('id'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>
          case 'underline':
            return <u id={obj.data.get('id')}>{children}</u>
        }
      }
    },
  },

  // {
  //   deserialize(el) {
  //     if (el.tagName !== 'br') return;
  //
  //     return {
  //       kind: 'text',
  //       text: '\n',
  //     };
  //   },
  //   serialize(object, children) {
  //     if (object.type !== 'text') return;
  //     if (children !== '\n') return;
  //
  //     return (
  //       <br/>
  //     );
  //   },
  // },

]

const html = new Html({ rules })

interface PassageEditorState {
  text: any;
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
      text: html.deserialize(this.paragraphWrappedText(props.text))
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handlePassageChange = this.handlePassageChange.bind(this)
    this.standardizedPassage = this.standardizedPassage.bind(this)
    this.onChangeSelection = this.onChangeSelection.bind(this)
  }

  paragraphWrappedText(text: string) {
    const brStrippedText = text.replace(/(<br\/>)+/gm, '</p><p>')
    const uTags = brStrippedText.match(/<u.+?<\/u>/gm)
    let spannedText = ''
    let index = 0
    brStrippedText.split(/<u.+?<\/u>/gm).forEach(span => {
      span.split(' ').forEach(word => spannedText += `<span>${word}</span> `)
      spannedText += uTags[index]
      index++
    })
    return /^<p>/.test(spannedText) ? spannedText : `<p>${spannedText}</p>`
  }

  componentDidMount() {
    // this.registerFormats()
    // const quillRef = document.getElementsByClassName('ql-editor')
    // if (quillRef && quillRef[0]) {
    //   quillRef[0].setAttribute("spellcheck", "false")
    // }
  }

//   registerFormats () {
//   // Ensure React-Quill references is available:
//     if (typeof this.refs.editor.getEditor !== 'function') return;
//     // Skip if Quill reference is defined:
//     if (this.quillRef != null) return;
//
//     console.log('Registering formats...', this.refs.editor)
//     const quillRef = this.refs.editor.getEditor() // could still be null
//
//     if (quillRef != null) {
//       this.quillRef = quillRef;
//       console.log(Quill.imports)
//     }
// }


  handlePassageChange(value: string):string|void {
    const strippedOriginal = this.standardizedPassage(this.paragraphWrappedText(this.props.text))
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
        //
        if (diff.added) {
        // if (diff.added && diffVal && !/<p>|<\/p>/.test(diffVal)) {
          valueWithHighlightedChanges += `<strong>${diffVal}</strong>`
        } else if (!diff.removed) {
          valueWithHighlightedChanges += diffVal
        }
      })
      return valueWithHighlightedChanges
    }
  }

  standardizedPassage(string: string):string {
    return string.replace(/<(?:strong|\/strong)>/gm, '').replace(/\s+(\.)/gm, '.').replace(/<br\/>/gm, '')
  }

  renderNode = (args) => {
    switch (args.node.type) {
      case 'code':
        return (
          <pre {...args.attributes}>
            <code>{args.children}</code>
          </pre>
        )
      case 'paragraph':
        return (
          <p {...args.attributes} className={args.node.data.get('className')}>
            {args.children}
          </p>
        )
      case 'quote':
        return <blockquote {...args.attributes}>{args.children}</blockquote>
    }
  }
​
// Add a `renderMark` method to render marks.
  renderMark = (args) => {
    const { mark, attributes } = args
    console.log('mark', mark)
    console.log('attributes', attributes)
    switch (mark.type) {
      case 'bold':
        return <strong {...attributes} id={mark.get('key')}>{args.children}</strong>
      case 'italic':
        return <em {...attributes} id={mark.get('key')}>{args.children}</em>
      case 'underline':
        return <u {...attributes} id={mark.get('key')}>{args.children}</u>
      case 'span':
        return <span {...attributes} id={mark.get('key')}>{args.children}</span>
    }
  }

  handleTextChange({value}) {
    this.setState({text: value})
    // const clonedValue = _.cloneDeep(value)
    // const serializedHtml = html.serialize(clonedValue)
    // const serializedState = html.serialize(this.state.text)
    // console.log('original value', serializedHtml)
    // // if (serializedHtml !== html.serialize(this.state.text)) {
    //   const newHtml = this.handlePassageChange(serializedHtml)
    //   if (newHtml && (newHtml !== serializedState)) {
    //     console.log('new vlaue', newHtml)
    //     const unserializedNewHtml = html.deserialize(newHtml)
    //     this.setState({text: unserializedNewHtml }, () => {
    //       // this.props.handleTextChange(newHtml)
    //       // const quillRef = this.refs.editor.getEditor();
    //       // have to wait to make sure new text has rendered
    //       // setTimeout(() => {
    //       //   quillRef.setSelection(this.state.lastSelectionIndex, 0);
    //       // }, 100);
    //
    //     })
    //   }
    // }
  }

  onChangeSelection(range: null|{ index: number, length: number }) {
    if (range && range.index !== 0) {
      this.setState({lastSelectionIndex: range.index })
    }
  }

  onKeyDown(event, change, editor) {
    const { value } = change
    const { selection, startBlock } = value
    // value.focusInline.addMark('bold')
    debugger;
    change
    .moveToRangeOfInline()
    .addMark('bold')
  }

  render() {
    if (this.state.text) {
      return (
        // onChange={_.debounce(this.handleTextChange, 5000)}

        // <Editor
        //   modules={{toolbar: null}}
        //   value={this.state.text}
        //   onChange={this.handleTextChange}
        //   ref={'editor'}
        //   onChangeSelection={this.onChangeSelection}
        // />
        <Editor
          value={this.state.text}
          onChange={this.handleTextChange}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          onKeyDown={this.onKeyDown}
        />)
    } else {
      return <span/>
    }
  }

}

export default PassageEditor
