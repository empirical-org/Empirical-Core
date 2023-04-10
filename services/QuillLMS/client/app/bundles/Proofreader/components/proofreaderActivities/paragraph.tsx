import * as _ from 'lodash'
import * as React from 'react'

import EditInput from './editInput'
import { startsWithPunctuationRegex } from './sharedRegexes'

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
    const inputs = words.map((word: WordObject, i: number) => {
      const isFollowedByPunctuation = words[i + 1] && words[i + 1]['originalText'].match(startsWithPunctuationRegex)
      return (
        <EditInput
          key={word.wordIndex}
          {...word}
          isFollowedByPunctuation={!!isFollowedByPunctuation}
          numberOfResets={numberOfResets}
          onWordChange={this.handleWordChange}
          underlineErrors={underlineErrors}
        />
      )})
    return <div className={className}>{inputs}</div>
  }

  render() {
    return this.renderInputFields()
  }
}
