import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateData,
  loadScoreData,
  checkTimeout
} from '../../actions/scoreAnalysis.js';
import LoadingSpinner from '../shared/spinner.jsx';
import QuestionRow from './questionRow.jsx';
import { hashToCollection } from '../../libs/hashToCollection.js';
import { getParameterByName } from '../../libs/getParameterByName'
import _ from 'underscore';
import {oldFlagToNew} from '../../libs/flagMap'

class ScoreAnalysis extends Component {
  constructor(props) {
    super();

    const questionType = getParameterByName('questionType')
                          ? this.getQuestionTypeFromAbbreviation(getParameterByName('questionType'))
                          : null
    const status = getParameterByName('status')
                          ? this.getStatusFromAbbreviation(getParameterByName('status'))
                          : null
    this.state = {
      sort: 'weakResponses',
      direction: 'dsc',
      questionType,
      status,
      questionData: [],
      flag: 'production'
    };

    this.updateQuestionTypeFilter = this.updateQuestionTypeFilter.bind(this)
    this.updateStatusFilter = this.updateStatusFilter.bind(this)
    this.formatDataForTable = this.formatDataForTable.bind(this)
    this.getAbbreviationFromQuestionType = this.getAbbreviationFromQuestionType.bind(this)
    this.getAbbreviationFromStatus = this.getAbbreviationFromStatus.bind(this)
    this.formatDataForQuestionType = this.formatDataForQuestionType.bind(this)
    this.updateFlag = this.updateFlag.bind(this)
  }

