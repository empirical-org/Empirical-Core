import React from 'react'

export interface VocabularyWord {
  id:number
  text:string
  description:string
  example:string
}

export interface Props {
  vocabWords: Array<VocabularyWord>
} 

export default class VocabularyWords extends React.Component<Props, any> {
  render() {
    return (
      <div className="d-fl-r ai-c">
        <h3 className="m-r-1 focus">Focus Words</h3>
        <div className="tags">
          {this.props.vocabWords.map(word => (<span className="tag large" key={word.id}>{word.text}</span>))}
        </div>
      </div>
    )
  }
}