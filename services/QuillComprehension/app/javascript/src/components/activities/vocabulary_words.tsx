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

export interface State {
  readonly activeVocabWord: VocabularyWord|null
}

export default class VocabularyWords extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      activeVocabWord: null
    }
    this.clearVocabWord = this.clearVocabWord.bind(this)
  }

  selectVocabWord(vocabWord:VocabularyWord):void {
    this.setState({activeVocabWord: vocabWord})
  }

  clearVocabWord():void {
    this.setState({activeVocabWord: null});
  }

  renderModal() {
    if (this.state.activeVocabWord) {
      return (
        <Modal exit={e => this.clearVocabWord()}>
          <div className="card mw-50">
            <div className="card-header"><h3>{this.state.activeVocabWord.text}</h3></div>
            <div className="card-body">
              <p><strong>Definition</strong>: <span dangerouslySetInnerHTML={{__html: this.state.activeVocabWord.description}} /></p>
              <p><strong>Sample Sentence</strong>: <span dangerouslySetInnerHTML={{__html: this.state.activeVocabWord.example}} /></p>
            </div>
            <div className="card-footer"><button className="btn btn-primary" onClick={e => this.clearVocabWord()}>Done</button></div>
          </div>
        </Modal>
      )
    }
  }

  render() {
    return (
      <div className="d-fl-r ai-c">
        <h3 className="m-r-1 focus">Focus Words</h3>
        {this.renderModal()}
        <div className="tags">
          {this.props.vocabWords.map(word => (<a className="tag large" key={word.id} onClick={e => this.selectVocabWord(word)} >{word.text}</a>))}
        </div>
      </div>
    )
  }
}
