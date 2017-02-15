import React, { Component } from 'react';
import { connect } from 'react-redux';
import scoreActions from '../../actions/scoreAnalysis.js';
import LoadingSpinner from '../shared/spinner.jsx';
import { hashToCollection } from '../../libs/hashToCollection.js';
import { Link } from 'react-router';

class ScoreAnalysis extends Component {
  constructor(props) {
    super();
    this.state = {
      sort: 'commonUnmatched',
      direction: 'dsc',
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
    const { questions, scoreAnalysis, } = this.props;
    const formatted = _.map(hashToCollection(questions.data), (question) => {
      const scoreData = scoreAnalysis.data[question.key];
      if (scoreData) {
        return {
          key: question.key,
          prompt: question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''),
          responses: scoreData.responses || 0,
          attempts: scoreData.totalAttempts || 0,
          unmatched: scoreData.unmatchedResponses || 0,
          commonUnmatched: scoreData.commonUnmatchedResponses || 0,
        };
      }
    });
    return _.compact(formatted);
  }

  renderRows() {
    const sorted = _.sortBy(this.formatDataForTable(), this.state.sort);
    const directed = this.state.direction === 'dsc' ? sorted.reverse() : sorted;
    return _.map(directed, question => (
      <tr>
        <td width="600px"><Link to={`/admin/questions/${question.key}`}>{question.prompt}</Link></td>
        <td>{question.commonUnmatched}</td>
        <td>{question.unmatched}</td>
        <td>{question.responses}</td>
        <td>{question.attempts}</td>
      </tr>
      ));
  }

  render() {
    const { questions, scoreAnalysis, } = this.props;
    if (questions.hasreceiveddata && scoreAnalysis.hasreceiveddata) {
      return (
        <div>
          <table className="table is-striped is-bordered">
            <thead>
              <tr>
                <th width="600px" onClick={this.clickSort.bind(this, 'prompt')}>Prompt</th>
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
    scoreAnalysis: state.scoreAnalysis,
    routing: state.routing,
  };
}

export default connect(select)(ScoreAnalysis);
