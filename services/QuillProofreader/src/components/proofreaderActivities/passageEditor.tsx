import * as React from 'react';
import { Editor } from 'slate-react'
import Html from 'slate-html-serializer'
import StickyInlines from 'slate-sticky-inlines'
import { stringNormalize } from 'quill-string-normalizer'

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
            dataOriginalIndex: el.getAttribute('data-original-index')
          },
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object === 'block' || obj.object === 'inline') {
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
            return <span data-original-index={obj.data.get('dataOriginalIndex')}>{children}</span>
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
    // stickOnDelete: false
    canBeEmpty: true,
    hasStickyBoundaries: true,
    stickOnDelete: true,
  })
]

interface PassageEditorState {
  text: any;
  originalTextArray: Array<string>,
  indicesOfUTags: {[key:number]: number}
}

interface PassageEditorProps {
  handleTextChange: Function;
  text: string;
  savedText?: string;
}

class PassageEditor extends React.Component <PassageEditorProps, PassageEditorState> {
  constructor(props: PassageEditorProps) {
    super(props)

    const { paragraphWrappedText, originalTextArray, indicesOfUTags } = this.paragraphWrappedText(props.text)

    const text = props.savedText ? props.savedText : paragraphWrappedText

    this.state = {
      text: html.deserialize(text),
      originalTextArray,
      indicesOfUTags
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
  }

  trimWord(word: string) {
    return word.trim().replace(/\n/gm, '')
  }

  paragraphWrappedText(text: string) {
    const brStrippedText = text.replace(/(<br\/>|\/n|↵)+/gm, '</p><p>').replace(/((<\/p><p>)(\s)*)(<\/p><p>)/gm, '</p><p>')
    const extraPTagStrippedText = brStrippedText.replace(/^<p>/, '').replace(/<\/p>$/, '')
    const uTags = extraPTagStrippedText.match(/<u.+?<\/u>/gm)
    const punctuationRegex = /^[.,:;]/
    const beginningOfParagraphRegex = /<p>$/
    const originalTextArray: Array<string> = []
    let spannedText = ''
    let index = 0
    const spans = extraPTagStrippedText.split(/<u.+?<\/u>/gm)
    // { index: uTagId }
    const indicesOfUTags: {[key:number]: number} = {}
    spans.forEach((span, spanIndex) => {
      const words = span.trim().split(' ')
      words.forEach((word, wordIndex) => {
        const trimmedWord = this.trimWord(word)
        const trimmedNextWord = words[wordIndex + 1] ? this.trimWord(words[wordIndex + 1]) : ''
        if (trimmedWord.length) {
          // don't add a space after the  word if the next word starts with punctuation
          if (punctuationRegex.test(trimmedNextWord) || beginningOfParagraphRegex.test(trimmedWord)) {
            spannedText += `<span data-original-index=${index}>${trimmedWord}</span>`
          } else {
            spannedText += `<span data-original-index=${index}>${trimmedWord} </span>`
          }
          originalTextArray.push(trimmedWord)
          index++
        }
      })
      if (uTags && uTags[spanIndex]) {
        const openingUTag = uTags[spanIndex].match(/<u id="(\d+)">/m)
        if (openingUTag) {
          const id = Number(openingUTag[1])
          indicesOfUTags[index] = id
        }
        // don't add a space after the tag if the next word starts with punctuation
        if (spans[spanIndex + 1] && punctuationRegex.test(spans[spanIndex + 1].trim())) {
          spannedText += `<span data-original-index=${index}>${uTags[spanIndex]}</span>`
        } else {
          spannedText += `<span data-original-index=${index}>${uTags[spanIndex]} </span>`
        }
        const text = uTags[spanIndex].match(/<u id="\d+">(.*)<\/u>/) ? uTags[spanIndex].match(/<u id="\d+">(.*)<\/u>/)[1] : ''
        originalTextArray.push(text)
        index++
      }
    })
    return { paragraphWrappedText: /^<p>/.test(spannedText) ? spannedText : `<p>${spannedText}</p>`, originalTextArray, indicesOfUTags }
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
        return <span {...args.attributes} data-original-index={args.node.data.get('dataOriginalIndex')}>{args.children}</span>
    }
  }
​
// Add a `renderMark` method to render marks.
  renderMark = (args) => {
    const { mark, attributes } = args
    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{args.children}</strong>
      case 'italic':
        return <em {...attributes}>{args.children}</em>
      case 'underline':
        if (args.children.trim && !args.children.trim().length) {
          return args.children
        } else {
          return <u {...attributes}>{args.children}</u>
        }
    }
  }

  handleTextChange({value}) {
    this.setState({text: value}, () => this.props.handleTextChange(html.serialize(this.state.text)))
  }

  onKeyDown(event, change, editor) {
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Backspace', 'Shift', 'MetaShift'].includes(event.key)) return

    const { value } = change
    const originalSelection = value.selection

    if (event.key === ' ' && originalSelection.focus.offset !== originalSelection.anchor.offset) return
    if (originalSelection.focus.offset === 0 || originalSelection.anchor.offset === 0) {
      const { startInline } = value
      let previousInline = change.moveBackward(1).value.inlines.first()
      while (!previousInline || (startInline && previousInline.text === startInline.text)) {
        previousInline = change.moveBackward(1).value.inlines.first()
      }
      const text = previousInline.text
      if (text.substr(text.length - 1) !== ' ') {
        event.preventDefault()
        change.moveToRangeOfNode(previousInline).insertText(previousInline.text + event.key)
      }
    }

    return change
    .setAnchor(originalSelection.anchor)
    .setFocus(originalSelection.focus)
  }

  onKeyUp(event, change, editor) {
    console.log('__________')
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) return

    const { value } = change
    const originalSelection = value.selection

    if (event.key === ' ' && originalSelection.focus.offset !== originalSelection.anchor.offset) return

    const { startInline } = value
    let currentInline = startInline
    let previousInline

    if (event.key === 'Backspace') {
      const deletion = change.value.history.undos.first().find(operation => operation.type === 'remove_text')
      previousInline = change.moveBackward(1).value.inlines.first()
      if (deletion && deletion.text === ' ' && originalSelection.focus.offset === 0 && originalSelection.anchor.offset === 0) {
        while (!previousInline || startInline && previousInline.text === startInline.text) {
          previousInline = change.moveBackward(1).value.startInline
        }
      }
    } else {
      previousInline = change.moveBackward(1).value.inlines.first()
      while (!previousInline || (startInline && previousInline.text === startInline.text)) {
        previousInline = change.moveBackward(1).value.inlines.first()
      }
      const text = previousInline.text
      if (text.substr(text.length - 1) === ' ') {
        previousInline = null
      }
    }

    if (previousInline) {
      currentInline = previousInline
    }

    // if (previousInline) console.log('previousInline text', previousInline.text)
    // if (startInline) console.log('startInline text', startInline.text)

    if (currentInline && currentInline.nodes) {
      const dataOriginalIndex = currentInline.data.get('dataOriginalIndex')
      const originalText = this.state.originalTextArray[dataOriginalIndex]
      const newText = currentInline.text
      const normalizedText = stringNormalize(newText)
      const normalizedAndTrimmedNewText = normalizedText.trim()
      let node = change.moveToRangeOfNode(currentInline)

      const lastCharacterIsSpace = newText.substr(newText.length - 1) === ' '

      if (lastCharacterIsSpace) {
        console.log('moving end backward')
        node.moveEndBackward(1)
      }

      if (newText.substr(0, 1) === ' ') {
        console.log('moving anchor forward')
        node.moveAnchorForward(1)
      }

      if (this.state.indicesOfUTags[dataOriginalIndex] || this.state.indicesOfUTags[dataOriginalIndex] === 0) {
        const id = this.state.indicesOfUTags[dataOriginalIndex]
        node = node.addMark({type: 'underline', data: {id}})
      }

      if (normalizedAndTrimmedNewText === stringNormalize(originalText).trim()) {
        if (event.key !== ' ' || (originalSelection.focus.offset !== 0 && originalSelection.anchor.offset !== 0)) {
          console.log('removing mark')
          node
          .removeMark('bold')
          .setAnchor(originalSelection.anchor)
          .setFocus(originalSelection.focus)
        }
      } else {
        console.log('adding mark')
        // if (normalizedAndTrimmedNewText.length === 0) {
        //   node
        //   .addMark('bold')
        //   .setAnchor(originalSelection.anchor)
        //   .setFocus(originalSelection.focus)
        // } else {
          node
          .addMark('bold')
          .setAnchor(originalSelection.anchor)
          .setFocus(originalSelection.focus)
        // }
      }

    } else {
      const nextInline = change.moveEndForward(1).value.endInline
      const previousInline = change.moveStartBackward(1).value.startInline
      if (nextInline || previousInline) {
        if (nextInline) {
          console.log('nextINline')
          const dataOriginalIndex = nextInline.data.get('dataOriginalIndex')
          const originalNextInlineText = this.state.originalTextArray[dataOriginalIndex]
          if (this.state.indicesOfUTags[dataOriginalIndex] || this.state.indicesOfUTags[dataOriginalIndex] === 0) {
            const id = this.state.indicesOfUTags[dataOriginalIndex]
            let node = change
            .setAnchor(originalSelection.anchor)
            .setFocus(originalSelection.focus)
            .addMark({type: 'underline', data: {id}})
            if (stringNormalize(nextInline.text).trim() !== stringNormalize(originalNextInlineText).trim()) {
              node.addMark('bold')
            }
          }
        }
        if (previousInline) {
          console.log('previousInline')
          const dataOriginalIndex = previousInline.data.get('dataOriginalIndex')
          const originalPreviousInlineText = this.state.originalTextArray[dataOriginalIndex]
          if (this.state.indicesOfUTags[dataOriginalIndex] || this.state.indicesOfUTags[dataOriginalIndex] === 0) {
            const id = this.state.indicesOfUTags[dataOriginalIndex]
            let node = change
            .setAnchor(originalSelection.anchor)
            .setFocus(originalSelection.focus)
            .addMark({type: 'underline', data: {id}})
            if (stringNormalize(previousInline.text).trim() !== stringNormalize(originalPreviousInlineText).trim()) {
              node.addMark('bold')
            }
          }
        }
      } else {
        console.log('else')
        change.addMark('bold')
        .setAnchor(originalSelection.anchor)
        .setFocus(originalSelection.focus)
      }
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
          onKeyDown={this.onKeyDown}
          spellCheck={false}
        />)
    } else {
      return <span/>
    }
  }

}

export default PassageEditor
