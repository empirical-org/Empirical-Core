import * as React from 'react'

import { WordObject } from '../../interfaces/proofreaderActivities'

type EditInputProps = WordObject & { handleWordChange: Function }

export default class EditInput extends React.Component<EditInputProps, {}> {
  constructor(props: EditInputProps) {
    super(props)

    this.input = React.createRef()
    this.hidden = React.createRef()

  }

  handleWordChange = (e: any) => {
    const { wordIndex, handleWordChange } = this.props
    handleWordChange(e.target.value, wordIndex)
  }

  getStyleOfInput(key) {
    const el = document.getElementById(key)
    if (el) {
      el.textContent = this.input.value;
      const width = el.offsetWidth + 3 + "px"
      return { width, };
    } else {
      return { display: 'none' }
    }
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
    const key = `${paragraphIndex}-${wordIndex}`
    const style = this.getStyleOfInput(key)
    return (<React.Fragment>
      <span className={`hidden ${className}`} id={key} ref={(node) => this.hidden = node} />
      <input
        className={className}
        key={key}
        onChange={this.handleWordChange}
        ref={(node) => this.input = node}
        spellCheck={false}
        style={style}
        value={currentText}
      />
    </React.Fragment>)
  }
}
