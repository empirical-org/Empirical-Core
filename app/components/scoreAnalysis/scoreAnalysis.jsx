import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  loadScoreData,
  checkTimeout
} from '../../actions/scoreAnalysis.js';
import LoadingSpinner from '../shared/spinner.jsx';
import QuestionRow from './questionRow.jsx';
import { hashToCollection } from '../../libs/hashToCollection.js';
import { getParameterByName } from '../../libs/getParameterByName'
import _ from 'underscore';

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
      minResponses: 150,
      sentenceCombiningKeys: [],
      diagnosticQuestionKeys: [],
      sentenceFragmentKeys: [],
      fillInBlankKeys: [],
      questionType: questionType,
      status: status,
      questionData: [],
      questionTypesLoaded: false
    };

    this.updateQuestionTypeFilter = this.updateQuestionTypeFilter.bind(this)
    this.updateStatusFilter = this.updateStatusFilter.bind(this)
    this.formatDataForTable = this.formatDataForTable.bind(this)
    this.getAbbreviationFromQuestionType = this.getAbbreviationFromQuestionType.bind(this)
    this.getAbbreviationFromStatus = this.getAbbreviationFromStatus.bind(this)
  }

  componentWillMount() {
    checkTimeout();
    this.props.dispatch(loadScoreData());
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.questionTypesLoaded === false) {
      if (this.state.sentenceCombiningKeys.length && this.state.sentenceFragmentKeys.length && this.state.diagnosticQuestionKeys.length && this.state.fillInBlankKeys.length) {
        this.setState({questionTypesLoaded: true}, this.formatData(nextProps))
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scoreAnalysis.hasreceiveddata) {
      if (nextProps.questions.hasreceiveddata) {
        this.setState({sentenceCombiningKeys: Object.keys(nextProps.questions.data)})
      }
      if (nextProps.diagnosticQuestions.hasreceiveddata) {
        this.setState({diagnosticQuestionKeys: Object.keys(nextProps.diagnosticQuestions.data)})
      }
      if (nextProps.sentenceFragments.hasreceiveddata) {
        this.setState({sentenceFragmentKeys: Object.keys(nextProps.sentenceFragments.data)})
      }
      if (nextProps.fillInBlank.hasreceiveddata) {
        this.setState({fillInBlankKeys: Object.keys(nextProps.fillInBlank.data)})
      }
      if (this.state.questionTypesLoaded && !_.isEqual(nextProps.scoreAnalysis.data, this.props.scoreAnalysis.data)) {
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
    const { questions, concepts, scoreAnalysis, } = props;
    const validConcepts = _.map(concepts.data[0], con => con.uid);
    const formatted = _.map(hashToCollection(questions.data).filter(e => validConcepts.includes(e.conceptID)), (question) => {
      const scoreData = scoreAnalysis.data[question.key];
      if (scoreData && scoreData.total_attempts >= this.state.minResponses) {
        const percentageWeakResponses = Math.round(scoreData.common_unmatched_responses/scoreData.responses * 100)
        return {
          key: question.key,
          type: this.getQuestionTypeFromQuestionKey(question.key),
          prompt: question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''),
          responses: scoreData.responses || 0,
          weakResponses: percentageWeakResponses,
          status: this.getStatusFromPercentage(percentageWeakResponses),
          hasModelConcept: !!question.modelConceptUID,
          focusPoints: question.focusPoints ? Object.keys(question.focusPoints).length : 0,
          incorrectSequences: question.incorrectSequences ? Object.keys(question.incorrectSequences).length : 0,
        };
      }
    });
    this.setState({questionData: formatted})
  }

  formatDataForTable() {
    let filteredData = this.state.questionData
    if (this.state.questionType) {
      filteredData = filteredData.filter((q) => q && q.type === this.state.questionType)
    }
    if (this.state.status) {
      filteredData = filteredData.filter((q) => q && q.status === this.state.status)
    }
    return _.compact(filteredData);
  }

  getQuestionTypeFromQuestionKey(questionKey) {
    if (this.state.sentenceCombiningKeys.includes(questionKey)) {
      return 'Sentence Combining'
    } else if (this.state.diagnosticQuestionKeys.includes(questionKey)) {
      return 'Diagnostic Question'
    } else if (this.state.sentenceFragmentKeys.includes(questionKey)) {
      return 'Sentence Fragment'
    } else if (this.state.fillInBlankKeys.includes(questionKey)) {
      return 'Fill In Blank'
    }
  }

  getStatusFromPercentage(percentage) {
    if (percentage > 5) {
      return 'Very Weak'
    } else if (percentage > 10) {
      return 'Weak'
    } else if (percentage > 5) {
      return 'Okay'
    } else {
      return 'Strong'
    }
  }

  updateQuestionTypeFilter(e) {
    this.setState({questionType: this.getQuestionTypeFromAbbreviation(e.target.value)})
  }

  updateStatusFilter(e) {
    this.setState({status: this.getStatusFromAbbreviation(e.target.value)})
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

  renderRows() {
    const sorted = this.formatDataForTable().sort((a, b) => a[this.state.sort] - b[this.state.sort]);
    const directed = this.state.direction === 'dsc' ? sorted.reverse() : sorted;
    return _.map(directed, question => (
      <QuestionRow key={question.key} question={question} />
    ));
  }

  render() {
    const { questions, scoreAnalysis, concepts, } = this.props;
    if (questions.hasreceiveddata && scoreAnalysis.hasreceiveddata && concepts.hasreceiveddata) {
      return (
        <div>
          <select value={this.getAbbreviationFromQuestionType(this.state.questionType)} onChange={this.updateQuestionTypeFilter}>
            <option value="all">All</option>
            <option value="sc">Sentence Combining</option>
            <option value="sf">Sentence Fragment</option>
            <option value="dq">Diagnostic Question</option>
            <option value="fib">Fill In Blanks</option>
          </select>
          <select value={this.getAbbreviationFromStatus(this.state.status)} onChange={this.updateStatusFilter}>
            <option value="all">All</option>
            <option value="vw">Very Weak</option>
            <option value="w">Weak</option>
            <option value="o">Okay</option>
            <option value="s">Strong</option>
          </select>
          <p>
            <label htmlFor="minResponses">Response Threshold:</label>
            <input type="number" step="10" min="0" value={this.state.minResponses} ref="minResponses" name="minResponses" onChange={() => this.setState({ minResponses: this.refs.minResponses.value, })} style={{ fontSize: '1.25em', width: '100px', }} />
          </p>
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
