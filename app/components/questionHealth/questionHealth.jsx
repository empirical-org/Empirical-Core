import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  loadScoreData,
  checkTimeout
} from '../../actions/scoreAnalysis.js';
import LoadingSpinner from '../shared/spinner.jsx';
import { hashToCollection } from '../../libs/hashToCollection.js';
import _ from 'underscore';

class questionHealth extends Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
      sentenceCombiningQuestionScores: {},
      sentenceFragmentQuestionScores: {},
      diagnosticQuestionScores: {},
      fillInBlankQuestionScores: {}
    }
  }

  componentWillMount() {
    checkTimeout();
    this.props.dispatch(loadScoreData());
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.loading) {
      const sc = Object.keys(nextState.sentenceCombiningQuestionScores)
      const sf = Object.keys(nextState.sentenceFragmentQuestionScores)
      const dq = Object.keys(nextState.diagnosticQuestionScores)
      const fib = Object.keys(nextState.fillInBlankQuestionScores)
      console.log('component will update')
      console.log(nextState)
      if (sc && sc.length && sf && sf.length && dq && dq.length && fib && fib.length) {
        this.setState({loading: false})
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scoreAnalysis.hasreceiveddata) {
      if (nextProps.questions.hasreceiveddata) {
        this.setSentenceCombiningQuestions(nextProps.scoreAnalysis.data, nextProps.questions.data)
      }
      if (nextProps.diagnosticQuestions.hasreceiveddata) {
        this.setDiagnosticQuestions(nextProps.scoreAnalysis.data, nextProps.diagnosticQuestions.data)
      }
      if (nextProps.sentenceFragments.hasreceiveddata) {
        this.setSentenceFragments(nextProps.scoreAnalysis.data, nextProps.sentenceFragments.data)
      }
      if (nextProps.fillInBlank.hasreceiveddata) {
        this.setFillInBlankQuestions(nextProps.scoreAnalysis.data, nextProps.fillInBlank.data)
      }
    }
  }

  setSentenceCombiningQuestions(analyzedQuestions, sentenceCombiningQuestions) {
    const sentenceCombiningQuestionScores = []
    const sentenceCombiningKeys = Object.keys(sentenceCombiningQuestions)
    sentenceCombiningKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        sentenceCombiningQuestionScores.push(analyzedQuestions[uid])
      }
    })
    this.analyzeQuestions(sentenceCombiningQuestionScores, 'sentenceCombiningQuestionScores')
  }

  setDiagnosticQuestions(analyzedQuestions, diagnosticQuestions) {
    const diagnosticQuestionScores = []
    const diagnosticKeys = Object.keys(diagnosticQuestions)
    diagnosticKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        diagnosticQuestionScores.push(analyzedQuestions[uid])
      }
    })
    this.analyzeQuestions(diagnosticQuestionScores, 'diagnosticQuestionScores')
  }

  setSentenceFragments(analyzedQuestions, sentenceFragmentQuestions) {
    const sentenceFragmentQuestionScores = []
    const sentenceFragmentKeys = Object.keys(sentenceFragmentQuestions)
    sentenceFragmentKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        sentenceFragmentQuestionScores.push(analyzedQuestions[uid])
      }
    })
    this.analyzeQuestions(sentenceFragmentQuestionScores, 'sentenceFragmentQuestionScores')
  }

  setFillInBlankQuestions(analyzedQuestions, fillInBlankQuestions) {
    const fillInBlankQuestionScores = []
    const fillInBlankKeys = Object.keys(fillInBlankQuestions)
    fillInBlankKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        fillInBlankQuestionScores.push(analyzedQuestions[uid])
      }
    })
    this.analyzeQuestions(fillInBlankQuestionScores, 'fillInBlankQuestionScores')
  }

  analyzeQuestions(scores, keyName) {
    const groupedScores = {
      totalNumber: scores.length,
      veryWeak: [],
      weak: [],
      okay: [],
      strong: []
    }
    scores.forEach((q) => {
      const percentageUnmatched = q.unmatched_responses/q.responses * 100
      if (percentageUnmatched > 5) {
        groupedScores.veryWeak.push(q)
      } else if (percentageUnmatched > 2) {
        groupedScores.weak.push(q)
      } else if (percentageUnmatched > 0.5) {
        groupedScores.okay.push(q)
      } else {
        groupedScores.strong.push(q)
      }
    })
    groupedScores.percentageWeak = Math.round((groupedScores.veryWeak.length + groupedScores.weak.length)/groupedScores.totalNumber * 100)
    groupedScores.status = this.getStatus(groupedScores.percentageWeak)
    console.log('i ran')
    this.setState({[keyName]: groupedScores})
  }

  getStatus(percentage) {
    if (percentage > 20) {
      return 'On Fire'
    } else if (percentage > 10) {
      return 'Bad'
    } else if (percentage > 5) {
      return 'Good'
    } else {
      return 'Great'
    }
  }

  renderQuestionTypeStatusTable() {
    const sc = this.state.sentenceCombiningQuestionScores
    const sf = this.state.sentenceFragmentQuestionScores
    const fib = this.state.fillInBlankQuestionScores
    const dq = this.state.diagnosticQuestionScores
    return <div>
      <div className="row"><span>Sentence Combining:</span><span>{sc.status}</span><span>{sc.percentageWeak} of questions are weak</span></div>
      <div className="row"><span>Sentence Fragments:</span><span>{sf.status}</span><span>{sf.percentageWeak} of questions are weak</span></div>
      <div className="row"><span>Fill In Blank:</span><span>{fib.status}</span><span>{fib.percentageWeak} of questions are weak</span></div>
      <div className="row"><span>Diagnostic Questions:</span><span>{dq.status}</span><span>{dq.percentageWeak} of questions are weak</span></div>
    </div>
  }

  render() {
    if (this.state.loading) {
      return <LoadingSpinner />
    } else {
      return <div className="question-health">
        <h1>Data Dashboard - Health of Questions</h1>
        <h2>Question Type Status</h2>
        {this.renderQuestionTypeStatusTable()}
      </div>
    }
  }
}

function select(state) {
  return {
    questions: state.questions,
    scoreAnalysis: state.scoreAnalysis,
    diagnosticQuestions: state.diagnosticQuestions,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank
  };
}

export default connect(select)(questionHealth);
