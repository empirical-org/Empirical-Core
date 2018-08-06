import React, { Component } from 'react';
import { connect } from 'react-redux';
import Question from './question.tsx'
import {
  cloneConnectSentenceCombiningQuestion
} from '../../actions/connectSentenceCombining'
import {
  cloneConnectFillInBlankQuestion
} from '../../actions/connectFillInBlank'
import {
  cloneConnectSentenceFragment
} from '../../actions/connectSentenceFragments.ts'

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
        return (<Question
          cloneFunction={() => cloneConnectFillInBlankQuestion(k)}
          prompt={question.prompt}
        />)
      })
      return <div>
        <h3 style={{ fontWeight: '600', fontSize: '24px' }}>Fill in the Blank Questions</h3>
        {questions}
      </div>
    }
  }

  renderSentenceFragmentQuestions() {
    const { connectSentenceFragments } = this.props
    if (connectSentenceFragments && connectSentenceFragments.questions) {
      const questions = Object.keys(connectSentenceFragments.questions).map(k => {
        const question = connectSentenceFragments.questions[k]
        return (<Question
          cloneFunction={() => cloneConnectSentenceFragment(k)}
          prompt={question.prompt}
        />)
      })
      return <div>
        <h3 style={{ fontWeight: '600', fontSize: '24px' }}>Sentence Fragments</h3>
        {questions}
      </div>
    }
  }


  renderSentenceCombiningQuestions() {
    const { connectSentenceCombining } = this.props
    if (connectSentenceCombining && connectSentenceCombining.questions) {
      const questions = Object.keys(connectSentenceCombining.questions).map(k => {
        const question = connectSentenceCombining.questions[k]
        return (<Question
          cloneFunction={() => cloneConnectSentenceCombiningQuestion(k)}
          prompt={question.prompt}
        />)
      })
      return <div>
        <h3 style={{ fontWeight: '600', fontSize: '24px' }}>Sentence Combining Questions</h3>
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
