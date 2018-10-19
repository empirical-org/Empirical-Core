import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  loadScoreData,
  checkTimeout
} from '../../actions/scoreAnalysis.js';
import { Spinner } from 'quill-component-library/dist/componentLibrary'
import { oldFlagToNew } from '../../libs/flagMap'
import _ from 'lodash';

class questionHealth extends Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
      sc: {},
      sf: {},
      fib: {},
      flag: 'production'
    }

    this.updateFlag = this.updateFlag.bind(this)
    this.filterByFlag = this.filterByFlag.bind(this)
    this.filterQuestions = this.filterQuestions.bind(this)
  }

  componentWillMount() {
    checkTimeout();
    this.props.dispatch(loadScoreData());
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.loading) {
      const sc = Object.keys(nextState.sc)
      const sf = Object.keys(nextState.sf)
      const fib = Object.keys(nextState.fib)
      if (sc && sc.length && sf && sf.length && fib && fib.length) {
        this.setState({loading: false})
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { scoreAnalysis, questions, sentenceFragments, fillInBlank } = nextProps
    if (scoreAnalysis.hasreceiveddata && questions.hasreceiveddata && sentenceFragments.hasreceiveddata && fillInBlank.hasreceiveddata) {
      this.filterQuestions(scoreAnalysis, questions, sentenceFragments, fillInBlank)
      // if (nextProps.questions.hasreceiveddata) {
      //   this.setSentenceCombiningQuestions(nextProps.scoreAnalysis.data, nextProps.questions.data)
      // }
      // if (nextProps.diagnosticQuestions.hasreceiveddata) {
      //   this.setDiagnosticQuestions(nextProps.scoreAnalysis.data, nextProps.diagnosticQuestions.data)
      // }
      // if (nextProps.sentenceFragments.hasreceiveddata) {
      //   this.setSentenceFragments(nextProps.scoreAnalysis.data, nextProps.sentenceFragments.data)
      // }
      // if (nextProps.fillInBlank.hasreceiveddata) {
      //   this.setFillInBlankQuestions(nextProps.scoreAnalysis.data, nextProps.fillInBlank.data)
      // }
    }
  }

  updateFlag(e) {
    const { scoreAnalysis, questions, sentenceFragments, fillInBlank } = this.props
    const flag = e.target.value === 'all' ? null : e.target.value
    this.setState({flag: flag}, () => this.filterQuestions(scoreAnalysis, questions, sentenceFragments, fillInBlank))
  }

  filterByFlag(q) {
    return q.flag === this.state.flag || q.flag === oldFlagToNew[this.state.flag]
  }

  filterQuestions(
    scoreAnalysis,
    questions,
    sentenceFragments,
    fillInBlank
  ) {
    const questionData = questions.data
    const sentenceFragmentData = sentenceFragments.data
    const fillInBlankData = fillInBlank.data
    let filteredQuestionData, filteredSentenceFragmentData, filteredFillInBlankQuestionData
    if (this.state.flag) {
      filteredQuestionData = _.pickBy(questionData, this.filterByFlag)
      filteredSentenceFragmentData = _.pickBy(sentenceFragmentData, this.filterByFlag)
      filteredFillInBlankQuestionData = _.pickBy(fillInBlankData, this.filterByFlag)
    } else {
      filteredQuestionData = questionData
      filteredSentenceFragmentData = sentenceFragmentData
      filteredFillInBlankQuestionData = fillInBlankData
    }
    this.setSentenceCombiningQuestions(scoreAnalysis.data, filteredQuestionData)
    this.setSentenceFragments(scoreAnalysis.data, filteredSentenceFragmentData)
    this.setFillInBlankQuestions(scoreAnalysis.data, filteredFillInBlankQuestionData)
  }

  setSentenceCombiningQuestions(analyzedQuestions, sentenceCombiningQuestions) {
    const sc = []
    const sentenceCombiningKeys = Object.keys(sentenceCombiningQuestions)
    sentenceCombiningKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        const scoredQuestion = analyzedQuestions[uid]
        scoredQuestion.flag = sentenceCombiningQuestions[uid].flag
        sc.push(scoredQuestion)
      }
    })
    this.analyzeQuestions(sc, 'sc')
  }

  setSentenceFragments(analyzedQuestions, sentenceFragmentQuestions) {
    const sf = []
    const sentenceFragmentKeys = Object.keys(sentenceFragmentQuestions)
    sentenceFragmentKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        const scoredQuestion = analyzedQuestions[uid]
        scoredQuestion.flag = sentenceFragmentQuestions[uid].flag
        sf.push(scoredQuestion)
      }
    })
    this.analyzeQuestions(sf, 'sf')
  }

  setFillInBlankQuestions(analyzedQuestions, fillInBlankQuestions) {
    const fib = []
    const fillInBlankKeys = Object.keys(fillInBlankQuestions)
    fillInBlankKeys.forEach((uid) => {
      if (analyzedQuestions[uid]) {
        const scoredQuestion = analyzedQuestions[uid]
        scoredQuestion.flag = fillInBlankQuestions[uid].flag
        fib.push(scoredQuestion)
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
      const percentageUnmatched = Math.round(q.common_unmatched_responses/q.responses * 100)
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
    groupedScores.percentageWeak = this.getPercentageWeak(groupedScores.veryWeak.length, groupedScores.weak.length, groupedScores.totalNumber)
    groupedScores.status = this.getStatus(groupedScores.percentageWeak)
    groupedScores.name = this.getName(keyName)
    this.setState({[keyName]: groupedScores})
  }

  getPercentageWeak(veryWeakNumber, weakNumber, totalNumber) {
    if (totalNumber) {
      return Math.round((veryWeakNumber + weakNumber)/totalNumber * 100)
    } else {
      return 0
    }
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
      case 'fib':
        return 'Fill In Blank'
    }
  }

  renderQuestionTypeStatusTable() {
    return <div className="status-table">
      <h2>Question Type Status</h2>
      {this.renderQuestionTypeRow('sc')}
      {this.renderQuestionTypeRow('sf')}
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

  renderFlagDropdown() {
    const selectedValue = this.state.flag ? this.state.flag : 'all'
    const labelStyle = {marginRight: '10px'}
    return <div style={{marginTop: '5px', }}>
      <label style={labelStyle}>Question Flag:</label>
      <select value={selectedValue} onChange={this.updateFlag}>
      <option value="all">All</option>
      <option value="archived">Archived</option>
      <option value="alpha">Alpha</option>
      <option value="beta">Beta</option>
      <option value="production">Production</option>
    </select>
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
      return <Spinner />
    } else {
      return <div className="question-health">
        <h1>Data Dashboard - Health of Questions</h1>
        {this.renderFlagDropdown()}
        {this.renderQuestionTypeStatusTable()}
        {this.renderQuestionTypeTable('sc')}
        {this.renderQuestionTypeTable('sf')}
        {this.renderQuestionTypeTable('fib')}
      </div>
    }
  }
}

function select(state) {
  return {
    questions: state.questions,
    scoreAnalysis: state.scoreAnalysis,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank,
    lessons: state.lessons
  };
}

export default connect(select)(questionHealth);
