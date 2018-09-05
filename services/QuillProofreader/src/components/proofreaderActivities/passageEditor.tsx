import * as React from 'react';
// import ReactQuill, { Quill } from 'react-quill'; // Typescript
import { Editor } from 'slate-react'
import { Value } from 'slate'
import Html from 'slate-html-serializer'
import StickyInlines from 'slate-sticky-inlines'

const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code',
  span: 'span'
}
​
// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline'
}
​
const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: type === 'span' ? 'inline': 'block',
          type: type,
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'block' || obj.object == 'inline') {
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
          case 'span':
            return <span>{children}</span>
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

]

const html = new Html({ rules })

const plugins = [
  StickyInlines({
    canBeEmpty: true,
    hasStickyBoundaries: true,
    stickOnDelete: true,
  })
]

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
  }

  paragraphWrappedText(text: string) {
    const brStrippedText = text.replace(/(<br\/>)+/gm, '</p><p>')
    const uTags = brStrippedText.match(/<u.+?<\/u>/gm)
    let spannedText = ''
    let index = 0
    brStrippedText.split(/<u.+?<\/u>/gm).forEach(span => {
      span.split(' ').forEach(word => {
        const trimmedWord = word.trim()
        console.log('word', word)
        if (trimmedWord.length) {
          spannedText += `<span>${trimmedWord} </span>`
        }
      })
      uTags && uTags[index] ? spannedText += `<span>${uTags[index]} </span>` : null
      index++
    })
    return /^<p>/.test(spannedText) ? spannedText : `<p>${spannedText}</p>`
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
      case 'span':
        return <span {...args.attributes}>{args.children}</span>
    }
  }
​
// Add a `renderMark` method to render marks.
  renderMark = (args) => {
    const { mark, attributes } = args
    switch (mark.type) {
      case 'bold':
        return <strong {...attributes} id={mark.get('key')}>{args.children}</strong>
      case 'italic':
        return <em {...attributes} id={mark.get('key')}>{args.children}</em>
      case 'underline':
        return <u {...attributes} id={mark.get('key')}>{args.children}</u>
    }
  }

  handleTextChange({value}) {
    this.setState({text: value}, () => this.props.handleTextChange(html.serialize(this.state.text)))
  }

  onKeyUp(event, change, editor) {
    const { value } = change
    const originalSelection = value.selection
    if (value.startInline && value.startInline.nodes) {
      change.moveToRangeOfNode(value.startInline.nodes.first())
      .addMark('bold')
      .setStart(originalSelection.start)
      .setEnd(originalSelection.end)
    } else {
      change.addMark('bold')
    }
  }

  render() {
    if (this.state.text) {
      return (
        <Editor
          className='editor'
          value={this.state.text}
          onChange={this.handleTextChange}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          onKeyUp={this.onKeyUp}
          plugins={plugins}
          spellCheck={false}
        />)
    } else {
      return <span/>
    }
  }

}

export default PassageEditor
