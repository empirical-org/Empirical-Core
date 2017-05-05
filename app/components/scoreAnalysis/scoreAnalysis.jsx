import React, { Component } from 'react';
import { connect } from 'react-redux';
import scoreActions from '../../actions/scoreAnalysis.js';
import LoadingSpinner from '../shared/spinner.jsx';
import { hashToCollection } from '../../libs/hashToCollection.js';
import { Link } from 'react-router';
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
    this.props.dispatch(scoreActions.loadScoreData());
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
      if (scoreData && scoreData.totalAttempts >= this.state.minResponses) {
        return {
          key: question.key,
          prompt: question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''),
          responses: scoreData.responses || 0,
          attempts: scoreData.totalAttempts || 0,
          unmatched: scoreData.unmatchedResponses || 0,
          commonUnmatched: scoreData.commonUnmatchedResponses || 0,
          percentWeak: scoreData.commonMatchedAttempts > 0 ? ((scoreData.commonUnmatchedAttempts || 0) / scoreData.commonMatchedAttempts * 100).toFixed(2) : 0.0,
        };
      }
    });
    return _.compact(formatted);
  }

  renderRows() {
    const sorted = this.formatDataForTable().sort((a, b) => a[this.state.sort] - b[this.state.sort]);
    const directed = this.state.direction === 'dsc' ? sorted.reverse() : sorted;
    return _.map(directed, question => (
      <tr key={question.key}>
        <td width="600px"><Link to={`/admin/questions/${question.key}`}>{question.prompt}</Link></td>
        <td>{question.percentWeak}</td>
        <td>{question.commonUnmatched}</td>
        <td>{question.unmatched}</td>
        <td>{question.responses}</td>
        <td>{question.attempts}</td>
      </tr>
      ));
  }

  render() {
    const { questions, scoreAnalysis, concepts, } = this.props;
    if (questions.hasreceiveddata && scoreAnalysis.hasreceiveddata && concepts.hasreceiveddata) {
      return (
        <div>
          <p style={{fontSize: '1.5em', textAlign: 'center', margin: '0.75em 0'}}><label htmlFor="minResponses">Show questions with a minimum of </label>
          <input type="number" step="10" min="0" value={this.state.minResponses} ref="minResponses" name="minResponses" onChange={() => this.setState({minResponses: this.refs.minResponses.value})} style={{fontSize: '1.25em', width: '100px'}}/>
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
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (<LoadingSpinner />);
    }
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
