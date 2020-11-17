import * as React from 'react'
import ContentEditable from 'react-contenteditable';

import { WordObject } from '../../interfaces/proofreaderActivities'

type EditInputProps = WordObject & { onWordChange: Function, numberOfResets: number, isFollowedByPunctuation: boolean }

export default class EditInput extends React.Component<EditInputProps, {}> {
  handleWordChange = (e: any) => {
    const { wordIndex, onWordChange } = this.props
    const stripHTML = e.target.value.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ')
    onWordChange(stripHTML, wordIndex, this.editInput)
  }

  setEditInputRef = node => this.editInput = node

  render() {
    const { currentText, originalText, underlined, wordIndex, paragraphIndex, numberOfResets, isFollowedByPunctuation, } = this.props
    let className = 'edit-input'
    if (underlined ) {
      className += ' underlined'
    }
    if (isFollowedByPunctuation) {
      className += ' no-right-margin'
    }
    if (currentText.trim() !== originalText) {
      className += ' bolded'
    }
    const key = `${paragraphIndex}-${wordIndex}-${numberOfResets}`
    return (<ContentEditable
      className={className}
      data-gramm={false}
      html={currentText}
      innerRef={this.setEditInputRef}
      key={key}
      onChange={this.handleWordChange}
      spellCheck={false}
      tagName="span"
    />)
  }
}
