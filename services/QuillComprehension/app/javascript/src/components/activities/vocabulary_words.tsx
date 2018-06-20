import React from 'react'
import Modal from '../modals'
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
        <Modal>Hi</Modal>
        <div className="tags">
          {this.props.vocabWords.map(word => (<a className="tag large" key={word.id}>{word.text}</a>))}
        </div>
      </div>
    )
  }
}