  componentWillMount() {
    checkTimeout();
    this.props.dispatch(loadScoreData());
    const { scoreAnalysis, questions, diagnosticQuestions, sentenceFragments, fillInBlank } = this.props
    if (scoreAnalysis.hasreceiveddata && questions.hasreceiveddata && diagnosticQuestions.hasreceiveddata && sentenceFragments.hasreceiveddata && fillInBlank.hasreceiveddata) {
      if (this.state.questionData.length === 0) {
        this.formatData(this.props)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { scoreAnalysis, questions, diagnosticQuestions, sentenceFragments, fillInBlank } = nextProps
    if (scoreAnalysis.hasreceiveddata && questions.hasreceiveddata && diagnosticQuestions.hasreceiveddata && sentenceFragments.hasreceiveddata && fillInBlank.hasreceiveddata) {
      if (!_.isEqual(nextProps.scoreAnalysis.data, this.props.scoreAnalysis.data) || this.state.questionData.length === 0) {
        this.formatData(nextProps)
      }
    }
  }

  clickSort(sort) {
    let direction = 'dsc';
    if (this.state.sort === sort) {
      direction = this.state.direction === 'dsc' ? 'asc' : 'dsc';
    }
    this.setState({
      sort, direction,
    });
  }

  formatData(props) {
    const { questions, diagnosticQuestions, sentenceFragments, fillInBlank, concepts, scoreAnalysis, } = props;
    // const validConcepts = _.map(concepts.data[0], con => con.uid);
    const formattedQuestions = this.formatDataForQuestionType(questions.data, scoreAnalysis, 'Sentence Combining', 'questions')
    const formattedDiagnosticQuestions = this.formatDataForQuestionType(diagnosticQuestions.data, scoreAnalysis, 'Diagnostic Question', 'diagnostic-questions')
    const formattedSentenceFragments = this.formatDataForQuestionType(sentenceFragments.data, scoreAnalysis, 'Sentence Fragment', 'sentence-fragments')
    const formattedFillInBlank = this.formatDataForQuestionType(fillInBlank.data, scoreAnalysis, 'Fill In Blank', 'fill-in-the-blanks')
    const formatted = [...formattedQuestions, ...formattedDiagnosticQuestions, ...formattedSentenceFragments, ...formattedFillInBlank]
    this.setState({questionData: _.compact(formatted)})
  }

  formatDataForQuestionType(questionData, scoreAnalysis, typeName, pathName) {
    return _.map(hashToCollection(questionData), (question) => {
      const scoreData = scoreAnalysis.data[question.key];
      if (scoreData) {
        console.log('scoreData', scoreData.activities)
        const percentageWeakResponses = Math.round(scoreData.common_unmatched_responses/scoreData.responses * 100)
        return {
          key: `${question.key}-${typeName}`,
          uid: question.key,
          questionType: typeName,
          prompt: question.prompt ? question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '') : '',
          responses: scoreData.responses || 0,
          weakResponses: percentageWeakResponses,
          status: this.getStatusFromPercentage(percentageWeakResponses),
          hasModelConcept: !!question.modelConceptUID,
          focusPoints: question.focusPoints ? Object.keys(question.focusPoints).length : 0,
          incorrectSequences: question.incorrectSequences ? Object.keys(question.incorrectSequences).length : 0,
          flag: question.flag,
          pathName,
          activities: scoreData.activities || []
        };
      }
    });
  }

  formatDataForTable() {
    let filteredData = this.state.questionData
    if (this.state.questionType) {
      filteredData = filteredData.filter((q) => q && q.questionType === this.state.questionType)
    }
    if (this.state.status) {
      filteredData = filteredData.filter((q) => q && q.status === this.state.status)
    }
    if (this.state.flag) {
      filteredData = filteredData.filter((q) => q && q.flag === this.state.flag || q.flag === oldFlagToNew[this.state.flag])
    }
    return _.compact(filteredData);
  }

  getStatusFromPercentage(percentage) {
    if (percentage > 5) {
      return 'Very Weak'
    } else if (percentage > 2) {
      return 'Weak'
    } else if (percentage > 0.5) {
      return 'Okay'
    } else {
      return 'Strong'
    }
  }

  updateQuestionTypeFilter(e) {
    this.setState({questionType: this.getQuestionTypeFromAbbreviation(e.target.value)}, this.updateUrl)
  }

  updateStatusFilter(e) {
    this.setState({status: this.getStatusFromAbbreviation(e.target.value)}, this.updateUrl)
  }

  updateFlag(e) {
    this.setState({flag: e.target.value})
  }

  updateUrl() {
    let newUrl
    const questionTypeAbbrev = this.state.questionType ? this.getAbbreviationFromQuestionType(this.state.questionType) : null
    const statusAbbrev = this.state.status ? this.getAbbreviationFromStatus(this.state.status) : null
    if (questionTypeAbbrev && statusAbbrev) {
      newUrl = `/admin/datadash?questionType=${questionTypeAbbrev}&status=${statusAbbrev}`
    } else if (questionTypeAbbrev) {
      newUrl = `/admin/datadash?questionType=${questionTypeAbbrev}`
    } else if (statusAbbrev) {
      newUrl = `/admin/datadash?status=${statusAbbrev}`
    } else {
      newUrl = `/admin/datadash`
    }
    this.props.router.push(newUrl)
  }

  getQuestionTypeFromAbbreviation(abbrev) {
    switch (abbrev) {
      case 'all':
        return null
      case 'sc':
        return 'Sentence Combining'
      case 'sf':
        return 'Sentence Fragment'
      case 'dq':
        return 'Diagnostic Question'
      case 'fib':
        return 'Fill In Blank'
    }
  }

  getAbbreviationFromQuestionType(questionType) {
    switch (questionType) {
      case 'Sentence Combining':
        return 'sc'
      case 'Sentence Fragment':
        return 'sf'
      case 'Diagnostic Question':
        return 'dq'
      case 'Fill In Blank':
        return 'fib'
      default:
        return 'all'
    }
  }

  getStatusFromAbbreviation(abbrev) {
    switch (abbrev) {
      case 'all':
        return null
      case 'vw':
        return 'Very Weak'
      case 'w':
        return 'Weak'
      case 'o':
        return 'Okay'
      case 's':
        return 'Strong'
    }
  }

  getAbbreviationFromStatus(status) {
    switch (status) {
      case 'Very Weak':
        return 'vw'
      case 'Weak':
        return 'w'
      case 'Okay':
        return 'o'
      case 'Strong':
        return 's'
      default:
        return 'all'
    }
  }

  sortData(data) {
    switch (this.state.sort) {
      case 'responses':
      case 'weakResponses':
      case 'incorrectSequences':
      case 'focusPoints':
      case 'hasModelConcept':
        return this.sortNumerically(data)
      case 'status':
        return this.sortByStatus(data)
      case 'activities':
        return this.sortByActivity(data)
      case 'questionType':
      case 'prompt':
      case 'flag':
      default:
        return this.sortAlphabetically(data);
    }
  }

  sortNumerically(data) {
    return data.sort((a, b) => a[this.state.sort] - b[this.state.sort])
  }

  sortAlphabetically(data) {
    return data.sort((a, b) => {
      const aSort = a[this.state.sort] ? a[this.state.sort] : ''
      const bSort = b[this.state.sort] ? b[this.state.sort] : ''
      return aSort.localeCompare(bSort)
    })
  }

  sortByStatus(data) {
    const statusOrder = ['Very Weak', 'Weak', 'Okay', 'Strong']
    return data.sort((a, b) => statusOrder.indexOf(a[this.state.sort]) - statusOrder.indexOf(b[this.state.sort]))
  }

  sortByActivity(data) {
    return data.sort((a, b) => {
      const aSort = a[this.state.sort] && a[this.state.sort][0] ? a[this.state.sort][0].name : ''
      const bSort = b[this.state.sort] && b[this.state.sort][0] ? b[this.state.sort][0].name : ''
      return aSort.localeCompare(bSort)
    })
  }

  renderRows() {
    const data = this.formatDataForTable()
    const sorted = this.sortData(data)
    const directed = this.state.direction === 'dsc' ? sorted.reverse() : sorted;
    return _.map(directed, question => (
      <QuestionRow key={question.key} question={question} uid={question.uid} />
    ));
  }

  renderOptions() {
    const innerDivStyle = {display: 'flex', alignItems: 'center', marginRight: '10px'}
    const labelStyle = {marginRight: '10px'}
    const flagValue = this.state.flag ? this.state.flag : 'all'
    return <div style={{display: 'flex', marginBottom: '15px'}}>
      <div style={innerDivStyle}>
        <label style={labelStyle}>Question Type:</label>
        <select value={this.getAbbreviationFromQuestionType(this.state.questionType)} onChange={this.updateQuestionTypeFilter}>
          <option value="all">All</option>
          <option value="sc">Sentence Combining</option>
          <option value="sf">Sentence Fragment</option>
          <option value="dq">Diagnostic Question</option>
          <option value="fib">Fill In Blank</option>
        </select>
      </div>
      <div style={innerDivStyle}>
        <label style={labelStyle}>Health Status:</label>
        <select value={this.getAbbreviationFromStatus(this.state.status)} onChange={this.updateStatusFilter}>
          <option value="all">All</option>
          <option value="vw">Very Weak</option>
          <option value="w">Weak</option>
          <option value="o">Okay</option>
          <option value="s">Strong</option>
        </select>
      </div>
      <div style={innerDivStyle}>
          <label style={labelStyle}>Question Flag:</label>
          <select value={flagValue} onChange={this.updateFlag}>
            <option value="all">All</option>
            <option value="archived">Archived</option>
            <option value="alpha">Alpha</option>
            <option value="beta">Beta</option>
            <option value="production">Production</option>
          </select>
      </div>
    </div>
  }

  render() {
    const { questions, scoreAnalysis, concepts, } = this.props;
    if (this.state.questionData.length > 0) {
      return (
        <div>
          {this.renderOptions()}
          <table className="table is-striped is-bordered">
            <thead>
              <tr>
                <th onClick={this.clickSort.bind(this, 'questionType')}>Type</th>
                <th width="600px" onClick={this.clickSort.bind(this, 'prompt')}>Prompt</th>
                <th onClick={this.clickSort.bind(this, 'responses')}>Responses</th>
                <th onClick={this.clickSort.bind(this, 'weakResponses')}>Weak Responses</th>
                <th onClick={this.clickSort.bind(this, 'status')}>Status</th>
                <th onClick={this.clickSort.bind(this, 'focusPoints')}>Required #</th>
                <th onClick={this.clickSort.bind(this, 'incorrectSequences')}>Incorrect #</th>
                <th onClick={this.clickSort.bind(this, 'hasModelConcept')}>Model</th>
                <th onClick={this.clickSort.bind(this, 'flag')}>Flag</th>
                <th onClick={this.clickSort.bind(this, 'activities')}>Activity</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </div>
      );
    }
    return (<LoadingSpinner />);
  }

}

function select(state) {
  return {
    questions: state.questions,
    diagnosticQuestions: state.diagnosticQuestions,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank,
    concepts: state.concepts,
    scoreAnalysis: state.scoreAnalysis,
    routing: state.routing,
  };
}

export default connect(select)(ScoreAnalysis);
