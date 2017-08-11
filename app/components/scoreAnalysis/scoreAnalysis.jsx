import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  loadScoreData,
  checkTimeout
} from '../../actions/scoreAnalysis.js';
import LoadingSpinner from '../shared/spinner.jsx';
import QuestionRow from './questionRow.jsx';
import { hashToCollection } from '../../libs/hashToCollection.js';
import _ from 'underscore';

class ScoreAnalysis extends Component {
  constructor(props) {
    super();
    this.state = {
      sort: 'percentWeak',
      direction: 'dsc',
      minResponses: 150,
    };
  }

  componentWillMount() {
    checkTimeout();
    this.props.dispatch(loadScoreData());
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

  formatDataForTable() {
    const { questions, concepts, scoreAnalysis, } = this.props;
    const validConcepts = _.map(concepts.data[0], con => con.uid);
    const formatted = _.map(hashToCollection(questions.data).filter(e => validConcepts.includes(e.conceptID)), (question) => {
      const scoreData = scoreAnalysis.data[question.key];
      if (scoreData && scoreData.total_attempts >= this.state.minResponses) {
        return {
          key: question.key,
          prompt: question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''),
          responses: scoreData.responses || 0,
          attempts: scoreData.total_attempts || 0,
          unmatched: scoreData.unmatched_responses || 0,
          commonUnmatched: scoreData.common_unmatched_attempts || 0,
          percentWeak: scoreData.common_matched_attempts > 0 ? ((scoreData.common_unmatched_attempts || 0) / scoreData.common_matched_attempts * 100).toFixed(2) : 0.0,
          hasModelConcept: !!question.modelConceptUID,
          focusPoints: question.focusPoints ? Object.keys(question.focusPoints).length : 0,
          incorrectSequences: question.incorrectSequences ? Object.keys(question.incorrectSequences).length : 0,
        };
      }
    });
    return _.compact(formatted);
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
          <p style={{ fontSize: '1.5em', textAlign: 'center', margin: '0.75em 0', }}><label htmlFor="minResponses">Show questions with a minimum of </label>
            <input type="number" step="10" min="0" value={this.state.minResponses} ref="minResponses" name="minResponses" onChange={() => this.setState({ minResponses: this.refs.minResponses.value, })} style={{ fontSize: '1.25em', width: '100px', }} />
            <label htmlFor="minResponses"> total responses.</label></p>
          <table className="table is-striped is-bordered">
            <thead>
              <tr>
                <th width="600px" onClick={this.clickSort.bind(this, 'prompt')}>Prompt</th>
                <th onClick={this.clickSort.bind(this, 'percentWeak')}>Weak (%)</th>
                <th onClick={this.clickSort.bind(this, 'commonUnmatched')}>Common Unmatched</th>
                <th onClick={this.clickSort.bind(this, 'unmatched')}>Unmatched</th>
                <th onClick={this.clickSort.bind(this, 'responses')}>Responses</th>
                <th onClick={this.clickSort.bind(this, 'attempts')}>Attempts</th>
                <th onClick={this.clickSort.bind(this, 'hasModelConcept')}>Has Model Concept</th>
                <th onClick={this.clickSort.bind(this, 'focusPoints')}>Focus Points</th>
                <th onClick={this.clickSort.bind(this, 'incorrectSequences')}>Incorrect Sequences</th>
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
    concepts: state.concepts,
    scoreAnalysis: state.scoreAnalysis,
    routing: state.routing,
  };
}

export default connect(select)(ScoreAnalysis);
