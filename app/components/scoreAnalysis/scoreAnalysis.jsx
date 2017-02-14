import React, { Component } from 'react';
import { connect } from 'react-redux';
import scoreActions from '../../actions/scoreAnalysis.js';
import LoadingSpinner from '../shared/spinner.jsx';
import { hashToCollection } from '../../libs/hashToCollection.js';

class ScoreAnalysis extends Component {
  constructor(props) {
    super();
  }

  componentWillMount() {
    this.props.dispatch(scoreActions.loadScoreData());
  }

  formatDataForTable() {
    const { questions, scoreAnalysis, } = this.props;
    const formatted = _.map(hashToCollection(questions.data), (question) => {
      const scoreData = scoreAnalysis.data[question.key];
      if (scoreData) {
        return {
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
    return _.map(this.formatDataForTable(), question => (
      <tr>
        <td width="600px">{question.prompt}</td>
        <td>{question.unmatched}</td>
        <td>{question.commonUnmatched}</td>
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
                <th width="600px">Name</th>
                <th>Unmatched</th>
                <th>Common Unmatched</th>
                <th>Responses</th>
                <th>Attempts</th>
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
