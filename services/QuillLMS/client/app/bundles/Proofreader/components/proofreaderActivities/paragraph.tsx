import * as React from 'react'
import * as _ from 'lodash'

import EditInput from './editInput'
import { WordObject } from '../../interfaces/proofreaderActivities'

interface ParagraphProps {
  words: Array<WordObject>;
  handleParagraphChange: Function;
  numberOfResets: number;
  underlineErrors: Boolean;
  index: number;
}

export default class Paragraph extends React.Component<ParagraphProps, {}> {
  constructor(props: ParagraphProps) {
    super(props)

    this.handleWordChange = this.handleWordChange.bind(this)
    this.renderInputFields = this.renderInputFields.bind(this)
  }

  handleWordChange(text: string, i: number, editInput: any) {
    const { words, handleParagraphChange, index } = this.props
    const newWords = _.cloneDeep(words)
    newWords[i]['currentText'] = text
    handleParagraphChange(newWords, index, editInput)
  }

  renderInputFields() {
    const { words, underlineErrors, numberOfResets, } = this.props
    let className = 'paragraph'
    if (!underlineErrors) {
      className += ' no-underline'
    }
    const inputs = words.map((word: WordObject) => (
      <EditInput
        key={word.wordIndex}
        {...word}
        numberOfResets={numberOfResets}
        onWordChange={this.handleWordChange}
      />
    ))
    return <div className={className}>{inputs}</div>
  }

  render() {
    return this.renderInputFields()
  }
}
