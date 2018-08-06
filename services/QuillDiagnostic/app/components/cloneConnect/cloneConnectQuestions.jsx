import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  cloneConnectSentenceCombiningQuestion
} from '../../actions/connectSentenceCombining.ts'
import {
  cloneConnectFillInBlankQuestion
} from '../../actions/connectFillInBlank'
import {
  cloneConnectSentenceFragmentsQuestion
} from '../../actions/connectSentenceFragments'
// import {
//   QuestionList,
//   hashToCollection,
//   ArchivedButton
// } from 'quill-component-library/dist/componentLibrary';

class CloneConnectQuestions extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  renderFillInBlankQuestions() {
    const { connectFillInBlank } = this.props
    if (connectFillInBlank && connectFillInBlank.questions) {
      const questions = Object.keys(connectFillInBlank.questions).map(k => {
        const question = connectFillInBlank.questions[k]
        return <p>{question.prompt}</p>
      })
      return <div>
        <h3>Fill in the Blank Questions</h3>
        {questions}
      </div>
    }
  }

  renderSentenceFragmentQuestions() {
    const { connectSentenceFragments } = this.props
    if (connectSentenceFragments && connectSentenceFragments.questions) {
      const questions = Object.keys(connectSentenceFragments.questions).map(k => {
        const question = connectSentenceFragments.questions[k]
        return <p>{question.prompt}</p>
      })
      return <div>
        <h3>Sentence Fragments</h3>
        {questions}
      </div>
    }
  }


  renderSentenceCombiningQuestions() {
    const { connectSentenceCombining } = this.props
    if (connectSentenceCombining && connectSentenceCombining.questions) {
      const questions = Object.keys(connectSentenceCombining.questions).map(k => {
        const question = connectSentenceCombining.questions[k]
          return <p>{question.prompt}</p>
      })
      return <div>
        <h3>Sentence Combining Questions</h3>
        {questions}
      </div>
    }
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          {this.renderFillInBlankQuestions()}
          {this.renderSentenceFragmentQuestions()}
          {this.renderSentenceCombiningQuestions()}
        </div>
      </section>
    );
  }

}

function select(props) {
  return {
    connectFillInBlank: props.connectFillInBlank,
    connectSentenceFragments: props.connectSentenceFragments,
    connectSentenceCombining: props.connectSentenceCombining
  };
}

export default connect(select)(CloneConnectQuestions);
