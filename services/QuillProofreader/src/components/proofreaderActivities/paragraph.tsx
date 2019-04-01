import * as React from 'react'
import _ from 'lodash'

import EditInput from './editInput'
import { WordObject } from '../../interfaces/proofreaderActivities'

interface ParagraphProps {
  words: Array<WordObject>;
  handleParagraphChange: Function;
  resetting: Boolean;
  finishReset: Function;
  underlineErrors: Boolean;
  index: number;
}

export default class Paragraph extends React.Component<ParagraphProps, {}> {
  constructor(props: ParagraphProps) {
    super(props)
  }

  handleWordChange(text: string, i: number) {
    const { words, handleParagraphChange, index } = this.props
    const newWords = _.cloneDeep(words)
    newWords[i]['currentText'] = text
    handleParagraphChange(newWords, index)
  }

  renderInputFields() {
    const { words, underlineErrors, } = this.props
    let className = 'editor'
    if (!underlineErrors) {
      className += ' no-underline'
    }
    const inputs = words.map((word: WordObject) => (
      <EditInput
        {...word}
        handleWordChange={this.handleWordChange}
      />
    ))
    return <div className={className}>{inputs}</div>
  }

  render() {
    return this.renderInputFields()
  }
}
