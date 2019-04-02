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
    const widthMultiplier = window.innerWidth > 600 ? 10 : 12
    const width = (currentText.length * widthMultiplier) + 3
    return <input
      className={className}
      value={currentText}
      onChange={this.handleWordChange}
      key={`${paragraphIndex}-${wordIndex}`}
      style={{width: `${width}px`}}
      spellCheck={false}
    />
  }
}
