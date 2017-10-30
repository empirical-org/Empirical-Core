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
      sc: {},
      sf: {},
      dq: {},
      fib: {}
    }
  }

  componentWillMount() {
    checkTimeout();
    this.props.dispatch(loadScoreData());
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.loading) {
      const sc = Object.keys(nextState.sc)
      const sf = Object.keys(nextState.sf)
      const dq = Object.keys(nextState.dq)
      const fib = Object.keys(nextState.fib)
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
    const sc = []
    const sentenceCombiningKeys = Object.keys(sentenceCombiningQuestions)
    sentenceCombiningKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        sc.push(analyzedQuestions[uid])
      }
    })
    this.analyzeQuestions(sc, 'sc')
  }

  setDiagnosticQuestions(analyzedQuestions, diagnosticQuestions) {
    const dq = []
    const diagnosticKeys = Object.keys(diagnosticQuestions)
    diagnosticKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        dq.push(analyzedQuestions[uid])
      }
    })
    this.analyzeQuestions(dq, 'dq')
  }

  setSentenceFragments(analyzedQuestions, sentenceFragmentQuestions) {
    const sf = []
    const sentenceFragmentKeys = Object.keys(sentenceFragmentQuestions)
    sentenceFragmentKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        sf.push(analyzedQuestions[uid])
      }
    })
    this.analyzeQuestions(sf, 'sf')
  }

  setFillInBlankQuestions(analyzedQuestions, fillInBlankQuestions) {
    const fib = []
    const fillInBlankKeys = Object.keys(fillInBlankQuestions)
    fillInBlankKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        fib.push(analyzedQuestions[uid])
      }
    })
    this.analyzeQuestions(fib, 'fib')
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
      const percentageUnmatched = q.common_unmatched_responses/q.responses * 100
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
    groupedScores.name = this.getName(keyName)
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

  getName(keyName) {
    switch (keyName) {
      case 'sc':
        return 'Sentence Combining'
      case 'sf':
        return 'Sentence Fragments'
      case 'dq':
        return 'Diagnostic Questions'
      case 'fib':
        return 'Fill In Blank'
    }
  }

  renderQuestionTypeStatusTable() {
    return <div className="status-table">
      <h2>Question Type Status</h2>
      {this.renderQuestionTypeRow('sc')}
      {this.renderQuestionTypeRow('sf')}
      {this.renderQuestionTypeRow('dq')}
      {this.renderQuestionTypeRow('fib')}
    </div>
  }

  renderQuestionTypeRow(questionType) {
    const data = this.state[questionType]
    return <div className="row">
      <span>{data.name}</span>
      <span className="bold">{data.status}</span>
      <span>{data.percentageWeak}% of questions are weak</span>
    </div>
  }

  renderQuestionTypeTable(questionType) {
    const data = this.state[questionType]
    return <div className="question-type-table">
      <h2>{data.name}: {data.totalNumber} Active Questions</h2>
      <div className="row"><span className="bold">Status</span><span className="bold">{data.status}</span><span>{data.percentageWeak}% of questions are weak</span></div>
      {this.renderVeryWeakRow(data, questionType)}
      {this.renderWeakRow(data, questionType)}
      {this.renderOkayRow(data, questionType)}
      {this.renderStrongRow(data, questionType)}
    </div>
  }

  renderVeryWeakRow(data, questionType) {
    const numberOfRelevantAnswers = data.veryWeak.length
    const percentageOfTotalAnswers = Math.round(numberOfRelevantAnswers/data.totalNumber * 100)
    return <div className="row">
      <span>Very Weak (>5% Unmatched):</span>
      <span>{percentageOfTotalAnswers}% of Questions ({numberOfRelevantAnswers})</span>
      <a href={`/#/admin/datadash?questionType=${questionType}&status=vw`}>See Very Weak</a>
    </div>
  }

  renderWeakRow(data, questionType) {
    const numberOfRelevantAnswers = data.weak.length
    const percentageOfTotalAnswers = Math.round(numberOfRelevantAnswers/data.totalNumber * 100)
    return <div className="row">
      <span>Weak (5%-2% Unmatched):</span>
      <span>{percentageOfTotalAnswers}% of Questions ({numberOfRelevantAnswers})</span>
      <a href={`/#/admin/datadash?questionType=${questionType}&status=w`}>See Weak</a>
    </div>
  }


  renderOkayRow(data, questionType) {
    const numberOfRelevantAnswers = data.okay.length
    const percentageOfTotalAnswers = Math.round(numberOfRelevantAnswers/data.totalNumber * 100)
    return <div className="row">
      <span>Okay (2%-0.5% Unmatched):</span>
      <span>{percentageOfTotalAnswers}% of Questions ({numberOfRelevantAnswers})</span>
      <a href={`/#/admin/datadash?questionType=${questionType}&status=o`}>See Okay</a>
    </div>
  }


  renderStrongRow(data, questionType) {
    const numberOfRelevantAnswers = data.strong.length
    const percentageOfTotalAnswers = Math.round(numberOfRelevantAnswers/data.totalNumber * 100)
    return <div className="row">
      <span>Strong (0.5%-0% Unmatched):</span>
      <span>{percentageOfTotalAnswers}% of Questions ({numberOfRelevantAnswers})</span>
      <a href={`/#/admin/datadash?questionType=${questionType}&status=s`}>See Strong</a>
    </div>
  }

  render() {
    if (this.state.loading) {
      return <LoadingSpinner />
    } else {
      return <div className="question-health">
        <h1>Data Dashboard - Health of Questions</h1>
        {this.renderQuestionTypeStatusTable()}
        {this.renderQuestionTypeTable('sc')}
        {this.renderQuestionTypeTable('sf')}
        {this.renderQuestionTypeTable('dq')}
        {this.renderQuestionTypeTable('fib')}
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
