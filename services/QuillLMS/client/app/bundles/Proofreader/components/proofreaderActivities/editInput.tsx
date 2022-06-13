import * as React from 'react'
import ContentEditable from 'react-contenteditable';

import { WordObject } from '../../interfaces/proofreaderActivities'

type EditInputProps = WordObject & { onWordChange: Function, numberOfResets: number, isFollowedByPunctuation: boolean, underlineErrors: boolean }

export default class EditInput extends React.Component<EditInputProps, {}> {
  handleWordChange = (e: any) => {
    const { wordIndex, onWordChange } = this.props
    const stripHTML = e.target.value.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ')
    onWordChange(stripHTML, wordIndex, this.editInput)
  }

  setEditInputRef = node => this.editInput = node

  render() {
    const { currentText, originalText, underlined, wordIndex, paragraphIndex, numberOfResets, isFollowedByPunctuation, underlineErrors} = this.props
    const beforeElements = []
    const afterElements = []
    let className = 'edit-input'
    if (underlined && underlineErrors) {
      className += ' underlined'
      // disabling tabIndex rule because this is a non-standard use case - since screenreader users will likely be using tab keys to navigate the passage, it is important that this information is discoverable in that mode
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      beforeElements.push(<span className="sr-only" tabIndex={0}>(underlined text begins here)</span>)
      afterElements.push(<span className="sr-only" tabIndex={0}>(underlined text ends here)</span>)
      /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }
    if (isFollowedByPunctuation) {
      className += ' no-right-margin'
    }
    if (currentText.trim() !== originalText) {
      className += ' bolded'
      // disabling tabIndex rule because this is a non-standard use case - since screenreader users will likely be using tab keys to navigate the passage, it is important that this information is discoverable in that mode
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      beforeElements.push(<span className="sr-only" tabIndex={0}>(bolded text begins here)</span>)
      afterElements.push(<span className="sr-only" tabIndex={0}>(bolded text ends here)</span>)
      /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }
    const key = `${paragraphIndex}-${wordIndex}-${numberOfResets}`
    return (
      <React.Fragment>
        {beforeElements}
        <ContentEditable
          className={className}
          data-gramm={false}
          html={currentText}
          innerRef={this.setEditInputRef}
          key={key}
          onChange={this.handleWordChange}
          spellCheck={false}
          tagName="span"
        />
        {afterElements}
      </React.Fragment>
    )
  }
}
