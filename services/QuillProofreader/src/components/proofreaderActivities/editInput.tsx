import * as React from 'react'

import { WordObject } from '../../interfaces/proofreaderActivities'

type EditInputProps = WordObject & { handleWordChange: Function }

export default class EditInput extends React.Component<EditInputProps, {}> {
  constructor(props: EditInputProps) {
    super(props)

    this.handleWordChange = this.handleWordChange.bind(this)
  }

  handleWordChange(e: any) {
    const { wordIndex, handleWordChange } = this.props
    handleWordChange(e.target.value, wordIndex)
  }

  render() {
    const { currentText, originalText, underlined, wordIndex, paragraphIndex } = this.props
    let className = 'edit-input'
    if (underlined ) {
      className += ' underlined'
    }
    if (currentText !== originalText) {
      className += ' bolded'
    }
    const width = (currentText.length * 10) + 3
    return <input
      className={className}
      key={`${paragraphIndex}-${wordIndex}`}
      onChange={this.handleWordChange}
      spellCheck={false}
      style={{width: `${width}px`}}
      value={currentText}
    />
  }
}
