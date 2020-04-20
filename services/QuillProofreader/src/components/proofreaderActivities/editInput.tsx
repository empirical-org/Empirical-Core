import * as React from 'react'

import { WordObject } from '../../interfaces/proofreaderActivities'

type EditInputProps = WordObject & { handleWordChange: Function, numberOfResets: number }

export default class EditInput extends React.Component<EditInputProps, {}> {
  handleWordChange = (e: any) => {
    const { wordIndex, handleWordChange } = this.props
    handleWordChange(e.target.value, wordIndex)
  }

  getStyleOfInput(key: string, className: string, currentText: string) {
    const node = document.createElement("span");
    const textnode = document.createTextNode(currentText);
    node.className = `hidden ${className}`
    node.id = key
    node.appendChild(textnode);
    document.body.appendChild(node)
    const el = document.getElementById(key)
    if (el) {
      const width = el.offsetWidth + 3 + "px"
      el.remove()
      return { width, };
    } else {
      return {}
    }
  }


  render() {
    const { currentText, originalText, underlined, wordIndex, paragraphIndex, numberOfResets, } = this.props
    let className = 'edit-input'
    if (underlined ) {
      className += ' underlined'
    }
    if (currentText !== originalText) {
      className += ' bolded'
    }
    const key = `${paragraphIndex}-${wordIndex}-${numberOfResets}`
    const style = this.getStyleOfInput(key, className, currentText)
    return (<React.Fragment>
      <input
        className={className}
        key={key}
        onChange={this.handleWordChange}
        spellCheck={false}
        style={style}
        value={currentText}
      />
    </React.Fragment>)
  }
}
